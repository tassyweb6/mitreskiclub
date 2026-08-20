(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory();
    else if (typeof define === "function" && define.amd) define([], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory();
})(this, function() {
    "use strict";
    const { useState, useEffect, useRef } = React;
    /* ── URL routing ─────────────────────────────────────────── */ const PAGE = (()=>{
        const p = window.location.pathname.split('/').pop().replace('.html', '');
        return !p || p === 'index' ? 'home' : p;
    })();
    const ART_ID = new URLSearchParams(window.location.search).get('id');
    const onNav = (page, id = null)=>{
        const map = {
            home: 'index',
            lodge: 'lodge',
            buller: 'buller',
            news: 'news',
            article: 'article',
            enquiries: 'enquiries',
            login: 'login',
            directions: 'directions',
            shop: 'shop',
            gallery: 'gallery'
        };
        const f = (map[page] || page) + '.html';
        window.location.href = id ? `${f}?id=${encodeURIComponent(id)}` : f;
    };
    const onLogin = ()=>{
        window.location.href = 'login.html';
    };
    /* ── Sanity data layer ───────────────────────────────────── */ const SANITY = window.__SANITY__ || {
        projectId: '3c10guha',
        dataset: 'production'
    };
    function sanityImageUrl(src, { w, h, q = 80 } = {}) {
        if (!src || !src.asset) return null;
        const ref = src.asset._ref || src.asset._id || '';
        const m = ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/);
        if (!m) return null;
        const [, id, dims, fmt] = m;
        let url = `https://cdn.sanity.io/images/${SANITY.projectId}/${SANITY.dataset}/${id}-${dims}.${fmt}`;
        const qs = [];
        if (w) qs.push(`w=${w}`);
        if (h) qs.push(`h=${h}`);
        qs.push(`q=${q}`, 'fit=max', 'auto=format');
        return url + '?' + qs.join('&');
    }
    function sanityFetch(query, params = {}) {
        const qs = new URLSearchParams({
            query
        });
        for (const [k, v] of Object.entries(params))qs.set('$' + k, JSON.stringify(v));
        const url = `https://${SANITY.projectId}.apicdn.sanity.io/v2024-01-01/data/query/${SANITY.dataset}?${qs.toString()}`;
        return fetch(url).then((r)=>r.json()).then((r)=>r.result);
    }
    function useSanityQuery(query, params, deps = []) {
        const [data, setData] = useState(null);
        const [loading, setLoading] = useState(true);
        useEffect(()=>{
            let cancelled = false;
            setLoading(true);
            sanityFetch(query, params).then((r)=>{
                if (!cancelled) {
                    setData(r);
                    setLoading(false);
                }
            }).catch(()=>{
                if (!cancelled) {
                    setData(null);
                    setLoading(false);
                }
            });
            return ()=>{
                cancelled = true;
            };
        // eslint-disable-next-line
        }, deps);
        return [
            data,
            loading
        ];
    }
    function readingTimeLabel(n) {
        return n ? `${n} min` : '';
    }
    function timeAgo(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr), now = new Date();
        const days = Math.floor((now - d) / 86400000);
        if (days <= 0) return 'today';
        if (days === 1) return '1 day ago';
        if (days < 14) return `${days} days ago`;
        const weeks = Math.floor(days / 7);
        if (weeks < 8) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        return d.toLocaleDateString('en-AU', {
            month: 'short',
            year: 'numeric'
        });
    }
    function formatDate(dateStr) {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-AU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }
    /* ── minimal Portable Text renderer (paragraphs, headings, marks, links) ── */ function PortableText({ blocks }) {
        if (!blocks) return null;
        return blocks.map((block, i)=>{
            if (block._type !== 'block') return null;
            const children = (block.children || []).map((span, j)=>{
                const marks = span.marks || [];
                const linkDef = marks.map((m)=>(block.markDefs || []).find((d)=>d._key === m && d._type === 'link')).find(Boolean);
                let el = span.text;
                if (marks.includes('strong')) el = /*#__PURE__*/ React.createElement("strong", {
                    key: j
                }, el);
                if (marks.includes('em')) el = /*#__PURE__*/ React.createElement("em", {
                    key: j
                }, el);
                if (marks.includes('underline')) el = /*#__PURE__*/ React.createElement("u", {
                    key: j
                }, el);
                if (linkDef) el = /*#__PURE__*/ React.createElement("a", {
                    key: j,
                    href: linkDef.href,
                    target: "_blank",
                    rel: "noopener noreferrer"
                }, el);
                return /*#__PURE__*/ React.createElement(React.Fragment, {
                    key: j
                }, el);
            });
            const style = block.style || 'normal';
            if (style === 'h1') return /*#__PURE__*/ React.createElement("h2", {
                key: i
            }, children);
            if (style === 'h2') return /*#__PURE__*/ React.createElement("h3", {
                key: i
            }, children);
            if (style === 'h3') return /*#__PURE__*/ React.createElement("h4", {
                key: i
            }, children);
            if (style === 'blockquote') return /*#__PURE__*/ React.createElement("blockquote", {
                key: i
            }, children);
            return /*#__PURE__*/ React.createElement("p", {
                key: i
            }, children);
        });
    }
    /* ── scroll reveal ───────────────────────────────────────── */ function useReveal(opts = {}) {
        const ref = useRef(null);
        const [vis, setVis] = useState(false);
        useEffect(()=>{
            const el = ref.current;
            if (!el) return;
            const io = new IntersectionObserver(([e])=>{
                if (e.isIntersecting) {
                    setVis(true);
                    io.disconnect();
                }
            }, {
                threshold: opts.th || 0.1,
                rootMargin: '0px 0px -40px 0px'
            });
            io.observe(el);
            return ()=>io.disconnect();
        }, []);
        return [
            ref,
            vis
        ];
    }
    /* ── cursor & scroll progress ────────────────────────────── */ function GlobalFX() {
        useEffect(()=>{
            const cur = document.getElementById('cursor'), ring = document.getElementById('cursor-ring'), bar = document.getElementById('scroll-progress');
            if (!cur || !ring) return;
            let mx = 0, my = 0, rx = 0, ry = 0;
            const onMove = (e)=>{
                mx = e.clientX;
                my = e.clientY;
                cur.style.left = mx + 'px';
                cur.style.top = my + 'px';
            };
            const trackRing = ()=>{
                rx += (mx - rx) * .18;
                ry += (my - ry) * .18;
                ring.style.left = rx + 'px';
                ring.style.top = ry + 'px';
                requestAnimationFrame(trackRing);
            };
            const onScroll = ()=>{
                const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
                bar.style.width = pct + '%';
            };
            const onDown = ()=>cur.classList.add('is-clicking');
            const onUp = ()=>cur.classList.remove('is-clicking');
            const onHover = (e)=>{
                const t = e.target.closest('a,button,.news-card,.feat,.forecast-card,.gear-card,.gallery-item,.review-card,.useful-link-card');
                cur.classList.toggle('is-hovering', !!t);
                ring.classList.toggle('is-hovering', !!t);
            };
            document.addEventListener('mousemove', onMove, {
                passive: true
            });
            document.addEventListener('mouseover', onHover);
            document.addEventListener('mousedown', onDown);
            document.addEventListener('mouseup', onUp);
            window.addEventListener('scroll', onScroll, {
                passive: true
            });
            requestAnimationFrame(trackRing);
            return ()=>{
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseover', onHover);
                document.removeEventListener('mousedown', onDown);
                document.removeEventListener('mouseup', onUp);
                window.removeEventListener('scroll', onScroll);
            };
        }, []);
        return null;
    }
    /* ── icon ────────────────────────────────────────────────── */ function Icon({ name, size = 18, stroke = 1.6 }) {
        const p = {
            width: size,
            height: size,
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: stroke,
            strokeLinecap: "round",
            strokeLinejoin: "round"
        };
        const paths = {
            arrow: /*#__PURE__*/ React.createElement("path", {
                d: "M5 12h14M13 5l7 7-7 7"
            }),
            'arrow-up-right': /*#__PURE__*/ React.createElement("path", {
                d: "M7 17 17 7M8 7h9v9"
            }),
            menu: /*#__PURE__*/ React.createElement("path", {
                d: "M3 6h18M3 12h18M3 18h18"
            }),
            close: /*#__PURE__*/ React.createElement("path", {
                d: "M6 6l12 12M6 18 18 6"
            }),
            lock: /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("rect", {
                x: "4",
                y: "11",
                width: "16",
                height: "10",
                rx: "2"
            }), /*#__PURE__*/ React.createElement("path", {
                d: "M8 11V8a4 4 0 0 1 8 0v3"
            })),
            calendar: /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("rect", {
                x: "3",
                y: "5",
                width: "18",
                height: "16",
                rx: "2"
            }), /*#__PURE__*/ React.createElement("path", {
                d: "M3 9h18M8 3v4M16 3v4"
            })),
            snow: /*#__PURE__*/ React.createElement("path", {
                d: "M12 2v20M4 6l16 12M20 6 4 18M2 12h20"
            }),
            thermometer: /*#__PURE__*/ React.createElement("path", {
                d: "M14 14.76V4a2 2 0 0 0-4 0v10.76a4 4 0 1 0 4 0Z"
            }),
            mountain: /*#__PURE__*/ React.createElement("path", {
                d: "m3 20 6-10 4 6 3-4 5 8z"
            }),
            'map-pin': /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
                d: "M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13Z"
            }), /*#__PURE__*/ React.createElement("circle", {
                cx: "12",
                cy: "9",
                r: "3"
            })),
            external: /*#__PURE__*/ React.createElement("path", {
                d: "M14 4h6v6M20 4 10 14M16 13v7H4V8h7"
            }),
            check: /*#__PURE__*/ React.createElement("path", {
                d: "M5 12l4 4L19 6"
            }),
            instagram: /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("rect", {
                x: "3",
                y: "3",
                width: "18",
                height: "18",
                rx: "5"
            }), /*#__PURE__*/ React.createElement("circle", {
                cx: "12",
                cy: "12",
                r: "4"
            }), /*#__PURE__*/ React.createElement("circle", {
                cx: "17.5",
                cy: "6.5",
                r: "0.6",
                fill: "currentColor"
            })),
            facebook: /*#__PURE__*/ React.createElement("path", {
                d: "M16 2h-3a5 5 0 0 0-5 5v3H5v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
            }),
            'cloud-snow': /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
                d: "M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"
            }), /*#__PURE__*/ React.createElement("path", {
                d: "M8 19v.01M8 22v.01M12 18v.01M12 21v.01M16 19v.01M16 22v.01"
            })),
            users: /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
                d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
            }), /*#__PURE__*/ React.createElement("circle", {
                cx: "9",
                cy: "7",
                r: "4"
            }), /*#__PURE__*/ React.createElement("path", {
                d: "M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
            })),
            sun: /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("circle", {
                cx: "12",
                cy: "12",
                r: "4"
            }), /*#__PURE__*/ React.createElement("path", {
                d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            })),
            camera: /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
                d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
            }), /*#__PURE__*/ React.createElement("circle", {
                cx: "12",
                cy: "13",
                r: "4"
            })),
            tag: /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
                d: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
            }), /*#__PURE__*/ React.createElement("line", {
                x1: "7",
                y1: "7",
                x2: "7.01",
                y2: "7"
            })),
            car: /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("rect", {
                x: "1",
                y: "3",
                width: "15",
                height: "13"
            }), /*#__PURE__*/ React.createElement("path", {
                d: "M16 8h4l3 3v5h-7V8z"
            }), /*#__PURE__*/ React.createElement("circle", {
                cx: "5.5",
                cy: "18.5",
                r: "2.5"
            }), /*#__PURE__*/ React.createElement("circle", {
                cx: "18.5",
                cy: "18.5",
                r: "2.5"
            })),
            bus: /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
                d: "M8 6v4M16 6v4M2 11h20M18 3H6a2 2 0 0 0-2 2v13h16V5a2 2 0 0 0-2-2zM6 19v2M18 19v2"
            }), /*#__PURE__*/ React.createElement("circle", {
                cx: "8",
                cy: "15",
                r: ".5",
                fill: "currentColor"
            }), /*#__PURE__*/ React.createElement("circle", {
                cx: "16",
                cy: "15",
                r: ".5",
                fill: "currentColor"
            })),
            info: /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("circle", {
                cx: "12",
                cy: "12",
                r: "10"
            }), /*#__PURE__*/ React.createElement("line", {
                x1: "12",
                y1: "8",
                x2: "12",
                y2: "12"
            }), /*#__PURE__*/ React.createElement("line", {
                x1: "12",
                y1: "16",
                x2: "12.01",
                y2: "16"
            })),
            'shopping-bag': /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
                d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
            }), /*#__PURE__*/ React.createElement("line", {
                x1: "3",
                y1: "6",
                x2: "21",
                y2: "6"
            }), /*#__PURE__*/ React.createElement("path", {
                d: "M16 10a4 4 0 0 1-8 0"
            })),
            star: /*#__PURE__*/ React.createElement("polygon", {
                points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            })
        };
        return /*#__PURE__*/ React.createElement("svg", p, paths[name] || null);
    }
    /* ── Star rating ─────────────────────────────────────────── */ function Stars({ n = 5, size = 14 }) {
        return /*#__PURE__*/ React.createElement("div", {
            className: "stars"
        }, [
            1,
            2,
            3,
            4,
            5
        ].map((i)=>/*#__PURE__*/ React.createElement("svg", {
                key: i,
                width: size,
                height: size,
                viewBox: "0 0 24 24",
                fill: i <= n ? 'currentColor' : 'none',
                stroke: "currentColor",
                strokeWidth: "1.5"
            }, /*#__PURE__*/ React.createElement("polygon", {
                points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            }))));
    }
    /* ── Reveal wrapper ──────────────────────────────────────── */ function R({ children, d = 0, type = 'reveal', className = '' }) {
        const [ref, vis] = useReveal();
        return /*#__PURE__*/ React.createElement("div", {
            ref: ref,
            className: `${type} d${d} ${vis ? 'is-visible' : ''} ${className}`
        }, children);
    }
    /* ── Photo ───────────────────────────────────────────────── */ const TONES = {
        glacier: 'linear-gradient(135deg,#4A92BE 0%,#1F3F73 100%)',
        deep: 'linear-gradient(160deg,#1F3F73 0%,#0E1C36 100%)',
        sky: 'linear-gradient(180deg,#DCEEF8 0%,#8EC5E0 100%)',
        sunset: 'linear-gradient(135deg,#E8A24A 0%,#C8443B 60%,#1F3F73 100%)',
        morning: 'linear-gradient(180deg,#F2F5F8 0%,#DCEEF8 60%,#8EC5E0 100%)'
    };
    /* convert src like "assets/photo-foo.jpg" → webp variant path */ function webp(src) {
        return src ? src.replace(/\.(jpg|jpeg|png)$/i, '.webp') : src;
    }
    /* standalone picture element with WebP + fallback */ function Pic({ src, alt = '', className = '', style = {}, priority = false }) {
        return /*#__PURE__*/ React.createElement("picture", null, /*#__PURE__*/ React.createElement("source", {
            srcSet: webp(src),
            type: "image/webp"
        }), /*#__PURE__*/ React.createElement("img", {
            src: src,
            alt: alt,
            className: className || undefined,
            style: Object.keys(style).length ? style : undefined,
            loading: priority ? 'eager' : 'lazy',
            decoding: priority ? 'sync' : 'async',
            fetchPriority: priority ? 'high' : 'auto'
        }));
    }
    function Photo({ ratio = '4/3', tone = 'glacier', src, label, className = '', pos = 'center', priority = false }) {
        return /*#__PURE__*/ React.createElement("div", {
            className: 'photo ' + className,
            style: {
                aspectRatio: ratio,
                background: src ? '#0E1C36' : TONES[tone] || TONES.glacier
            }
        }, src ? /*#__PURE__*/ React.createElement("picture", null, /*#__PURE__*/ React.createElement("source", {
            srcSet: webp(src),
            type: "image/webp"
        }), /*#__PURE__*/ React.createElement("img", {
            src: src,
            alt: label || '',
            style: {
                objectPosition: pos
            },
            loading: priority ? 'eager' : 'lazy',
            decoding: priority ? 'sync' : 'async',
            fetchPriority: priority ? 'high' : 'auto'
        })) : /*#__PURE__*/ React.createElement("svg", {
            viewBox: "0 0 400 300",
            preserveAspectRatio: "none",
            style: {
                position: 'absolute',
                inset: 'auto 0 0 0',
                width: '100%',
                height: '70%'
            },
            "aria-hidden": true
        }, /*#__PURE__*/ React.createElement("polygon", {
            points: "0,300 70,160 140,210 200,90 270,180 340,140 400,220 400,300",
            fill: "rgba(255,255,255,0.08)"
        }), /*#__PURE__*/ React.createElement("polygon", {
            points: "0,300 50,220 130,250 220,180 310,230 400,200 400,300",
            fill: "rgba(0,0,0,0.18)"
        })), label && !src && /*#__PURE__*/ React.createElement("span", {
            className: "photo-label"
        }, label));
    }
    /* ── Logo ────────────────────────────────────────────────── */ function Logo({ height = 36, mono = false }) {
        const w = Math.round(height * (2048 / 320));
        const c = (col, monoCol = '#fff')=>mono ? monoCol : col;
        return /*#__PURE__*/ React.createElement("svg", {
            role: "img",
            "aria-label": "Mitre Ski Club",
            width: w,
            height: height,
            viewBox: "0 0 2048 320",
            xmlns: "http://www.w3.org/2000/svg",
            style: {
                display: 'block',
                flexShrink: 0
            }
        }, /*#__PURE__*/ React.createElement("path", {
            transform: "translate(506,29)",
            d: "m0 0 5 4 9 11 11 12 9 11 12 13 9 11 13 14 9 11 12 13 9 11 11 12 9 11 10 11 9 11 12 13 9 11 9 10 4 5v2l-65-3-29-1-47-1h-63l-60 2-44 2-13 1h-21v-2l5-4 7-8 12-14 26-30 10-11 9-11 12-13 9-11 13-14 9-11 10-11 9-11 12-13 9-11 10-11 7-8z",
            fill: c('#3D5D99')
        }), /*#__PURE__*/ React.createElement("path", {
            transform: "translate(494,230)",
            d: "m0 0h17l83 2 57 3 63 5 47 5 49 7 50 9 39 9 35 10 23 8 4 3-20-2-46-4-76-5-95-4-62-2-89-1h-132l-91 1-94 3-80 4-84 6-34 3h-6l2-2 31-10 41-11 37-8 60-10 46-6 53-5 54-4 66-3z",
            fill: c('#5BA8D6')
        }), /*#__PURE__*/ React.createElement("path", {
            transform: "translate(323,67)",
            d: "m0 0 5 1 4 5 8 7 41 41 8 7 6 5-18 21-10 11-9 11-12 13-9 11-11 12-9 11-5 5-13 2-55 6-47 7-39 7-25 5 2-4 30-30 8-7 42-42 8-7 31-31 8-7 36-36 8-7z",
            fill: c('#5AA7D5')
        }), /*#__PURE__*/ React.createElement("path", {
            transform: "translate(674,66)",
            d: "m0 0 7 6 13 13 8 7 25 25 8 7 28 28 8 7 50 50 8 7 34 34-3 1-33-6-31-5-64-8-48-5-5-5-10-11-7-8-11-13-9-10-9-11-12-13-9-11-8-8 1-4 16-15 34-34 8-7z",
            fill: c('#5BA8D6')
        }), /*#__PURE__*/ React.createElement("path", {
            transform: "translate(505,64)",
            d: "m0 0 4 2 9 11 11 13 9 11 14 17 9 10 2 4-5-1-16-10-16-9-4-3-2 4-9 11-9 12-10 13-2-1 6-30 1-2-27 21-17 13-14 11-18 14-17 14-4 3-2-1 7-9 24-28 9-11 12-14 11-13 9-11 24-28 9-11z",
            fill: c('rgba(255,255,255,0.9)', 'rgba(255,255,255,0.35)')
        }), /*#__PURE__*/ React.createElement("path", {
            transform: "translate(678,102)",
            d: "m0 0 4 1 12 11 10 9 14 13 8 7 17 16 10 9 8 7 17 16 12 11 8 7 11 10-4 1-26-11-30-11-33-10-25-6-3-3 6-2 21-3h22l-5-5-13-11-18-13-18-10-17-7-12-3 1-3 9-7z",
            fill: c('rgba(255,255,255,0.9)', 'rgba(255,255,255,0.35)')
        }), /*#__PURE__*/ React.createElement("path", {
            transform: "translate(317,102)",
            d: "m0 0 5 1 13 13 9 7-1 2-20 6-20 10-16 11-14 11-11 9-1 2h24l19 3 5 2-1 3-29 7-27 8-33 12-26 11h-3l2-4 10-9 13-12 12-11 20-18 13-12 8-7 17-16 20-18z",
            fill: c('rgba(255,255,255,0.9)', 'rgba(255,255,255,0.35)')
        }), /*#__PURE__*/ React.createElement("path", {
            transform: "translate(924,122)",
            d: "m0 0h34l17 2 11 4 6 7 1 8-4 23-7 32-2 3-17-1 2-12 7-32v-11l-4-3-6-2-13-1-6 25-8 35-3 2-16-1 1-9 11-50v-2l-15 1-10 3-2 4-3 7-10 46-1 1h-17l-1-3 11-49 5-12 7-7 11-5 9-2z",
            fill: c('#3E5F9B')
        }), /*#__PURE__*/ React.createElement("path", {
            transform: "translate(1051,122)",
            d: "m0 0h71l-1 9-2 7h-29l-4 18-10 44-1 1h-15l-3-2 9-41 4-19-28-1 3-15z",
            fill: c('#3E609B')
        }), /*#__PURE__*/ React.createElement("path", {
            transform: "translate(1151,122)",
            d: "m0 0h37l12 3 6 4 5 8 1 4v14l-4 11-7 9-9 8-3 2 2 5 5 8v2h-20l-7-12-28-1-1 8-2 5-4 1-14-1-1-2 6-25 10-47 1-3z",
            fill: c('#3E5F9B')
        }), /*#__PURE__*/ React.createElement("path", {
            transform: "translate(1152,138)",
            d: "m0 0h26l9 2 5 6 1 8-4 9-5 5-6 3h-33l1-8 5-23z",
            fill: mono ? '#0B111B' : '#FAFBFC'
        }), /*#__PURE__*/ React.createElement("path", {
            transform: "translate(1263,122)",
            d: "m0 0h36l11 1-2 11-2 4-39 1-12 2-5 2-2 4-2 5 45 1 1 2-3 13-1 1-45 1-1 1 1 8 5 4 48 1 1 2-4 14-8 1h-40l-9-1-9-6-4-8-1-12 3-17 6-15 7-10 6-5 10-4z",
            fill: c('#3F619C')
        }), /*#__PURE__*/ React.createElement("path", {
            transform: "translate(1407,122)",
            d: "m0 0h48l1 2-4 15-49 1-9 2-6 4-5 7h66l-2 11-6 15-7 9-9 8-11 4-10 1h-49l-1-1 1-10 2-6 52-1 7-3 6-5 4-6h-66l3-13 6-14 9-10 8-6 10-3z",
            fill: c('#3E5F9A')
        }), /*#__PURE__*/ React.createElement("path", {
            transform: "translate(1476,122)",
            d: "m0 0h12l-1 11-4 18-1 2h21l8-7 23-23 2-1h18l-2 4-9 9-7 8-16 17-1 3 11 22 7 12v4h-18l-4-5-14-25-22-1-4 19-3 11-1 1h-10l-8-1 2-11 14-65z",
            fill: c('#3E609B')
        }), /*#__PURE__*/ React.createElement("path", {
            transform: "translate(1018,122)",
            d: "m0 0h13l-1 10-15 68-1 1h-9l-9-1 1-8 14-65 1-4z",
            fill: c('#3E609B')
        }), /*#__PURE__*/ React.createElement("path", {
            transform: "translate(1566,122)",
            d: "m0 0h14l5 1-4 19-12 56-2 3h-17l-1-3 11-51 5-22z",
            fill: c('#3F619C')
        }), /*#__PURE__*/ React.createElement("path", {
            transform: "translate(1676,122)",
            d: "m0 0h41l5 1-2 12-1 3-43 1-9 2-6 5-4 10-3 16 1 7 2 3 3 1 35 1 14 1-3 15-1 1h-50l-9-2-7-5-4-10v-17l4-15 8-16 5-6 10-6z",
            fill: c('#3F619C')
        }), /*#__PURE__*/ React.createElement("path", {
            transform: "translate(1737,122)",
            d: "m0 0h18l-1 9-8 38v9l3 4 3 1 45 1 4 2-5 15h-51l-9-3-7-6-3-9v-13l8-39z",
            fill: c('#3F619C')
        }), /*#__PURE__*/ React.createElement("path", {
            transform: "translate(1829,122)",
            d: "m0 0 17 1-2 12-8 36v6l5 5 8 2h16l9-2 6-5 4-12 9-41 1-1 9-1h9l1 2-10 45-4 12-5 8-7 6-12 4-15 2h-14l-14-2-9-4-5-5-2-4v-10l8-38 4-15z",
            fill: c('#3E5F9B')
        }), /*#__PURE__*/ React.createElement("path", {
            transform: "translate(1936,122)",
            d: "m0 0h41l12 2 9 5 6 9 1 4v14l-4 17-7 12-8 8-12 6-11 2h-52l-1-4 12-55 4-18 1-1z",
            fill: c('#3E5F9B')
        }), /*#__PURE__*/ React.createElement("path", {
            transform: "translate(1936,169)",
            d: "m0 0h46l-1 5-5 7-8 4-9 1h-26l-1-4 3-12z",
            fill: mono ? '#0B111B' : '#FAFBFC'
        }), /*#__PURE__*/ React.createElement("path", {
            transform: "translate(1942,139)",
            d: "m0 0h31l9 3 3 4 1 7h-47l1-8z",
            fill: mono ? '#0B111B' : '#FAFBFC'
        }));
    }
    /* ── GROQ ────────────────────────────────────────────────── */ const SITE_QUERY = `{
  "settings":*[_id=="siteSettings"][0],
  "nav":*[_id=="navigation"][0],
  "band":*[_id=="memberBand"][0]
}`;
    const PAGE_QUERY = `*[_type=="page" && slug.current==$slug][0]{
  title,headerStyle,breadcrumb,showConditionsStrip,showMemberBand,header,content,seo
}`;
    /* ── link helpers ────────────────────────────────────────── */ const relFor = (l)=>l && l.newTab ? 'noopener noreferrer' : undefined;
    const targetFor = (l)=>l && l.newTab ? '_blank' : undefined;
    function L({ link, className, style, children }) {
        if (!link || !link.href) return null;
        return /*#__PURE__*/ React.createElement("a", {
            href: link.href,
            target: targetFor(link),
            rel: relFor(link),
            className: className,
            style: style
        }, children || link.label, link.icon && /*#__PURE__*/ React.createElement(Icon, {
            name: link.icon,
            size: 13
        }));
    }
    function CTA({ cta, size = '', className = '' }) {
        if (!cta || !cta.href) return null;
        const style = cta.style || 'cta';
        return /*#__PURE__*/ React.createElement("a", {
            className: `btn btn-${style} ${size} ${className}`.trim(),
            href: cta.href,
            target: targetFor(cta),
            rel: relFor(cta)
        }, cta.icon && /*#__PURE__*/ React.createElement(Icon, {
            name: cta.icon,
            size: 15
        }), " ", cta.label, " ", /*#__PURE__*/ React.createElement("span", {
            className: "arrow"
        }, "→"));
    }
    function SectionHead({ heading, light }) {
        if (!heading) return null;
        const { eyebrow, heading: h, intro } = heading;
        if (!eyebrow && !h && !intro) return null;
        return /*#__PURE__*/ React.createElement("div", {
            className: "section-head"
        }, eyebrow && /*#__PURE__*/ React.createElement("span", {
            className: "eyebrow",
            style: light ? {
                color: 'var(--brand-ice)'
            } : undefined
        }, eyebrow), h && /*#__PURE__*/ React.createElement("h2", {
            style: {
                marginTop: 14
            }
        }, h), intro && /*#__PURE__*/ React.createElement("p", {
            className: "lead",
            style: {
                color: 'var(--ink-muted)'
            }
        }, intro));
    }
    /** Accepts any YouTube URL shape and returns the /embed/ form. */ function youtubeEmbedUrl(url) {
        if (!url) return null;
        const m = url.match(/(?:youtu\.be\/|\/live\/|\/embed\/|[?&]v=)([\w-]{6,})/);
        return m ? `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1` : url;
    }
    /* ── TopNav ──────────────────────────────────────────────── */ function TopNav({ nav, settings, current }) {
        const [open, setOpen] = useState(false);
        const items = nav && nav.mainNav || [];
        const extras = nav && nav.mobileExtras || [];
        const loginLabel = settings && settings.memberLoginLabel || 'Member login';
        const loginHref = settings && settings.memberLoginHref || 'login.html';
        const isActive = (href)=>{
            const f = (href || '').replace('.html', '');
            return f === current || current === 'home' && f === 'index';
        };
        return /*#__PURE__*/ React.createElement("header", {
            className: "top-nav scrolled"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "nav-inner",
            style: {
                maxWidth: 'var(--container-wide)',
                margin: '0 auto'
            }
        }, /*#__PURE__*/ React.createElement("a", {
            className: "nav-brand",
            href: "index.html"
        }, /*#__PURE__*/ React.createElement(Logo, {
            height: 44
        })), /*#__PURE__*/ React.createElement("nav", {
            className: "nav-links",
            "aria-label": "Primary"
        }, items.map((l)=>/*#__PURE__*/ React.createElement("a", {
                key: l._key,
                href: l.href,
                target: targetFor(l),
                rel: relFor(l),
                className: 'nav-link ' + (isActive(l.href) ? 'active' : '')
            }, l.label))), /*#__PURE__*/ React.createElement("div", {
            className: "nav-actions"
        }, /*#__PURE__*/ React.createElement("a", {
            className: "btn btn-cta btn-sm",
            href: loginHref
        }, /*#__PURE__*/ React.createElement(Icon, {
            name: "lock",
            size: 14
        }), " ", loginLabel, " ", /*#__PURE__*/ React.createElement("span", {
            className: "arrow"
        }, "→")), /*#__PURE__*/ React.createElement("button", {
            className: "nav-burger",
            onClick: ()=>setOpen(!open),
            "aria-label": "Menu",
            "aria-expanded": open
        }, /*#__PURE__*/ React.createElement(Icon, {
            name: open ? 'close' : 'menu'
        })))), open && /*#__PURE__*/ React.createElement("div", {
            className: "nav-mobile"
        }, items.concat(extras).map((l)=>/*#__PURE__*/ React.createElement("a", {
                key: l._key,
                href: l.href,
                target: targetFor(l),
                rel: relFor(l),
                className: 'nav-link ' + (isActive(l.href) ? 'active' : '')
            }, l.label)), /*#__PURE__*/ React.createElement("a", {
            className: "btn btn-cta",
            href: loginHref
        }, /*#__PURE__*/ React.createElement(Icon, {
            name: "lock",
            size: 14
        }), " ", loginLabel, " →")));
    }
    /* ── MemberBand ──────────────────────────────────────────── */ function MemberBand({ band }) {
        const [ref, vis] = useReveal();
        if (!band) return null;
        return /*#__PURE__*/ React.createElement("section", {
            className: "member-band",
            ref: ref
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container member-band-inner"
        }, /*#__PURE__*/ React.createElement("div", {
            className: 'reveal d0 ' + (vis ? 'is-visible' : '')
        }, band.eyebrow && /*#__PURE__*/ React.createElement("span", {
            className: "eyebrow",
            style: {
                color: 'var(--brand-sky)'
            }
        }, band.eyebrow), /*#__PURE__*/ React.createElement("h2", {
            style: {
                color: '#fff',
                marginTop: 10
            }
        }, band.heading), band.body && /*#__PURE__*/ React.createElement("p", {
            style: {
                color: 'var(--snow-300)',
                maxWidth: '50ch',
                marginTop: 8
            }
        }, band.body)), /*#__PURE__*/ React.createElement("div", {
            className: 'reveal d1 member-band-cta ' + (vis ? 'is-visible' : '')
        }, /*#__PURE__*/ React.createElement(CTA, {
            cta: band.button,
            size: "btn-lg"
        }), band.footnote && /*#__PURE__*/ React.createElement("span", {
            style: {
                color: 'var(--snow-400)',
                fontSize: 13,
                marginTop: 6
            }
        }, band.footnote))));
    }
    /* ── Footer ──────────────────────────────────────────────── */ function Footer({ nav, settings }) {
        const groups = nav && nav.footerGroups || [];
        const legal = nav && nav.legalLinks || [];
        const social = settings && settings.socialLinks || [];
        return /*#__PURE__*/ React.createElement("footer", {
            className: "footer"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "footer-logo-bar"
        }, /*#__PURE__*/ React.createElement(Logo, {
            height: 48,
            mono: true
        }), /*#__PURE__*/ React.createElement("div", {
            style: {
                flex: 1,
                height: 1,
                background: 'rgba(255,255,255,.07)'
            }
        })), /*#__PURE__*/ React.createElement("div", {
            className: "footer-grid"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "footer-brand"
        }, settings && settings.tagline && /*#__PURE__*/ React.createElement("p", {
            style: {
                color: 'var(--snow-400)',
                fontSize: 14,
                lineHeight: 1.7,
                maxWidth: '36ch',
                margin: 0
            }
        }, settings.tagline), /*#__PURE__*/ React.createElement("div", {
            className: "footer-social"
        }, social.map((s)=>/*#__PURE__*/ React.createElement("a", {
                key: s._key,
                href: s.href,
                target: targetFor(s),
                rel: relFor(s),
                "aria-label": s.label
            }, /*#__PURE__*/ React.createElement(Icon, {
                name: s.icon || 'external'
            }))))), groups.map((g)=>/*#__PURE__*/ React.createElement("div", {
                key: g._key
            }, /*#__PURE__*/ React.createElement("h5", null, g.heading), (g.links || []).map((l)=>/*#__PURE__*/ React.createElement("a", {
                    key: l._key,
                    href: l.href,
                    target: targetFor(l),
                    rel: relFor(l)
                }, l.label, l.icon && /*#__PURE__*/ React.createElement(React.Fragment, null, " ", /*#__PURE__*/ React.createElement(Icon, {
                    name: l.icon,
                    size: 11
                })))))), settings && /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h5", null, "Contact"), /*#__PURE__*/ React.createElement("p", {
            className: "footer-contact"
        }, settings.organisationName, /*#__PURE__*/ React.createElement("br", null), (settings.address || '').split('\n').map((line, i)=>/*#__PURE__*/ React.createElement(React.Fragment, {
                key: i
            }, line, /*#__PURE__*/ React.createElement("br", null))), /*#__PURE__*/ React.createElement("br", null), settings.email && /*#__PURE__*/ React.createElement("a", {
            href: `mailto:${settings.email}`
        }, settings.email)))), /*#__PURE__*/ React.createElement("div", {
            className: "footer-bottom"
        }, /*#__PURE__*/ React.createElement("span", null, settings && settings.copyright), /*#__PURE__*/ React.createElement("span", null, legal.map((l, i)=>/*#__PURE__*/ React.createElement(React.Fragment, {
                key: l._key
            }, i > 0 && ' · ', /*#__PURE__*/ React.createElement("a", {
                href: l.href
            }, l.label))), nav && nav.builtByLine && /*#__PURE__*/ React.createElement(React.Fragment, null, " · ", nav.builtByLine), ' · ', /*#__PURE__*/ React.createElement("a", {
            href: "#",
            onClick: (e)=>{
                e.preventDefault();
                try {
                    localStorage.removeItem('mpa');
                } catch (_) {}
                location.replace('gate.html');
            }
        }, "Sign out of preview")))));
    }
    /* ══ BLOCKS ═══════════════════════════════════════════════ */ function HeroBlock({ b }) {
        const [loaded, setLoaded] = useState(false);
        useEffect(()=>{
            const t = setTimeout(()=>setLoaded(true), 120);
            return ()=>clearTimeout(t);
        }, []);
        const [statsRef, statsVis] = useReveal({
            th: .08
        });
        const poster = sanityImageUrl(b.posterImage, {
            w: 1600
        });
        return /*#__PURE__*/ React.createElement("section", {
            className: "hero"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "hero-media"
        }, b.backgroundVideoUrl ? /*#__PURE__*/ React.createElement("video", {
            autoPlay: true,
            muted: true,
            loop: true,
            playsInline: true,
            poster: poster,
            fetchPriority: "high",
            style: {
                width: '100%',
                height: '100%',
                objectFit: 'cover'
            }
        }, /*#__PURE__*/ React.createElement("source", {
            src: b.backgroundVideoUrl,
            type: "video/mp4"
        })) : poster && /*#__PURE__*/ React.createElement("img", {
            src: poster,
            alt: "",
            style: {
                width: '100%',
                height: '100%',
                objectFit: 'cover'
            }
        })), /*#__PURE__*/ React.createElement("div", {
            className: "hero-overlay"
        }), /*#__PURE__*/ React.createElement("div", {
            className: "snow-particles",
            "aria-hidden": true
        }, [
            ...Array(16)
        ].map((_, i)=>/*#__PURE__*/ React.createElement("div", {
                key: i,
                className: "snowflake",
                style: {
                    left: `${(i * 6.3 + 2) % 100}%`,
                    animationDelay: `${i * .45 % 6}s`,
                    animationDuration: `${6 + i % 4}s`,
                    width: `${3 + i % 3}px`,
                    height: `${3 + i % 3}px`,
                    opacity: .35 + i % 3 * .15
                }
            }))), /*#__PURE__*/ React.createElement("div", {
            className: "hero-body container-wide"
        }, /*#__PURE__*/ React.createElement("div", {
            style: {
                opacity: loaded ? 1 : 0,
                transform: loaded ? 'none' : 'translateY(24px)',
                transition: 'opacity .9s .15s,transform .9s .15s'
            },
            className: "hero-grid"
        }, /*#__PURE__*/ React.createElement("div", null, b.eyebrow && /*#__PURE__*/ React.createElement("span", {
            className: "eyebrow hero-eyebrow"
        }, b.eyebrow), /*#__PURE__*/ React.createElement("h1", {
            className: "hero-h1"
        }, b.heading, b.headingEmphasis && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("br", null), /*#__PURE__*/ React.createElement("em", null, b.headingEmphasis))), b.lead && /*#__PURE__*/ React.createElement("p", {
            className: "hero-lead"
        }, b.lead), /*#__PURE__*/ React.createElement("div", {
            className: "hero-ctas"
        }, (b.ctas || []).map((c)=>/*#__PURE__*/ React.createElement(CTA, {
                key: c._key,
                cta: c,
                size: "btn-lg"
            })))), b.sideImage && /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
            className: "hero-art-card"
        }, /*#__PURE__*/ React.createElement("img", {
            src: sanityImageUrl(b.sideImage, {
                w: 800
            }),
            alt: b.sideImage.alt || ''
        }), (b.sideImageTitle || b.sideImageSubtitle) && /*#__PURE__*/ React.createElement("div", {
            className: "hero-art-badge"
        }, /*#__PURE__*/ React.createElement(Icon, {
            name: "map-pin",
            size: 16
        }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
            style: {
                fontWeight: 600,
                fontSize: 13
            }
        }, b.sideImageTitle), /*#__PURE__*/ React.createElement("div", {
            style: {
                fontSize: 11,
                color: 'var(--snow-300)'
            }
        }, b.sideImageSubtitle)))))), (b.stats || []).length > 0 && /*#__PURE__*/ React.createElement("div", {
            className: "hero-stats",
            ref: statsRef
        }, b.stats.map((s, i)=>/*#__PURE__*/ React.createElement("div", {
                key: s._key,
                className: 'hero-stat reveal d' + i + ' ' + (statsVis ? 'is-visible' : '')
            }, /*#__PURE__*/ React.createElement("b", null, s.value), /*#__PURE__*/ React.createElement("span", null, s.label))))), /*#__PURE__*/ React.createElement("div", {
            className: "scroll-cue",
            "aria-hidden": true
        }, /*#__PURE__*/ React.createElement("span", null, "Scroll"), /*#__PURE__*/ React.createElement("div", {
            className: "scroll-cue-line"
        })));
    }
    function ConditionsStripBlock({ b }) {
        if (!b) return null;
        return /*#__PURE__*/ React.createElement("div", {
            className: "cond-strip"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide cond-inner"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "cond-meta"
        }, b.showLiveChip && /*#__PURE__*/ React.createElement("span", {
            className: "chip"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "dot live"
        }), " Live"), b.updatedLabel && /*#__PURE__*/ React.createElement("span", {
            style: {
                color: 'var(--snow-400)',
                fontSize: 13
            }
        }, b.updatedLabel)), /*#__PURE__*/ React.createElement("div", {
            className: "cond-stats"
        }, (b.stats || []).map((s)=>/*#__PURE__*/ React.createElement("div", {
                key: s._key,
                className: "cond-stat"
            }, /*#__PURE__*/ React.createElement(Icon, {
                name: s.icon || 'snow',
                size: 20
            }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
                className: "cond-val"
            }, s.value), /*#__PURE__*/ React.createElement("div", {
                className: "cond-sub"
            }, /*#__PURE__*/ React.createElement("b", null, s.label), s.detail && /*#__PURE__*/ React.createElement(React.Fragment, null, " · ", s.detail)))))), /*#__PURE__*/ React.createElement(L, {
            link: b.reportLink,
            className: "btn btn-ghost btn-sm"
        })));
    }
    function RichTextBlock({ b }) {
        return /*#__PURE__*/ React.createElement("section", {
            className: 'section ' + (b.tintedBackground ? 'section-tint' : '')
        }, /*#__PURE__*/ React.createElement("div", {
            className: b.width === 'wide' ? 'container-wide' : 'container-wide article-wrap'
        }, /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement(SectionHead, {
            heading: b.heading
        })), /*#__PURE__*/ React.createElement(R, {
            d: 1
        }, /*#__PURE__*/ React.createElement(PortableText, {
            blocks: b.content
        }))));
    }
    function FeatureGridBlock({ b }) {
        return /*#__PURE__*/ React.createElement("section", {
            className: 'section ' + (b.tintedBackground ? 'section-tint' : '')
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide"
        }, /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement(SectionHead, {
            heading: b.heading
        })), /*#__PURE__*/ React.createElement("div", {
            className: "feat-grid"
        }, (b.features || []).map((f, i)=>/*#__PURE__*/ React.createElement(R, {
                key: f._key,
                d: i
            }, /*#__PURE__*/ React.createElement("div", {
                className: "feat"
            }, f.badge && /*#__PURE__*/ React.createElement("span", {
                className: "chip",
                style: {
                    marginBottom: 'var(--sp-3)'
                }
            }, f.badge), f.icon && /*#__PURE__*/ React.createElement("div", {
                className: "icon-wrap"
            }, /*#__PURE__*/ React.createElement(Icon, {
                name: f.icon,
                size: 20
            })), /*#__PURE__*/ React.createElement("h3", null, f.title), f.body && /*#__PURE__*/ React.createElement("p", null, f.body)))))));
    }
    function QuoteBlock({ b }) {
        const bg = sanityImageUrl(b.backgroundImage, {
            w: 2000
        });
        return /*#__PURE__*/ React.createElement("div", {
            className: "full-bleed",
            style: bg ? {
                backgroundImage: `url(${bg})`
            } : undefined
        }, /*#__PURE__*/ React.createElement("div", {
            className: "full-bleed-overlay"
        }), /*#__PURE__*/ React.createElement("div", {
            className: "container full-bleed-content"
        }, b.eyebrow && /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("span", {
            className: "eyebrow",
            style: {
                color: 'var(--brand-ice)'
            }
        }, b.eyebrow)), /*#__PURE__*/ React.createElement(R, {
            d: 1
        }, /*#__PURE__*/ React.createElement("h2", {
            className: "editorial-quote"
        }, (b.quote || '').split('\n').map((line, i)=>/*#__PURE__*/ React.createElement(React.Fragment, {
                key: i
            }, i > 0 && /*#__PURE__*/ React.createElement("br", null), line)))), b.attribution && /*#__PURE__*/ React.createElement(R, {
            d: 2
        }, /*#__PURE__*/ React.createElement("div", {
            style: {
                color: 'var(--snow-300)',
                marginTop: 'var(--sp-4)',
                fontSize: 13,
                letterSpacing: '.1em',
                textTransform: 'uppercase'
            }
        }, b.attribution))));
    }
    function CtaBandBlock({ b }) {
        return /*#__PURE__*/ React.createElement(MemberBand, {
            band: b
        });
    }
    function NoticeBlock({ b }) {
        return /*#__PURE__*/ React.createElement("section", {
            className: "section",
            style: {
                paddingBottom: 0
            }
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide"
        }, /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("div", {
            className: "shop-notice"
        }, /*#__PURE__*/ React.createElement(Icon, {
            name: b.icon || 'info',
            size: 18,
            stroke: 2
        }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(PortableText, {
            blocks: b.content
        }))))));
    }
    function ForecastBlock({ b }) {
        return /*#__PURE__*/ React.createElement("section", {
            className: "section"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide"
        }, /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement(SectionHead, {
            heading: b.heading
        })), /*#__PURE__*/ React.createElement(R, {
            d: 1
        }, /*#__PURE__*/ React.createElement("div", {
            className: "forecast-grid"
        }, (b.days || []).map((d)=>/*#__PURE__*/ React.createElement("div", {
                key: d._key,
                className: "forecast-card"
            }, /*#__PURE__*/ React.createElement("div", {
                style: {
                    fontSize: 11,
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-soft)',
                    fontWeight: 700
                }
            }, d.day), /*#__PURE__*/ React.createElement("div", {
                style: {
                    fontFamily: 'var(--font-display)',
                    fontWeight: 500,
                    fontSize: 22,
                    margin: '4px 0'
                }
            }, d.date), /*#__PURE__*/ React.createElement("div", {
                style: {
                    margin: '12px 0',
                    color: 'var(--brand-glacier)'
                }
            }, /*#__PURE__*/ React.createElement(Icon, {
                name: d.icon || 'snow',
                size: 28,
                stroke: 1.4
            })), /*#__PURE__*/ React.createElement("div", {
                style: {
                    fontSize: 14,
                    fontWeight: 600
                }
            }, d.high, "° / ", /*#__PURE__*/ React.createElement("span", {
                className: "muted"
            }, d.low, "°")), /*#__PURE__*/ React.createElement("div", {
                style: {
                    fontSize: 12,
                    color: 'var(--ink-muted)',
                    marginTop: 4
                }
            }, d.snowCm, " cm")))))));
    }
    function ReviewsBlock({ b }) {
        const [ref, vis] = useReveal({
            th: .05
        });
        return /*#__PURE__*/ React.createElement("section", {
            className: "reviews-section",
            ref: ref
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "reviews-header"
        }, /*#__PURE__*/ React.createElement("div", null, b.heading && b.heading.eyebrow && /*#__PURE__*/ React.createElement("span", {
            className: "eyebrow"
        }, b.heading.eyebrow), b.heading && b.heading.heading && /*#__PURE__*/ React.createElement("h2", {
            style: {
                marginTop: 14
            }
        }, b.heading.heading)), /*#__PURE__*/ React.createElement("div", {
            className: "reviews-rating-block"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "reviews-score"
        }, b.score), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(Stars, {
            n: 5
        }), b.scoreCaption && /*#__PURE__*/ React.createElement("div", {
            style: {
                fontSize: 13,
                color: 'var(--ink-muted)',
                marginTop: 5
            }
        }, b.scoreCaption), b.allReviewsLink && /*#__PURE__*/ React.createElement(L, {
            link: b.allReviewsLink,
            style: {
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 10,
                fontSize: 13,
                color: 'var(--ink-muted)',
                borderBottom: '1px solid var(--line)',
                paddingBottom: 2
            }
        }, b.allReviewsLink.label, " ", /*#__PURE__*/ React.createElement(Icon, {
            name: "arrow-up-right",
            size: 13
        }))))), /*#__PURE__*/ React.createElement("div", {
            className: "reviews-grid"
        }, (b.reviews || []).map((r, i)=>/*#__PURE__*/ React.createElement(R, {
                key: r._key,
                d: i % 3
            }, /*#__PURE__*/ React.createElement("div", {
                className: "review-card"
            }, /*#__PURE__*/ React.createElement("div", {
                className: "review-card-top"
            }, /*#__PURE__*/ React.createElement("div", {
                className: "review-avatar"
            }, r.initials), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
                style: {
                    fontWeight: 600,
                    fontSize: 14,
                    color: 'var(--ink)'
                }
            }, r.name), /*#__PURE__*/ React.createElement(Stars, {
                n: r.rating,
                size: 12
            }))), /*#__PURE__*/ React.createElement("blockquote", null, '"', r.text, '"'), /*#__PURE__*/ React.createElement("div", {
                className: "review-card-meta"
            }, /*#__PURE__*/ React.createElement("span", null, r.date), r.attribution && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("span", {
                style: {
                    opacity: .35
                }
            }, "·"), /*#__PURE__*/ React.createElement("span", null, r.attribution)))))))));
    }
    function InfoSectionsBlock({ b }) {
        const sections = b.sections || [];
        const toc = sections.map((s)=>[
                s.anchor && s.anchor.current,
                s.title
            ]).filter((x)=>x[0]);
        const [active, setActive] = useState(toc.length ? toc[0][0] : null);
        useEffect(()=>{
            const onS = ()=>{
                let cur = toc.length ? toc[0][0] : null;
                for (const [id] of toc){
                    const el = document.getElementById(id);
                    if (el && el.getBoundingClientRect().top <= 116) cur = id;
                }
                setActive(cur);
            };
            window.addEventListener('scroll', onS, {
                passive: true
            });
            return ()=>window.removeEventListener('scroll', onS);
        // eslint-disable-next-line
        }, [
            sections.length
        ]);
        return /*#__PURE__*/ React.createElement("section", {
            className: "section"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide info-layout"
        }, /*#__PURE__*/ React.createElement("aside", {
            className: "info-toc"
        }, /*#__PURE__*/ React.createElement("h5", null, b.sidebarTitle || 'On this page'), toc.map(([id, lbl])=>/*#__PURE__*/ React.createElement("a", {
                key: id,
                href: '#' + id,
                className: active === id ? 'active' : ''
            }, lbl))), /*#__PURE__*/ React.createElement("div", null, sections.map((s)=>/*#__PURE__*/ React.createElement(R, {
                key: s._key
            }, /*#__PURE__*/ React.createElement("div", {
                className: "info-block",
                id: s.anchor && s.anchor.current
            }, /*#__PURE__*/ React.createElement("h2", null, s.title), /*#__PURE__*/ React.createElement(PortableText, {
                blocks: s.content
            }), s.image && /*#__PURE__*/ React.createElement(Photo, {
                className: "info-photo",
                src: sanityImageUrl(s.image, {
                    w: 1000
                }),
                label: s.image.alt
            }), (s.cards || []).length > 0 && /*#__PURE__*/ React.createElement("div", {
                className: "feat-grid",
                style: {
                    marginTop: 'var(--sp-6)'
                }
            }, s.cards.map((c)=>/*#__PURE__*/ React.createElement("div", {
                    key: c._key,
                    className: "feat",
                    style: {
                        padding: 'var(--sp-5)'
                    }
                }, /*#__PURE__*/ React.createElement("h4", null, c.title), c.detail && /*#__PURE__*/ React.createElement("p", {
                    className: "muted",
                    style: {
                        fontSize: 14,
                        margin: '6px 0 0'
                    }
                }, c.detail)))), s.button && /*#__PURE__*/ React.createElement(CTA, {
                cta: s.button,
                size: "btn-sm",
                className: ""
            })))))));
    }
    function ContactListBlock({ b }) {
        return /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("div", null, b.heading && b.heading.heading && /*#__PURE__*/ React.createElement("h2", null, b.heading.heading), b.heading && b.heading.intro && /*#__PURE__*/ React.createElement("p", {
            className: "muted",
            style: {
                maxWidth: '40ch',
                marginBottom: 'var(--sp-6)'
            }
        }, b.heading.intro), /*#__PURE__*/ React.createElement("div", {
            className: "contact-list"
        }, (b.contacts || []).map((c)=>/*#__PURE__*/ React.createElement("div", {
                key: c._key,
                className: "contact-item"
            }, /*#__PURE__*/ React.createElement("span", null, c.label), /*#__PURE__*/ React.createElement("span", {
                className: "val"
            }, c.value))))));
    }
    function LinkListBlock({ b }) {
        return /*#__PURE__*/ React.createElement(R, {
            d: 1
        }, /*#__PURE__*/ React.createElement("div", null, b.heading && b.heading.heading && /*#__PURE__*/ React.createElement("h2", null, b.heading.heading), b.heading && b.heading.intro && /*#__PURE__*/ React.createElement("p", {
            className: "muted",
            style: {
                maxWidth: '40ch',
                marginBottom: 'var(--sp-6)'
            }
        }, b.heading.intro), /*#__PURE__*/ React.createElement("div", {
            className: "link-list"
        }, (b.links || []).map((l)=>/*#__PURE__*/ React.createElement("a", {
                key: l._key,
                href: l.href,
                target: targetFor(l),
                rel: relFor(l)
            }, /*#__PURE__*/ React.createElement("span", null, l.label), /*#__PURE__*/ React.createElement(Icon, {
                name: "arrow-up-right",
                size: 16
            }))))));
    }
    function LinkCardsBlock({ b }) {
        return /*#__PURE__*/ React.createElement("div", null, b.heading && b.heading.heading && /*#__PURE__*/ React.createElement("h2", null, b.heading.heading), b.heading && b.heading.intro && /*#__PURE__*/ React.createElement("p", {
            className: "muted",
            style: {
                marginTop: 'var(--sp-3)',
                marginBottom: 'var(--sp-2)'
            }
        }, b.heading.intro), /*#__PURE__*/ React.createElement("div", {
            className: "useful-links-grid"
        }, (b.cards || []).map((c, i)=>/*#__PURE__*/ React.createElement(R, {
                key: c._key,
                d: i % 3
            }, /*#__PURE__*/ React.createElement("a", {
                href: c.href,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "useful-link-card"
            }, /*#__PURE__*/ React.createElement("div", {
                className: "icon-wrap"
            }, /*#__PURE__*/ React.createElement(Icon, {
                name: c.icon || 'external',
                size: 18
            })), /*#__PURE__*/ React.createElement("h4", null, c.title), c.subtitle && /*#__PURE__*/ React.createElement("p", null, c.subtitle))))));
    }
    function AddressBlock({ b }) {
        return /*#__PURE__*/ React.createElement("div", {
            style: {
                marginTop: 'var(--sp-10)',
                padding: 'var(--sp-6)',
                background: 'var(--bg-elev)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-lg)'
            }
        }, b.heading && /*#__PURE__*/ React.createElement("h3", {
            style: {
                marginBottom: 'var(--sp-3)'
            }
        }, b.heading), /*#__PURE__*/ React.createElement("div", {
            style: {
                color: 'var(--ink-muted)',
                fontSize: 15,
                lineHeight: 1.8
            }
        }, /*#__PURE__*/ React.createElement(PortableText, {
            blocks: b.content
        })));
    }
    function StepsBlock({ b }) {
        const tabs = b.tabs || [];
        const [tab, setTab] = useState(0);
        const steps = tabs[tab] && tabs[tab].steps || [];
        return /*#__PURE__*/ React.createElement("div", null, b.heading && b.heading.heading && /*#__PURE__*/ React.createElement("h2", null, b.heading.heading), tabs.length > 1 && /*#__PURE__*/ React.createElement("div", {
            className: "transport-tabs",
            style: {
                marginTop: 'var(--sp-5)'
            }
        }, tabs.map((t, i)=>/*#__PURE__*/ React.createElement("button", {
                key: t._key,
                className: 'transport-tab ' + (tab === i ? 'active' : ''),
                onClick: ()=>setTab(i)
            }, t.icon && /*#__PURE__*/ React.createElement(Icon, {
                name: t.icon,
                size: 15
            }), " ", t.label))), steps.map((s, i)=>/*#__PURE__*/ React.createElement("div", {
                key: s._key,
                className: "dir-step"
            }, /*#__PURE__*/ React.createElement("div", {
                className: "dir-num"
            }, i + 1), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", null, s.title), /*#__PURE__*/ React.createElement("p", null, s.body)))));
    }
    /* ── third-party embed blocks ────────────────────────────── */ function YoutubeBlock({ b }) {
        const src = youtubeEmbedUrl(b.url);
        return /*#__PURE__*/ React.createElement("section", {
            className: 'section ' + (b.tintedBackground ? 'section-tint' : '')
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide"
        }, /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement(SectionHead, {
            heading: b.heading
        })), /*#__PURE__*/ React.createElement(R, {
            d: 1
        }, /*#__PURE__*/ React.createElement("div", {
            className: "cam-embed",
            style: b.height ? {
                height: b.height
            } : undefined
        }, /*#__PURE__*/ React.createElement("iframe", {
            src: src,
            title: b.title,
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowFullScreen: true,
            loading: "lazy"
        }))), b.moreLink && /*#__PURE__*/ React.createElement(R, {
            d: 2
        }, /*#__PURE__*/ React.createElement("div", {
            style: {
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: 'var(--sp-4)'
            }
        }, /*#__PURE__*/ React.createElement(L, {
            link: b.moreLink,
            className: "btn btn-ghost btn-sm"
        })))));
    }
    function MapBlock({ b }) {
        return /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("div", {
            className: 'map-embed ' + (b.grayscale === false ? 'map-embed--colour' : '')
        }, /*#__PURE__*/ React.createElement("iframe", {
            src: b.embedUrl,
            title: b.title,
            allowFullScreen: "",
            loading: "lazy",
            referrerPolicy: "no-referrer-when-downgrade"
        })));
    }
    function InstagramBlock({ b }) {
        return /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("div", {
            className: "gallery-insta-cta"
        }, /*#__PURE__*/ React.createElement("div", {
            style: {
                fontSize: 32,
                marginBottom: 'var(--sp-3)'
            }
        }, "📸"), /*#__PURE__*/ React.createElement("h3", null, b.heading), b.body && /*#__PURE__*/ React.createElement("p", {
            style: {
                color: 'rgba(255,255,255,.8)',
                margin: '0 auto var(--sp-6)',
                maxWidth: '44ch'
            }
        }, b.body), /*#__PURE__*/ React.createElement("a", {
            href: `https://www.instagram.com/${b.handle}/`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "btn btn-sm",
            style: {
                background: 'rgba(255,255,255,.2)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,.3)'
            }
        }, /*#__PURE__*/ React.createElement(Icon, {
            name: "instagram",
            size: 15
        }), " @", b.handle), b.footnote && /*#__PURE__*/ React.createElement("div", {
            style: {
                color: 'rgba(255,255,255,.5)',
                marginTop: 'var(--sp-4)',
                fontSize: 13
            }
        }, /*#__PURE__*/ React.createElement(PortableText, {
            blocks: b.footnote
        }))));
    }
    function IframeBlock({ b }) {
        return /*#__PURE__*/ React.createElement("section", {
            className: "section"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide"
        }, /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement(SectionHead, {
            heading: b.heading
        })), /*#__PURE__*/ React.createElement(R, {
            d: 1
        }, /*#__PURE__*/ React.createElement("div", {
            className: "cam-embed",
            style: b.height ? {
                height: b.height
            } : undefined
        }, /*#__PURE__*/ React.createElement("iframe", {
            src: b.url,
            title: b.title,
            allowFullScreen: true,
            loading: "lazy"
        }), /*#__PURE__*/ React.createElement("div", {
            className: "cam-embed-fallback"
        }, /*#__PURE__*/ React.createElement(Icon, {
            name: "external",
            size: 40,
            stroke: 1.3
        }), /*#__PURE__*/ React.createElement("p", {
            style: {
                margin: 'var(--sp-3) 0 var(--sp-5)',
                color: 'var(--ink-muted)',
                fontSize: 15
            }
        }, "This content can't be shown here."), /*#__PURE__*/ React.createElement(L, {
            link: b.fallbackLink,
            className: "btn btn-primary btn-sm"
        }))))));
    }
    function ServiceLinkBlock({ b }) {
        return /*#__PURE__*/ React.createElement("section", {
            className: "section"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide"
        }, /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("div", {
            className: "feat",
            style: {
                maxWidth: 640
            }
        }, b.icon && /*#__PURE__*/ React.createElement("div", {
            className: "icon-wrap"
        }, /*#__PURE__*/ React.createElement(Icon, {
            name: b.icon,
            size: 20
        })), /*#__PURE__*/ React.createElement("h3", null, b.heading), b.body && /*#__PURE__*/ React.createElement("p", null, b.body), /*#__PURE__*/ React.createElement("div", {
            style: {
                marginTop: 'var(--sp-4)'
            }
        }, /*#__PURE__*/ React.createElement(CTA, {
            cta: b.button,
            size: "btn-sm"
        })), b.footnote && /*#__PURE__*/ React.createElement("p", {
            className: "muted",
            style: {
                fontSize: 13,
                marginTop: 'var(--sp-3)'
            }
        }, b.footnote)))));
    }
    /* ── collection blocks ───────────────────────────────────── */ const POST_FIELDS = `_id,title,"slug":slug.current,category,publishedAt,readingTimeMinutes,excerpt,mainImage{alt,asset}`;
    function NewsListBlock({ b }) {
        const archive = b.layout === 'archive';
        const q = archive ? `*[_type=="post"]|order(publishedAt desc){${POST_FIELDS}}` : `*[_type=="post"]|order(publishedAt desc)[0...${Math.max(1, Math.min(12, b.limit || 3))}]{${POST_FIELDS}}`;
        const [posts, loading] = useSanityQuery(q, {}, [
            b._key
        ]);
        const [filter, setFilter] = useState('All');
        const list = posts || [];
        if (archive) {
            const featured = list[0];
            const rest = list.slice(1);
            const tags = [
                'All',
                ...new Set(list.map((p)=>p.category))
            ];
            const visible = rest.filter((p)=>filter === 'All' || p.category === filter);
            return /*#__PURE__*/ React.createElement("section", {
                className: 'section ' + (b.tintedBackground ? 'section-tint' : '')
            }, /*#__PURE__*/ React.createElement("div", {
                className: "container-wide"
            }, loading ? /*#__PURE__*/ React.createElement("p", {
                className: "muted"
            }, "Loading news…") : !featured ? /*#__PURE__*/ React.createElement("p", {
                className: "muted"
            }, "No news posted yet — check back soon.") : /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("article", {
                className: "news-featured",
                onClick: ()=>onNav('article', featured.slug),
                style: {
                    cursor: 'pointer'
                }
            }, /*#__PURE__*/ React.createElement(Photo, {
                src: sanityImageUrl(featured.mainImage, {
                    w: 960
                }),
                label: featured.mainImage && featured.mainImage.alt
            }), /*#__PURE__*/ React.createElement("div", {
                className: "news-featured-body"
            }, /*#__PURE__*/ React.createElement("div", {
                className: "row",
                style: {
                    marginBottom: 12
                }
            }, /*#__PURE__*/ React.createElement("span", {
                className: "chip"
            }, featured.category), /*#__PURE__*/ React.createElement("span", {
                className: "muted",
                style: {
                    fontSize: 13
                }
            }, formatDate(featured.publishedAt), " · ", readingTimeLabel(featured.readingTimeMinutes), " read")), /*#__PURE__*/ React.createElement("h2", null, featured.title), /*#__PURE__*/ React.createElement("p", {
                className: "lead"
            }, featured.excerpt), /*#__PURE__*/ React.createElement("div", {
                style: {
                    marginTop: 'var(--sp-5)'
                }
            }, /*#__PURE__*/ React.createElement("span", {
                className: "btn btn-link"
            }, "Read the full report ", /*#__PURE__*/ React.createElement(Icon, {
                name: "arrow",
                size: 14
            })))))), b.showFilters !== false && /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("div", {
                style: {
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                    marginBottom: 'var(--sp-6)'
                }
            }, tags.map((t)=>/*#__PURE__*/ React.createElement("button", {
                    key: t,
                    className: 'btn btn-sm ' + (filter === t ? 'btn-primary' : 'btn-ghost'),
                    onClick: ()=>setFilter(t)
                }, t)))), /*#__PURE__*/ React.createElement("div", {
                className: "news-grid"
            }, visible.map((p, i)=>/*#__PURE__*/ React.createElement(R, {
                    key: p._id,
                    d: i % 3
                }, /*#__PURE__*/ React.createElement("article", {
                    className: "news-card",
                    onClick: ()=>onNav('article', p.slug),
                    style: {
                        cursor: 'pointer'
                    }
                }, /*#__PURE__*/ React.createElement(Photo, {
                    src: sanityImageUrl(p.mainImage, {
                        w: 640
                    }),
                    label: p.mainImage && p.mainImage.alt,
                    ratio: "16/10"
                }), /*#__PURE__*/ React.createElement("div", {
                    className: "news-card-body"
                }, /*#__PURE__*/ React.createElement("div", {
                    className: "meta"
                }, /*#__PURE__*/ React.createElement("span", {
                    className: "chip",
                    style: {
                        marginRight: 8
                    }
                }, p.category), formatDate(p.publishedAt)), /*#__PURE__*/ React.createElement("h3", null, p.title), /*#__PURE__*/ React.createElement("p", null, p.excerpt), /*#__PURE__*/ React.createElement("span", {
                    className: "more"
                }, "Read ", /*#__PURE__*/ React.createElement(Icon, {
                    name: "arrow",
                    size: 14
                }))))))))));
        }
        return /*#__PURE__*/ React.createElement("section", {
            className: 'section ' + (b.tintedBackground ? 'section-tint' : '')
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide"
        }, /*#__PURE__*/ React.createElement("div", {
            style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                gap: 16,
                marginBottom: 'var(--sp-10)'
            }
        }, /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement(SectionHead, {
            heading: b.heading
        })), b.viewAllLink && /*#__PURE__*/ React.createElement(R, {
            d: 1
        }, /*#__PURE__*/ React.createElement(L, {
            link: b.viewAllLink,
            className: "btn btn-ghost btn-sm"
        }))), /*#__PURE__*/ React.createElement(R, null, loading ? /*#__PURE__*/ React.createElement("div", {
            className: "story-rail"
        }, [
            0,
            1,
            2
        ].map((i)=>/*#__PURE__*/ React.createElement("div", {
                key: i,
                className: "news-card skeleton"
            }))) : list.length === 0 ? /*#__PURE__*/ React.createElement("p", {
            className: "muted"
        }, "No news posted yet — check back soon.") : /*#__PURE__*/ React.createElement("div", {
            className: "story-rail"
        }, list.map((p, i)=>/*#__PURE__*/ React.createElement("article", {
                key: p._id,
                className: "news-card",
                onClick: ()=>onNav('article', p.slug),
                style: {
                    cursor: 'pointer'
                }
            }, /*#__PURE__*/ React.createElement(Photo, {
                src: sanityImageUrl(p.mainImage, {
                    w: 640
                }),
                label: p.mainImage && p.mainImage.alt,
                ratio: "16/10"
            }), /*#__PURE__*/ React.createElement("div", {
                className: "news-card-body"
            }, /*#__PURE__*/ React.createElement("div", {
                className: "meta"
            }, /*#__PURE__*/ React.createElement("span", {
                className: "chip",
                style: {
                    marginRight: 8
                }
            }, p.category), formatDate(p.publishedAt)), /*#__PURE__*/ React.createElement("h3", null, p.title), /*#__PURE__*/ React.createElement("p", null, p.excerpt), /*#__PURE__*/ React.createElement("span", {
                className: "more"
            }, "Read ", i === 0 ? 'article' : '', " ", /*#__PURE__*/ React.createElement(Icon, {
                name: "arrow",
                size: 14
            })))))))));
    }
    const GALLERY_QUERY = `*[_type=="galleryPhoto"]|order(_createdAt desc){_id,caption,context,category,image{alt,asset}}`;
    function GalleryGridBlock({ b }) {
        const [items, loading] = useSanityQuery(GALLERY_QUERY, {}, [
            b._key
        ]);
        const [cat, setCat] = useState('all');
        const filters = (b.filters || []).length ? b.filters : null;
        const visible = (items || []).filter((g)=>cat === 'all' || g.category === cat);
        return /*#__PURE__*/ React.createElement("section", {
            className: "section"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide"
        }, /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement(SectionHead, {
            heading: b.heading
        })), b.showFilters !== false && filters && /*#__PURE__*/ React.createElement("div", {
            className: "gallery-filters"
        }, filters.map((f)=>/*#__PURE__*/ React.createElement("button", {
                key: f._key,
                className: 'btn btn-sm ' + (cat === f.category ? 'btn-primary' : 'btn-ghost'),
                onClick: ()=>setCat(f.category)
            }, f.label))), loading ? /*#__PURE__*/ React.createElement("p", {
            className: "muted"
        }, "Loading gallery…") : visible.length === 0 ? /*#__PURE__*/ React.createElement("p", {
            className: "muted"
        }, "No photos yet — check back soon.") : /*#__PURE__*/ React.createElement("div", {
            className: "gallery-grid"
        }, visible.map((g, i)=>/*#__PURE__*/ React.createElement(R, {
                key: g._id,
                d: i % 3
            }, /*#__PURE__*/ React.createElement("div", {
                className: "gallery-item"
            }, /*#__PURE__*/ React.createElement("img", {
                src: sanityImageUrl(g.image, {
                    w: 800
                }),
                alt: g.image && g.image.alt || g.caption,
                loading: "lazy"
            }), /*#__PURE__*/ React.createElement("div", {
                className: "gallery-caption"
            }, /*#__PURE__*/ React.createElement("span", null, g.caption), /*#__PURE__*/ React.createElement("small", null, g.context))))))));
    }
    const GEAR_QUERY = `*[_type=="gearListing"]|order(postedAt desc){_id,title,category,size,price,status,seller,postedAt,image{alt,asset},description}`;
    function GearGridBlock({ b }) {
        const [gear, loading] = useSanityQuery(GEAR_QUERY, {}, [
            b._key
        ]);
        const [cat, setCat] = useState('All');
        const filters = (b.filters || []).length ? b.filters : null;
        let visible = (gear || []).filter((g)=>cat === 'All' || g.category === cat);
        if (b.hideSold) visible = visible.filter((g)=>g.status !== 'sold');
        return /*#__PURE__*/ React.createElement("section", {
            className: "section",
            style: {
                paddingTop: 'var(--sp-10)'
            }
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide"
        }, /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement(SectionHead, {
            heading: b.heading
        })), b.showFilters !== false && filters && /*#__PURE__*/ React.createElement("div", {
            className: "gear-filters"
        }, filters.map((c)=>/*#__PURE__*/ React.createElement("button", {
                key: c,
                className: 'btn btn-sm ' + (cat === c ? 'btn-primary' : 'btn-ghost'),
                onClick: ()=>setCat(c)
            }, c))), loading ? /*#__PURE__*/ React.createElement("p", {
            className: "muted"
        }, "Loading listings…") : visible.length === 0 ? /*#__PURE__*/ React.createElement("p", {
            className: "muted"
        }, "No gear listed right now — check back soon.") : /*#__PURE__*/ React.createElement("div", {
            className: "gear-grid"
        }, visible.map((g, i)=>/*#__PURE__*/ React.createElement(R, {
                key: g._id,
                d: i % 3
            }, /*#__PURE__*/ React.createElement("div", {
                className: "gear-card"
            }, /*#__PURE__*/ React.createElement("div", {
                className: "gear-img"
            }, /*#__PURE__*/ React.createElement(Photo, {
                src: sanityImageUrl(g.image, {
                    w: 640
                }),
                ratio: "4/3",
                label: g.category
            }), /*#__PURE__*/ React.createElement("span", {
                className: 'gear-badge ' + (g.status === 'sold' ? 'sold' : g.status === 'reserved' ? 'reserved' : '')
            }, g.status === 'available' ? g.category : g.status)), /*#__PURE__*/ React.createElement("div", {
                className: "gear-body"
            }, /*#__PURE__*/ React.createElement("h3", null, g.title), /*#__PURE__*/ React.createElement("div", {
                className: "gear-size"
            }, g.size), /*#__PURE__*/ React.createElement("p", {
                className: "gear-desc"
            }, g.description), /*#__PURE__*/ React.createElement("div", {
                className: "gear-seller"
            }, /*#__PURE__*/ React.createElement(Icon, {
                name: "users",
                size: 13
            }), g.seller, " · ", timeAgo(g.postedAt)), /*#__PURE__*/ React.createElement("div", {
                className: "gear-price"
            }, g.status === 'sold' ? /*#__PURE__*/ React.createElement("span", {
                style: {
                    color: 'var(--ink-soft)',
                    fontSize: 'var(--fs-18)'
                }
            }, "Sold") : `$${g.price}`)), g.status !== 'sold' && /*#__PURE__*/ React.createElement("div", {
                className: "gear-actions"
            }, /*#__PURE__*/ React.createElement("a", {
                className: "btn btn-primary btn-sm",
                href: b.contactButtonHref || 'login.html',
                style: {
                    flex: 1
                }
            }, /*#__PURE__*/ React.createElement(Icon, {
                name: "lock",
                size: 13
            }), " ", b.contactButtonLabel || 'Contact seller'))))))));
    }
    /* ── form blocks ─────────────────────────────────────────── */ function EnquiryFormBlock({ b }) {
        const [done, setDone] = useState(false);
        const [form, setForm] = useState({
            name: '',
            email: '',
            phone: '',
            interest: '',
            message: ''
        });
        const sb = b.sidebar || {};
        return /*#__PURE__*/ React.createElement("section", {
            className: "section"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide enquire-grid"
        }, /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("div", null, sb.heading && /*#__PURE__*/ React.createElement("h2", {
            style: {
                fontSize: 'var(--fs-32)'
            }
        }, sb.heading), sb.intro && /*#__PURE__*/ React.createElement("p", {
            className: "muted"
        }, sb.intro), (sb.steps || []).length > 0 && /*#__PURE__*/ React.createElement("ol", {
            className: "muted",
            style: {
                paddingLeft: '1.2em',
                lineHeight: 1.8,
                marginTop: 'var(--sp-5)'
            }
        }, sb.steps.map((s)=>/*#__PURE__*/ React.createElement("li", {
                key: s._key
            }, /*#__PURE__*/ React.createElement("b", {
                style: {
                    color: 'var(--ink)'
                }
            }, s.title), " ", s.body))), (sb.contacts || []).length > 0 && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("hr", {
            className: "divider"
        }), /*#__PURE__*/ React.createElement("h3", null, sb.contactsHeading || 'Direct contacts'), /*#__PURE__*/ React.createElement("div", {
            className: "contact-list",
            style: {
                marginTop: 'var(--sp-4)'
            }
        }, sb.contacts.map((c)=>/*#__PURE__*/ React.createElement("div", {
                key: c._key,
                className: "contact-item"
            }, /*#__PURE__*/ React.createElement("span", null, c.label), /*#__PURE__*/ React.createElement("span", {
                className: "val"
            }, c.value))))))), /*#__PURE__*/ React.createElement(R, {
            d: 1
        }, /*#__PURE__*/ React.createElement("div", {
            className: "form-card"
        }, done ? /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
            className: "form-success"
        }, /*#__PURE__*/ React.createElement(Icon, {
            name: "check",
            size: 20
        }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("b", null, b.successHeading), /*#__PURE__*/ React.createElement("br", null), b.successBody)), /*#__PURE__*/ React.createElement("button", {
            className: "btn btn-ghost",
            style: {
                marginTop: 'var(--sp-6)'
            },
            onClick: ()=>{
                setDone(false);
                setForm({
                    name: '',
                    email: '',
                    phone: '',
                    interest: '',
                    message: ''
                });
            }
        }, "Send another")) : /*#__PURE__*/ React.createElement("form", {
            onSubmit: (e)=>{
                e.preventDefault();
                setDone(true);
            },
            style: {
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--sp-4)'
            }
        }, /*#__PURE__*/ React.createElement("h3", {
            style: {
                margin: 0
            }
        }, b.heading), b.intro && /*#__PURE__*/ React.createElement("p", {
            className: "muted",
            style: {
                margin: 0,
                fontSize: 14
            }
        }, b.intro), /*#__PURE__*/ React.createElement("div", {
            className: "form-row-2"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "field"
        }, /*#__PURE__*/ React.createElement("label", {
            htmlFor: "ef-first"
        }, "First name *"), /*#__PURE__*/ React.createElement("input", {
            id: "ef-first",
            className: "input",
            required: true,
            value: form.name,
            onChange: (e)=>setForm({
                    ...form,
                    name: e.target.value
                })
        })), /*#__PURE__*/ React.createElement("div", {
            className: "field"
        }, /*#__PURE__*/ React.createElement("label", {
            htmlFor: "ef-last"
        }, "Last name *"), /*#__PURE__*/ React.createElement("input", {
            id: "ef-last",
            className: "input",
            required: true
        }))), /*#__PURE__*/ React.createElement("div", {
            className: "form-row-2"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "field"
        }, /*#__PURE__*/ React.createElement("label", {
            htmlFor: "ef-email"
        }, "Email *"), /*#__PURE__*/ React.createElement("input", {
            id: "ef-email",
            className: "input",
            type: "email",
            required: true,
            value: form.email,
            onChange: (e)=>setForm({
                    ...form,
                    email: e.target.value
                })
        })), /*#__PURE__*/ React.createElement("div", {
            className: "field"
        }, /*#__PURE__*/ React.createElement("label", {
            htmlFor: "ef-phone"
        }, "Phone"), /*#__PURE__*/ React.createElement("input", {
            id: "ef-phone",
            className: "input",
            type: "tel",
            value: form.phone,
            onChange: (e)=>setForm({
                    ...form,
                    phone: e.target.value
                })
        }))), (b.topics || []).length > 0 && /*#__PURE__*/ React.createElement("div", {
            className: "field"
        }, /*#__PURE__*/ React.createElement("label", {
            htmlFor: "ef-topic"
        }, "What's this about?"), /*#__PURE__*/ React.createElement("select", {
            id: "ef-topic",
            className: "select",
            value: form.interest,
            onChange: (e)=>setForm({
                    ...form,
                    interest: e.target.value
                })
        }, b.topics.map((t)=>/*#__PURE__*/ React.createElement("option", {
                key: t._key,
                value: t.value
            }, t.label)))), /*#__PURE__*/ React.createElement("div", {
            className: "field"
        }, /*#__PURE__*/ React.createElement("label", {
            htmlFor: "ef-msg"
        }, "Your message *"), /*#__PURE__*/ React.createElement("textarea", {
            id: "ef-msg",
            className: "textarea",
            required: true,
            placeholder: b.messagePlaceholder,
            value: form.message,
            onChange: (e)=>setForm({
                    ...form,
                    message: e.target.value
                })
        })), b.consentLabel && /*#__PURE__*/ React.createElement("label", {
            className: "checkbox",
            style: {
                fontSize: 14
            }
        }, /*#__PURE__*/ React.createElement("input", {
            type: "checkbox",
            required: true
        }), " ", b.consentLabel), /*#__PURE__*/ React.createElement("button", {
            type: "submit",
            className: "btn btn-cta btn-lg",
            style: {
                alignSelf: 'flex-start',
                marginTop: 'var(--sp-2)'
            }
        }, b.submitLabel, " ", /*#__PURE__*/ React.createElement("span", {
            className: "arrow"
        }, "→")))))));
    }
    function LoginFormBlock({ b }) {
        const [done, setDone] = useState(false);
        const art = b.art || {};
        const bg = sanityImageUrl(art.backgroundImage, {
            w: 1200
        });
        return /*#__PURE__*/ React.createElement("main", null, /*#__PURE__*/ React.createElement("div", {
            className: "login-shell"
        }, /*#__PURE__*/ React.createElement("aside", {
            className: "login-art"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "login-art-media"
        }, bg && /*#__PURE__*/ React.createElement("img", {
            src: bg,
            alt: art.backgroundImage && art.backgroundImage.alt || '',
            style: {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                inset: 0
            }
        }), /*#__PURE__*/ React.createElement("div", {
            className: "login-art-overlay"
        })), /*#__PURE__*/ React.createElement("div", {
            style: {
                position: 'relative',
                zIndex: 1
            }
        }, /*#__PURE__*/ React.createElement("div", {
            style: {
                background: 'rgba(255,255,255,.92)',
                borderRadius: 10,
                padding: '7px 12px',
                display: 'inline-block',
                boxShadow: '0 4px 20px rgba(0,0,0,.3)'
            }
        }, /*#__PURE__*/ React.createElement(Logo, {
            height: 40
        }))), /*#__PURE__*/ React.createElement("div", {
            className: "login-art-middle",
            style: {
                position: 'relative',
                zIndex: 1
            }
        }, /*#__PURE__*/ React.createElement("p", {
            className: "editorial login-art-welcome"
        }, art.welcomeHeading, art.welcomeEmphasis && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("br", null), /*#__PURE__*/ React.createElement("em", null, art.welcomeEmphasis))), art.welcomeBody && /*#__PURE__*/ React.createElement("p", {
            style: {
                color: 'var(--snow-300)',
                marginTop: 'var(--sp-5)',
                maxWidth: '32ch',
                fontSize: 16,
                lineHeight: 1.6
            }
        }, art.welcomeBody)), art.quote && /*#__PURE__*/ React.createElement("div", {
            style: {
                position: 'relative',
                zIndex: 1
            }
        }, /*#__PURE__*/ React.createElement("div", {
            className: "login-art-quote-block"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "login-art-quote"
        }, art.quote), /*#__PURE__*/ React.createElement("span", {
            style: {
                color: 'var(--snow-500)',
                marginTop: 10,
                fontSize: 12,
                display: 'block',
                letterSpacing: '.08em',
                textTransform: 'uppercase'
            }
        }, art.quoteAttribution)))), /*#__PURE__*/ React.createElement("section", {
            className: "login-form-wrap"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "login-form"
        }, /*#__PURE__*/ React.createElement("a", {
            className: "login-form-back",
            href: "index.html"
        }, "← Back to mitreskiclub.com"), b.eyebrow && /*#__PURE__*/ React.createElement("span", {
            className: "eyebrow"
        }, b.eyebrow), /*#__PURE__*/ React.createElement("h1", {
            style: {
                marginTop: 12
            }
        }, b.heading), b.intro && /*#__PURE__*/ React.createElement("p", {
            className: "small"
        }, b.intro), done && /*#__PURE__*/ React.createElement("div", {
            className: "form-success"
        }, /*#__PURE__*/ React.createElement(Icon, {
            name: "check",
            size: 18
        }), /*#__PURE__*/ React.createElement("div", null, b.successMessage)), /*#__PURE__*/ React.createElement("form", {
            onSubmit: (e)=>{
                e.preventDefault();
                setDone(true);
            },
            style: {
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--sp-4)',
                marginTop: 'var(--sp-2)'
            }
        }, /*#__PURE__*/ React.createElement("div", {
            className: "field"
        }, /*#__PURE__*/ React.createElement("label", {
            htmlFor: "lg-email"
        }, "Email address"), /*#__PURE__*/ React.createElement("input", {
            id: "lg-email",
            className: "input",
            type: "email",
            required: true
        })), /*#__PURE__*/ React.createElement("div", {
            className: "field"
        }, /*#__PURE__*/ React.createElement("label", {
            htmlFor: "lg-pass"
        }, "Password"), /*#__PURE__*/ React.createElement("input", {
            id: "lg-pass",
            className: "input",
            type: "password",
            required: true
        })), /*#__PURE__*/ React.createElement("div", {
            className: "row-between"
        }, /*#__PURE__*/ React.createElement("label", {
            className: "checkbox"
        }, /*#__PURE__*/ React.createElement("input", {
            type: "checkbox"
        }), " Keep me signed in"), /*#__PURE__*/ React.createElement("a", {
            href: "#"
        }, "Forgot password?")), /*#__PURE__*/ React.createElement("button", {
            type: "submit",
            className: "btn btn-cta btn-lg",
            style: {
                marginTop: 'var(--sp-2)'
            }
        }, /*#__PURE__*/ React.createElement(Icon, {
            name: "lock",
            size: 16
        }), " ", b.submitLabel, " ", /*#__PURE__*/ React.createElement("span", {
            className: "arrow"
        }, "→"))), b.joinLink && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("hr", {
            className: "divider",
            style: {
                margin: 'var(--sp-8) 0'
            }
        }), /*#__PURE__*/ React.createElement("p", {
            className: "small"
        }, b.joinPrompt, " ", /*#__PURE__*/ React.createElement("a", {
            href: b.joinLink.href,
            style: {
                color: 'var(--brand-deep)',
                borderBottom: '1px solid currentColor'
            }
        }, b.joinLink.label, " →")))))));
    }
    /* ── block registry ──────────────────────────────────────── */ const BLOCKS = {
        heroBlock: HeroBlock,
        conditionsStripBlock: ConditionsStripBlock,
        richTextBlock: RichTextBlock,
        featureGridBlock: FeatureGridBlock,
        quoteBlock: QuoteBlock,
        ctaBandBlock: CtaBandBlock,
        noticeBlock: NoticeBlock,
        forecastBlock: ForecastBlock,
        reviewsBlock: ReviewsBlock,
        infoSectionsBlock: InfoSectionsBlock,
        stepsBlock: StepsBlock,
        youtubeBlock: YoutubeBlock,
        instagramBlock: InstagramBlock,
        iframeBlock: IframeBlock,
        serviceLinkBlock: ServiceLinkBlock,
        newsListBlock: NewsListBlock,
        galleryGridBlock: GalleryGridBlock,
        gearGridBlock: GearGridBlock,
        enquiryFormBlock: EnquiryFormBlock,
        loginFormBlock: LoginFormBlock
    };
    /** Blocks that sit inside a shared two-column section rather than owning a section. */ const PAIRED = new Set([
        'contactListBlock',
        'linkListBlock'
    ]);
    const DIRECTIONS_LEFT = new Set([
        'stepsBlock'
    ]);
    const DIRECTIONS_RIGHT = new Set([
        'linkCardsBlock',
        'addressBlock'
    ]);
    function Block({ b }) {
        const C = BLOCKS[b._type];
        if (!C) return null;
        return /*#__PURE__*/ React.createElement(C, {
            b: b
        });
    }
    /**
 * Renders a page's blocks, grouping the ones that share a row:
 * contactList + linkList sit side by side, and the directions page
 * puts steps on the left with link cards + address on the right.
 */ function Blocks({ content }) {
        const out = [];
        const items = content || [];
        for(let i = 0; i < items.length; i++){
            const b = items[i];
            if (PAIRED.has(b._type)) {
                const pair = [
                    b
                ];
                while(i + 1 < items.length && PAIRED.has(items[i + 1]._type)){
                    pair.push(items[++i]);
                }
                out.push(/*#__PURE__*/ React.createElement("section", {
                    key: b._key,
                    className: "section section-tint"
                }, /*#__PURE__*/ React.createElement("div", {
                    className: "container-wide",
                    style: {
                        display: 'grid',
                        gridTemplateColumns: pair.length > 1 ? '1fr 1fr' : '1fr',
                        gap: 'var(--sp-12)'
                    }
                }, pair.map((p)=>p._type === 'contactListBlock' ? /*#__PURE__*/ React.createElement(ContactListBlock, {
                        key: p._key,
                        b: p
                    }) : /*#__PURE__*/ React.createElement(LinkListBlock, {
                        key: p._key,
                        b: p
                    })))));
                continue;
            }
            if (DIRECTIONS_LEFT.has(b._type) && i + 1 < items.length && DIRECTIONS_RIGHT.has(items[i + 1]._type)) {
                const left = b;
                const right = [];
                while(i + 1 < items.length && DIRECTIONS_RIGHT.has(items[i + 1]._type))right.push(items[++i]);
                out.push(/*#__PURE__*/ React.createElement("section", {
                    key: left._key,
                    className: "section"
                }, /*#__PURE__*/ React.createElement("div", {
                    className: "container-wide directions-grid",
                    style: {
                        marginTop: 0
                    }
                }, /*#__PURE__*/ React.createElement(StepsBlock, {
                    b: left
                }), /*#__PURE__*/ React.createElement("div", null, right.map((r)=>r._type === 'linkCardsBlock' ? /*#__PURE__*/ React.createElement(LinkCardsBlock, {
                        key: r._key,
                        b: r
                    }) : /*#__PURE__*/ React.createElement(AddressBlock, {
                        key: r._key,
                        b: r
                    }))))));
                continue;
            }
            if (b._type === 'mapBlock') {
                out.push(/*#__PURE__*/ React.createElement("section", {
                    key: b._key,
                    className: "section",
                    style: {
                        paddingBottom: 0
                    }
                }, /*#__PURE__*/ React.createElement("div", {
                    className: "container-wide"
                }, /*#__PURE__*/ React.createElement(MapBlock, {
                    b: b
                }))));
                continue;
            }
            if (b._type === 'linkCardsBlock') {
                out.push(/*#__PURE__*/ React.createElement("section", {
                    key: b._key,
                    className: "section"
                }, /*#__PURE__*/ React.createElement("div", {
                    className: "container-wide"
                }, /*#__PURE__*/ React.createElement(LinkCardsBlock, {
                    b: b
                }))));
                continue;
            }
            if (b._type === 'addressBlock') {
                out.push(/*#__PURE__*/ React.createElement("section", {
                    key: b._key,
                    className: "section"
                }, /*#__PURE__*/ React.createElement("div", {
                    className: "container-wide"
                }, /*#__PURE__*/ React.createElement(AddressBlock, {
                    b: b
                }))));
                continue;
            }
            out.push(/*#__PURE__*/ React.createElement(Block, {
                key: b._key,
                b: b
            }));
        }
        return out;
    }
    /* ── PageView ────────────────────────────────────────────── */ function PageHeaderBanner({ page }) {
        const h = page.header;
        if (!h) return null;
        const bg = sanityImageUrl(h.backgroundImage, {
            w: 2000
        });
        return /*#__PURE__*/ React.createElement("section", {
            className: "page-header"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "page-header-bg"
        }, bg && /*#__PURE__*/ React.createElement("img", {
            src: bg,
            alt: "",
            fetchPriority: "high"
        }), /*#__PURE__*/ React.createElement("div", {
            className: "page-header-overlay"
        })), /*#__PURE__*/ React.createElement("div", {
            className: "container-wide page-header-inner"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "crumbs"
        }, /*#__PURE__*/ React.createElement("a", {
            href: "index.html"
        }, "Home"), /*#__PURE__*/ React.createElement("span", null, "/"), /*#__PURE__*/ React.createElement("span", null, page.breadcrumb || page.title)), /*#__PURE__*/ React.createElement(R, null, h.eyebrow && /*#__PURE__*/ React.createElement("span", {
            className: "eyebrow",
            style: {
                color: 'var(--brand-ice)'
            }
        }, h.eyebrow), /*#__PURE__*/ React.createElement("h1", {
            style: {
                marginTop: 14,
                color: '#fff'
            }
        }, h.heading), h.lead && /*#__PURE__*/ React.createElement("p", {
            style: {
                fontFamily: 'var(--font-editorial)',
                fontStyle: 'italic',
                fontSize: 'var(--fs-24)',
                color: 'rgba(255,255,255,.75)',
                marginTop: 'var(--sp-5)',
                maxWidth: '56ch'
            }
        }, h.lead)), (h.facts || []).length > 0 && /*#__PURE__*/ React.createElement("div", {
            className: "hdr-meta"
        }, h.facts.map((f)=>/*#__PURE__*/ React.createElement("div", {
                key: f._key
            }, /*#__PURE__*/ React.createElement("b", null, f.value), f.detail)))));
    }
    function PageView({ slug, site }) {
        const [page, loading] = useSanityQuery(PAGE_QUERY, {
            slug
        }, [
            slug
        ]);
        useEffect(()=>{
            if (!page) return;
            const seo = page.seo || {};
            if (seo.metaTitle || page.title) document.title = seo.metaTitle || `${page.title} — Mitre Ski Club`;
            if (seo.metaDescription) {
                let m = document.querySelector('meta[name="description"]');
                if (!m) {
                    m = document.createElement('meta');
                    m.name = 'description';
                    document.head.appendChild(m);
                }
                m.content = seo.metaDescription;
            }
        }, [
            page
        ]);
        if (loading) return /*#__PURE__*/ React.createElement("main", {
            style: {
                minHeight: '70vh',
                display: 'grid',
                placeItems: 'center'
            }
        }, /*#__PURE__*/ React.createElement("p", {
            className: "muted"
        }, "Loading…"));
        if (!page) return /*#__PURE__*/ React.createElement("main", {
            style: {
                minHeight: '70vh',
                display: 'grid',
                placeItems: 'center',
                textAlign: 'center'
            }
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h1", null, "Page not found"), /*#__PURE__*/ React.createElement("p", {
            className: "muted",
            style: {
                marginTop: 'var(--sp-4)'
            }
        }, "This page hasn't been created in the CMS yet."), /*#__PURE__*/ React.createElement("a", {
            className: "btn btn-primary btn-sm",
            href: "index.html",
            style: {
                marginTop: 'var(--sp-5)'
            }
        }, "Back to home")));
        // The login page owns the whole viewport — no nav, no footer.
        const loginBlock = (page.content || []).find((b)=>b._type === 'loginFormBlock');
        if (loginBlock) return /*#__PURE__*/ React.createElement(LoginFormBlock, {
            b: loginBlock
        });
        return /*#__PURE__*/ React.createElement("main", null, page.headerStyle === 'banner' && /*#__PURE__*/ React.createElement(PageHeaderBanner, {
            page: page
        }), /*#__PURE__*/ React.createElement(Blocks, {
            content: page.content
        }), page.showMemberBand !== false && /*#__PURE__*/ React.createElement(MemberBand, {
            band: site && site.band
        }), /*#__PURE__*/ React.createElement(Footer, {
            nav: site && site.nav,
            settings: site && site.settings
        }));
    }
    /* ── ARTICLE ─────────────────────────────────────────────── */ const POST_BY_SLUG_QUERY = `*[_type=="post" && slug.current==$slug][0]{_id,title,category,publishedAt,readingTimeMinutes,mainImage{alt,asset},body}`;
    function ArticlePage({ site }) {
        const [post, loading] = useSanityQuery(POST_BY_SLUG_QUERY, {
            slug: ART_ID || ''
        }, [
            ART_ID
        ]);
        useEffect(()=>{
            if (post) document.title = `${post.title} — Mitre Ski Club`;
        }, [
            post
        ]);
        const bg = post && post.mainImage ? sanityImageUrl(post.mainImage, {
            w: 1600
        }) : null;
        return /*#__PURE__*/ React.createElement("main", null, /*#__PURE__*/ React.createElement("section", {
            className: "page-header"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "page-header-bg"
        }, bg && /*#__PURE__*/ React.createElement("img", {
            src: bg,
            alt: ""
        }), /*#__PURE__*/ React.createElement("div", {
            className: "page-header-overlay"
        })), /*#__PURE__*/ React.createElement("div", {
            className: "container-wide page-header-inner"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "crumbs"
        }, /*#__PURE__*/ React.createElement("a", {
            href: "index.html"
        }, "Home"), /*#__PURE__*/ React.createElement("span", null, "/"), /*#__PURE__*/ React.createElement("a", {
            href: "news.html"
        }, "News"), /*#__PURE__*/ React.createElement("span", null, "/"), /*#__PURE__*/ React.createElement("span", null, post ? post.category : '')), /*#__PURE__*/ React.createElement("div", {
            className: "article-wrap"
        }, loading ? /*#__PURE__*/ React.createElement("p", {
            style: {
                color: '#fff'
            }
        }, "Loading…") : !post ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("h1", {
            style: {
                color: '#fff'
            }
        }, "Article not found"), /*#__PURE__*/ React.createElement("p", {
            style: {
                color: 'rgba(255,255,255,.7)',
                marginTop: 'var(--sp-4)'
            }
        }, "This story may have been moved or unpublished. ", /*#__PURE__*/ React.createElement("a", {
            href: "news.html",
            style: {
                color: '#fff',
                textDecoration: 'underline'
            }
        }, "Back to news →"))) : /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("span", {
            className: "chip",
            style: {
                marginBottom: 14,
                background: 'rgba(255,255,255,.15)',
                color: '#fff'
            }
        }, post.category), /*#__PURE__*/ React.createElement("h1", {
            style: {
                color: '#fff'
            }
        }, post.title), /*#__PURE__*/ React.createElement("div", {
            style: {
                color: 'rgba(255,255,255,.6)',
                fontSize: 14,
                marginTop: 'var(--sp-4)'
            }
        }, formatDate(post.publishedAt), " · ", readingTimeLabel(post.readingTimeMinutes), " read · By the Web Committee"))))), post && /*#__PURE__*/ React.createElement("section", {
            className: "section"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide article-wrap"
        }, /*#__PURE__*/ React.createElement(PortableText, {
            blocks: post.body
        }), /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("hr", {
            className: "divider"
        }), /*#__PURE__*/ React.createElement("div", {
            className: "row"
        }, /*#__PURE__*/ React.createElement("a", {
            className: "btn btn-ghost btn-sm",
            href: "news.html"
        }, "← Back to news"), /*#__PURE__*/ React.createElement("a", {
            className: "btn btn-primary btn-sm",
            href: "login.html"
        }, "Members' notices →"))))), /*#__PURE__*/ React.createElement(Footer, {
            nav: site && site.nav,
            settings: site && site.settings
        }));
    }
    /* ── APP ─────────────────────────────────────────────────── */ function App() {
        const [theme, setTheme] = useState(()=>localStorage.getItem('mitre-theme') || 'light');
        useEffect(()=>{
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('mitre-theme', theme);
        }, [
            theme
        ]);
        const [site] = useSanityQuery(SITE_QUERY, {}, []);
        const slug = PAGE === 'home' ? 'index' : PAGE;
        const isArticle = PAGE === 'article';
        const isLogin = PAGE === 'login';
        return /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(GlobalFX, null), !isLogin && /*#__PURE__*/ React.createElement(TopNav, {
            nav: site && site.nav,
            settings: site && site.settings,
            current: PAGE
        }), isArticle ? /*#__PURE__*/ React.createElement(ArticlePage, {
            site: site
        }) : /*#__PURE__*/ React.createElement(PageView, {
            slug: slug,
            site: site
        }), /*#__PURE__*/ React.createElement("div", {
            className: "theme-toggle"
        }, [
            'light',
            'dark'
        ].map((t)=>/*#__PURE__*/ React.createElement("button", {
                key: t,
                className: theme === t ? 'active' : '',
                onClick: ()=>setTheme(t),
                "aria-pressed": theme === t
            }, t.charAt(0).toUpperCase() + t.slice(1)))));
    }
    ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/ React.createElement(App, null));
});

