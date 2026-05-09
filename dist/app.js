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
    /* ── TopNav ──────────────────────────────────────────────── */ function TopNav({ current }) {
        const [open, setOpen] = useState(false);
        const scrolled = true;
        const items = [
            [
                'home',
                'Home'
            ],
            [
                'lodge',
                'The Lodge'
            ],
            [
                'buller',
                'Mt Buller'
            ],
            [
                'news',
                'News'
            ],
            [
                'gallery',
                'Gallery'
            ],
            [
                'enquiries',
                'Enquiries'
            ]
        ];
        return /*#__PURE__*/ React.createElement("header", {
            className: 'top-nav ' + (scrolled ? 'scrolled' : '')
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
            height: 44,
            mono: !scrolled
        })), /*#__PURE__*/ React.createElement("nav", {
            className: "nav-links",
            "aria-label": "Primary"
        }, items.map(([id, lbl])=>/*#__PURE__*/ React.createElement("a", {
                key: id,
                href: id === 'home' ? 'index.html' : id + '.html',
                className: 'nav-link ' + (current === id ? 'active' : '')
            }, lbl))), /*#__PURE__*/ React.createElement("div", {
            className: "nav-actions"
        }, /*#__PURE__*/ React.createElement("a", {
            className: "btn btn-cta btn-sm",
            href: "login.html"
        }, /*#__PURE__*/ React.createElement(Icon, {
            name: "lock",
            size: 14
        }), " Member login ", /*#__PURE__*/ React.createElement("span", {
            className: "arrow"
        }, "→")), /*#__PURE__*/ React.createElement("button", {
            className: "nav-burger",
            onClick: ()=>setOpen(!open),
            "aria-label": "Menu"
        }, /*#__PURE__*/ React.createElement(Icon, {
            name: open ? 'close' : 'menu'
        })))), open && /*#__PURE__*/ React.createElement("div", {
            className: "nav-mobile"
        }, items.map(([id, lbl])=>/*#__PURE__*/ React.createElement("a", {
                key: id,
                href: id === 'home' ? 'index.html' : id + '.html',
                className: 'nav-link ' + (current === id ? 'active' : '')
            }, lbl)), /*#__PURE__*/ React.createElement("a", {
            href: "shop.html",
            className: 'nav-link ' + (current === 'shop' ? 'active' : '')
        }, "Used gear shop"), /*#__PURE__*/ React.createElement("a", {
            className: "btn btn-cta",
            href: "login.html"
        }, /*#__PURE__*/ React.createElement(Icon, {
            name: "lock",
            size: 14
        }), " Member login →")));
    }
    /* ── ConditionsStrip ─────────────────────────────────────── */ function ConditionsStrip() {
        const stats = [
            {
                label: 'Base depth',
                value: '142 cm',
                sub: 'Bourke Street',
                icon: 'snow'
            },
            {
                label: 'Last 24 h',
                value: '32 cm',
                sub: 'fresh, light',
                icon: 'cloud-snow'
            },
            {
                label: 'Temperature',
                value: '−4°',
                sub: 'feels like −9°',
                icon: 'thermometer'
            },
            {
                label: 'Lifts open',
                value: '14 / 22',
                sub: 'wind-hold Summit',
                icon: 'mountain'
            }
        ];
        return /*#__PURE__*/ React.createElement("div", {
            className: "cond-strip"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide cond-inner"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "cond-meta"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "chip"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "dot live"
        }), " Live"), /*#__PURE__*/ React.createElement("span", {
            style: {
                color: 'var(--snow-400)',
                fontSize: 13
            }
        }, "Updated 7 min ago · 5 May 2026, 7:42 AM")), /*#__PURE__*/ React.createElement("div", {
            className: "cond-stats"
        }, stats.map((s)=>/*#__PURE__*/ React.createElement("div", {
                key: s.label,
                className: "cond-stat"
            }, /*#__PURE__*/ React.createElement(Icon, {
                name: s.icon,
                size: 20
            }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
                className: "cond-val"
            }, s.value), /*#__PURE__*/ React.createElement("div", {
                className: "cond-sub"
            }, /*#__PURE__*/ React.createElement("b", null, s.label), " · ", s.sub))))), /*#__PURE__*/ React.createElement("a", {
            className: "btn btn-ghost btn-sm",
            href: "https://www.mtbuller.com.au/winter/the-mountain/snow-report",
            target: "_blank",
            rel: "noopener noreferrer"
        }, "Full snow report ", /*#__PURE__*/ React.createElement(Icon, {
            name: "external",
            size: 13
        }))));
    }
    /* ── MemberBand ──────────────────────────────────────────── */ function MemberBand() {
        const [ref, vis] = useReveal();
        return /*#__PURE__*/ React.createElement("section", {
            className: "member-band",
            ref: ref
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container member-band-inner"
        }, /*#__PURE__*/ React.createElement("div", {
            className: 'reveal d0 ' + (vis ? 'is-visible' : '')
        }, /*#__PURE__*/ React.createElement("span", {
            className: "eyebrow",
            style: {
                color: 'var(--brand-sky)'
            }
        }, "Members"), /*#__PURE__*/ React.createElement("h2", {
            style: {
                color: '#fff',
                marginTop: 10
            }
        }, "Already a Mitre member?"), /*#__PURE__*/ React.createElement("p", {
            style: {
                color: 'var(--snow-300)',
                maxWidth: '50ch',
                marginTop: 8
            }
        }, "Skip ahead. Bookings, season dates, members' notices — all in the portal.")), /*#__PURE__*/ React.createElement("div", {
            className: 'reveal d1 member-band-cta ' + (vis ? 'is-visible' : '')
        }, /*#__PURE__*/ React.createElement("a", {
            className: "btn btn-cta btn-lg",
            href: "login.html"
        }, /*#__PURE__*/ React.createElement(Icon, {
            name: "lock",
            size: 16
        }), " Login to bookings ", /*#__PURE__*/ React.createElement("span", {
            className: "arrow"
        }, "→")), /*#__PURE__*/ React.createElement("span", {
            style: {
                color: 'var(--snow-400)',
                fontSize: 13,
                marginTop: 6
            }
        }, "bookings.mitreskiclub.com"))));
    }
    /* ── Reviews ─────────────────────────────────────────────── */ const REVIEWS = [
        {
            name: 'James T.',
            init: 'JT',
            rating: 5,
            date: 'March 2026',
            text: "The perfect alpine club. Small enough that everyone knows each other, big enough to have everything you need. We've been coming for six seasons and it just gets better."
        },
        {
            name: 'Priya S.',
            init: 'PS',
            rating: 5,
            date: 'August 2025',
            text: "Ski-in, ski-out from Standard was everything. The drying room is brilliant — gear's always ready next morning. Warm, welcoming crew and the best positioned lodge on The Avenue."
        },
        {
            name: 'Marcus H.',
            init: 'MH',
            rating: 5,
            date: 'July 2025',
            text: "As a family of four we were worried a club lodge might feel unwelcoming, but it was the opposite. Kids loved the TV room after dinner; we loved the fact that it wasn't a hotel."
        },
        {
            name: 'Anna W.',
            init: 'AW',
            rating: 5,
            date: 'June 2025',
            text: "Did the working bee weekend in May and stayed for a ski trip in July. This is what skiing should feel like — communal, affordable, and a great laugh at the end of the day."
        },
        {
            name: 'Daniel C.',
            init: 'DC',
            rating: 5,
            date: 'September 2024',
            text: "Brilliant value compared to resort accommodation. The lodge manager Anna runs an incredibly tight ship. Allocation system is fair, kitchen is well equipped. Can't fault it."
        },
        {
            name: 'Sophie R.',
            init: 'SR',
            rating: 4,
            date: 'August 2024',
            text: "Excellent location at the end of The Avenue. Rooms are cosy — not luxury but totally comfortable. The view from the lounge on a clear morning is worth it alone."
        }
    ];
    function ReviewsSection() {
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
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("span", {
            className: "eyebrow"
        }, "What members & guests say"), /*#__PURE__*/ React.createElement("h2", {
            style: {
                marginTop: 14
            }
        }, "Sixty winters of happy skiers.")), /*#__PURE__*/ React.createElement("div", {
            className: "reviews-rating-block"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "reviews-score"
        }, "4.8"), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(Stars, {
            n: 5
        }), /*#__PURE__*/ React.createElement("div", {
            style: {
                fontSize: 13,
                color: 'var(--ink-muted)',
                marginTop: 5
            }
        }, "Based on Google reviews"), /*#__PURE__*/ React.createElement("a", {
            href: "https://www.google.com/maps/place/Mitre+Ski+Club/data=!4m2!3m1!1s0x0:0xf93f066352e269fc",
            target: "_blank",
            rel: "noopener noreferrer",
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
        }, "View all reviews ", /*#__PURE__*/ React.createElement(Icon, {
            name: "arrow-up-right",
            size: 13
        }))))), /*#__PURE__*/ React.createElement("div", {
            className: "reviews-grid"
        }, REVIEWS.map((r, i)=>/*#__PURE__*/ React.createElement(R, {
                key: r.name,
                d: i % 3
            }, /*#__PURE__*/ React.createElement("div", {
                className: "review-card"
            }, /*#__PURE__*/ React.createElement("div", {
                className: "review-card-top"
            }, /*#__PURE__*/ React.createElement("div", {
                className: "review-avatar"
            }, r.init), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
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
            }, /*#__PURE__*/ React.createElement("span", null, r.date), /*#__PURE__*/ React.createElement("span", {
                style: {
                    opacity: .35
                }
            }, "·"), /*#__PURE__*/ React.createElement("span", null, "Verified member"))))))));
    }
    /* ── Footer ──────────────────────────────────────────────── */ function Footer() {
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
        }, /*#__PURE__*/ React.createElement("p", {
            style: {
                color: 'var(--snow-400)',
                fontSize: 14,
                lineHeight: 1.7,
                maxWidth: '36ch',
                margin: 0
            }
        }, "A members' lodge on Mt Buller, Victoria. Skiing, eating and arguing over dinner since 1962."), /*#__PURE__*/ React.createElement("div", {
            className: "footer-social"
        }, /*#__PURE__*/ React.createElement("a", {
            href: "https://www.instagram.com/mitreskiclub/",
            target: "_blank",
            rel: "noopener noreferrer",
            "aria-label": "Instagram"
        }, /*#__PURE__*/ React.createElement(Icon, {
            name: "instagram"
        })), /*#__PURE__*/ React.createElement("a", {
            href: "https://www.facebook.com/mitreskiclub/",
            target: "_blank",
            rel: "noopener noreferrer",
            "aria-label": "Facebook"
        }, /*#__PURE__*/ React.createElement(Icon, {
            name: "facebook"
        })))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h5", null, "Visit"), /*#__PURE__*/ React.createElement("a", {
            href: "index.html"
        }, "Home"), /*#__PURE__*/ React.createElement("a", {
            href: "lodge.html"
        }, "The Lodge"), /*#__PURE__*/ React.createElement("a", {
            href: "buller.html"
        }, "Mt Buller"), /*#__PURE__*/ React.createElement("a", {
            href: "directions.html"
        }, "Directions"), /*#__PURE__*/ React.createElement("a", {
            href: "https://www.mtbuller.com.au/winter/weather/web-cams",
            target: "_blank",
            rel: "noopener noreferrer"
        }, "Snow cams ", /*#__PURE__*/ React.createElement(Icon, {
            name: "external",
            size: 11
        }))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h5", null, "Members"), /*#__PURE__*/ React.createElement("a", {
            href: "login.html"
        }, "Login to bookings"), /*#__PURE__*/ React.createElement("a", {
            href: "gallery.html"
        }, "Members' gallery"), /*#__PURE__*/ React.createElement("a", {
            href: "shop.html"
        }, "Used gear shop"), /*#__PURE__*/ React.createElement("a", {
            href: "#"
        }, "Working bee dates"), /*#__PURE__*/ React.createElement("a", {
            href: "#"
        }, "AGM & minutes")), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h5", null, "Join"), /*#__PURE__*/ React.createElement("a", {
            href: "news.html"
        }, "News & notices"), /*#__PURE__*/ React.createElement("a", {
            href: "enquiries.html"
        }, "Become a member"), /*#__PURE__*/ React.createElement("a", {
            href: "enquiries.html"
        }, "Make an enquiry")), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h5", null, "Contact"), /*#__PURE__*/ React.createElement("p", {
            className: "footer-contact"
        }, "Mitre Lodge", /*#__PURE__*/ React.createElement("br", null), "14 The Avenue", /*#__PURE__*/ React.createElement("br", null), "Mt Buller VIC 3723", /*#__PURE__*/ React.createElement("br", null), /*#__PURE__*/ React.createElement("br", null), /*#__PURE__*/ React.createElement("a", {
            href: "mailto:secretary@mitreskiclub.com"
        }, "secretary@mitreskiclub.com")))), /*#__PURE__*/ React.createElement("div", {
            className: "footer-bottom"
        }, /*#__PURE__*/ React.createElement("span", null, "© 2026 Mitre Ski Club Inc."), /*#__PURE__*/ React.createElement("span", null, /*#__PURE__*/ React.createElement("a", {
            href: "#"
        }, "Privacy"), " · ", /*#__PURE__*/ React.createElement("a", {
            href: "#"
        }, "Terms"), " · Built by the Web Committee"))));
    }
    /* ── NEWS DATA ───────────────────────────────────────────── */ const NEWS = [
        {
            id: 'first-snow',
            tag: 'Snow report',
            tone: 'sky',
            src: 'assets/photo-resort-crowd.jpg',
            date: '12 May 2026',
            read: '3 min',
            title: 'First proper dump of the season blankets Buller',
            excerpt: 'Thirty centimetres overnight, with another front due Friday. The lodge manager has the boot room ready.',
            body: [
                "If you've been watching the radar, you'll already know — the first real front of the season rolled through Buller on Tuesday night, dropping just over thirty centimetres on Bourke Street and a touch more up on the summit.",
                "It's the earliest decent fall we've seen since 2021. Bourke Street is open with two lifts spinning; Standard is still patchy in places but skiable end-to-end.",
                "We've had the lodge manager Anna up since the weekend. The boot room is sorted, the kitchen restocked, and there's firewood under the eaves. A second front is forecast for Friday — twenty to forty centimetres possible."
            ]
        },
        {
            id: 'agm-2026',
            tag: 'Notice',
            tone: 'deep',
            src: 'assets/photo-snowboarder-pov.jpg',
            date: '28 Apr 2026',
            read: '2 min',
            title: '2026 AGM — Saturday 7 June, online & in person',
            excerpt: 'Voting opens for two committee positions; agenda and proxy forms now available in the member portal.',
            body: [
                "The 2026 Annual General Meeting will be held on Saturday 7 June at 10am, in person at the lodge with a Zoom link for members who can't make it up the hill.",
                "Two committee positions are open — Treasurer and Bookings Secretary. Nominations close Friday 30 May."
            ]
        },
        {
            id: 'working-bee',
            tag: 'Working bee',
            tone: 'morning',
            src: 'assets/photo-blue-sky-resort.jpg',
            date: '14 Apr 2026',
            read: '4 min',
            title: 'Working bee weekend — May 17–18',
            excerpt: 'Two days, food provided, a couple of beds available for those travelling up. Sign up via the portal.',
            body: [
                "Our annual pre-season working bee is Saturday 17 and Sunday 18 May. The to-do list is mostly maintenance — check the heating, sweep the chimney, scrub the drying room, plus the usual spring clean of the kitchen.",
                "Food and drinks are on the club. If you're driving from Melbourne and want a bed Friday or Saturday night, sign up early."
            ]
        },
        {
            id: 'used-skis',
            tag: 'Used gear',
            tone: 'glacier',
            src: 'assets/photo-chairlift-golden.jpg',
            date: '8 Apr 2026',
            read: '1 min',
            title: "Used gear: members selling skis, boots & jackets",
            excerpt: "Six listings this week — Volkl Mantras, a like-new Arc'teryx shell, and two pairs of kids' boots.",
            body: [
                "The pre-season used-gear listings are up. Six items this week including a pair of Volkl Mantra M6 (172cm), an Arc'teryx Sabre LT shell in size M, and two pairs of kids' Salomon QSTs.",
                "Listings are members-only; log in to the portal to see prices. Head to the used gear shop to browse listings."
            ]
        },
        {
            id: 'season-pass',
            tag: 'Season',
            tone: 'sunset',
            src: 'assets/mountain.png',
            date: '22 Mar 2026',
            read: '2 min',
            title: "Season pass deadline — Friday 26 April",
            excerpt: "Buller's early-bird pricing closes end of April. Group rates available for parties of six or more.",
            body: [
                "Mt Buller's early-bird season pass pricing closes on Friday 26 April. After that, you'll pay the standard rate — usually a difference of around $200 per adult.",
                "If you're skiing with five or more friends or family, the group rate brings the per-pass price down further."
            ]
        },
        {
            id: 'buller-bike',
            tag: 'Off-season',
            tone: 'morning',
            src: 'assets/photo-mt-buller-peak.jpg',
            date: '5 Mar 2026',
            read: '3 min',
            title: 'Lodge bookings now open for summer & autumn',
            excerpt: 'Mountain biking, walking, family weekends — the lodge is yours outside the snow season too.',
            body: [
                "The lodge is available for individual and group bookings outside the ski season. Mountain biking is in full swing through summer and autumn.",
                "There's no lodge manager in residence between October and June — we'll send you the keys, the codes, and a walkthrough of opening, closing and security."
            ]
        }
    ];
    /* ── HOME ────────────────────────────────────────────────── */ function HomePage() {
        const [loaded, setLoaded] = useState(false);
        useEffect(()=>{
            const t = setTimeout(()=>setLoaded(true), 120);
            return ()=>clearTimeout(t);
        }, []);
        const [statsRef, statsVis] = useReveal({
            th: .08
        });
        const [whyRef, whyVis] = useReveal({
            th: .06
        });
        return /*#__PURE__*/ React.createElement("main", null, /*#__PURE__*/ React.createElement("div", {
            style: {
                paddingTop: 'var(--nav-h)'
            }
        }, /*#__PURE__*/ React.createElement(ConditionsStrip, null)), /*#__PURE__*/ React.createElement("section", {
            className: "hero"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "hero-media"
        }, /*#__PURE__*/ React.createElement("video", {
            autoPlay: true,
            muted: true,
            loop: true,
            playsInline: true,
            poster: "assets/photo-resort-crowd.webp",
            fetchPriority: "high",
            style: {
                width: '100%',
                height: '100%',
                objectFit: 'cover'
            }
        }, /*#__PURE__*/ React.createElement("source", {
            src: "assets/hero1-opt.mp4",
            type: "video/mp4"
        }), /*#__PURE__*/ React.createElement("source", {
            src: "assets/hero2-opt.mp4",
            type: "video/mp4"
        }))), /*#__PURE__*/ React.createElement("div", {
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
            className: 'hero-body container-wide'
        }, /*#__PURE__*/ React.createElement("div", {
            style: {
                opacity: loaded ? 1 : 0,
                transform: loaded ? 'none' : 'translateY(24px)',
                transition: 'opacity .9s .15s,transform .9s .15s'
            },
            className: "hero-grid"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("span", {
            className: "eyebrow hero-eyebrow"
        }, "Mt Buller · Est. 1962"), /*#__PURE__*/ React.createElement("h1", {
            className: "hero-h1"
        }, "Your home", /*#__PURE__*/ React.createElement("br", null), /*#__PURE__*/ React.createElement("em", null, "on the mountain.")), /*#__PURE__*/ React.createElement("p", {
            className: "hero-lead"
        }, "A members' lodge at the end of The Avenue. Ski straight in off Standard, walk five minutes to the lifts, and meet everyone over dinner."), /*#__PURE__*/ React.createElement("div", {
            className: "hero-ctas"
        }, /*#__PURE__*/ React.createElement("a", {
            className: "btn btn-cta btn-lg",
            href: "login.html"
        }, /*#__PURE__*/ React.createElement(Icon, {
            name: "lock",
            size: 16
        }), " Member login ", /*#__PURE__*/ React.createElement("span", {
            className: "arrow"
        }, "→")), /*#__PURE__*/ React.createElement("a", {
            className: "btn btn-ghost-light btn-lg",
            href: "enquiries.html"
        }, "Become a member"))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
            className: "hero-art-card"
        }, /*#__PURE__*/ React.createElement(Pic, {
            src: "assets/photo-snowboarder-pov.jpg",
            alt: "Snowboarder's view at Mt Buller",
            priority: true
        }), /*#__PURE__*/ React.createElement("div", {
            className: "hero-art-badge"
        }, /*#__PURE__*/ React.createElement(Icon, {
            name: "map-pin",
            size: 16
        }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
            style: {
                fontWeight: 600,
                fontSize: 13
            }
        }, "14 The Avenue"), /*#__PURE__*/ React.createElement("div", {
            style: {
                fontSize: 11,
                color: 'var(--snow-300)'
            }
        }, "Mt Buller · Last lodge on the road")))))), /*#__PURE__*/ React.createElement("div", {
            className: "hero-stats",
            ref: statsRef
        }, [
            [
                '1962',
                'Founded'
            ],
            [
                '40+',
                'Beds · 12 rooms'
            ],
            [
                '5 min',
                'Walk to lifts'
            ],
            [
                '60+',
                'Winters on Buller'
            ]
        ].map(([n, l], i)=>/*#__PURE__*/ React.createElement("div", {
                key: i,
                className: 'hero-stat reveal d' + i + ' ' + (statsVis ? 'is-visible' : '')
            }, /*#__PURE__*/ React.createElement("b", null, n), /*#__PURE__*/ React.createElement("span", null, l))))), /*#__PURE__*/ React.createElement("div", {
            className: "scroll-cue",
            "aria-hidden": true
        }, /*#__PURE__*/ React.createElement("span", null, "Scroll"), /*#__PURE__*/ React.createElement("div", {
            className: "scroll-cue-line"
        }))), /*#__PURE__*/ React.createElement("div", {
            className: "full-bleed",
            style: {
                backgroundImage: "url(assets/photo-resort-crowd.webp)"
            }
        }, /*#__PURE__*/ React.createElement("div", {
            className: "full-bleed-overlay"
        }), /*#__PURE__*/ React.createElement("div", {
            className: "container full-bleed-content"
        }, /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("span", {
            className: "eyebrow",
            style: {
                color: 'var(--brand-ice)'
            }
        }, "Sixty winters in")), /*#__PURE__*/ React.createElement(R, {
            d: 1
        }, /*#__PURE__*/ React.createElement("h2", {
            className: "editorial-quote"
        }, '"Last lodge on the Avenue.', /*#__PURE__*/ React.createElement("br", null), 'Ski straight in off Standard."')), /*#__PURE__*/ React.createElement(R, {
            d: 2
        }, /*#__PURE__*/ React.createElement("div", {
            style: {
                color: 'var(--snow-300)',
                marginTop: 'var(--sp-4)',
                fontSize: 13,
                letterSpacing: '.1em',
                textTransform: 'uppercase'
            }
        }, "— Mitre Ski Club · Est. 1962")))), /*#__PURE__*/ React.createElement("section", {
            className: "section",
            ref: whyRef
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide"
        }, /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("div", {
            className: "section-head"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "eyebrow"
        }, "Why members stay"), /*#__PURE__*/ React.createElement("h2", {
            style: {
                marginTop: 14
            }
        }, "A small lodge, run by its members."), /*#__PURE__*/ React.createElement("p", {
            className: "lead",
            style: {
                color: 'var(--ink-muted)'
            }
        }, "Sixty-odd years of working bees, dinners, snow days and Sunday departures. Mitre is a club, not a hotel — and it shows."))), /*#__PURE__*/ React.createElement("div", {
            className: "feat-grid"
        }, [
            {
                icon: 'mountain',
                title: 'Ski-in, ski-out',
                body: "The last lodge on The Avenue, with Standard at the front door and the beginner area five minutes' walk away."
            },
            {
                icon: 'users',
                title: 'Communal by design',
                body: "Twelve rooms, shared kitchen, big drying room, and a TV room that gets loud after a powder day."
            },
            {
                icon: 'calendar',
                title: 'Open year-round',
                body: "Winter is the big show, but the lodge is also available for groups in summer — mountain biking, walking, the family."
            }
        ].map((f, i)=>/*#__PURE__*/ React.createElement(R, {
                key: i,
                d: i
            }, /*#__PURE__*/ React.createElement("div", {
                className: "feat"
            }, /*#__PURE__*/ React.createElement("div", {
                className: "icon-wrap"
            }, /*#__PURE__*/ React.createElement(Icon, {
                name: f.icon,
                size: 20
            })), /*#__PURE__*/ React.createElement("h3", null, f.title), /*#__PURE__*/ React.createElement("p", null, f.body))))))), /*#__PURE__*/ React.createElement("section", {
            className: "section section-tint"
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
        }, /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("div", {
            className: "section-head",
            style: {
                marginBottom: 0
            }
        }, /*#__PURE__*/ React.createElement("span", {
            className: "eyebrow"
        }, "Latest from the lodge"), /*#__PURE__*/ React.createElement("h2", {
            style: {
                marginTop: 14
            }
        }, "What's happening on the mountain"))), /*#__PURE__*/ React.createElement(R, {
            d: 1
        }, /*#__PURE__*/ React.createElement("a", {
            className: "btn btn-ghost btn-sm",
            href: "news.html"
        }, "All news ", /*#__PURE__*/ React.createElement(Icon, {
            name: "arrow",
            size: 14
        })))), /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("div", {
            className: "story-rail"
        }, NEWS.slice(0, 3).map((p, i)=>/*#__PURE__*/ React.createElement("article", {
                key: p.id,
                className: "news-card",
                onClick: ()=>onNav('article', p.id),
                style: {
                    cursor: 'pointer'
                }
            }, /*#__PURE__*/ React.createElement(Photo, {
                tone: p.tone,
                src: p.src,
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
            }, p.tag), p.date), /*#__PURE__*/ React.createElement("h3", null, p.title), /*#__PURE__*/ React.createElement("p", null, p.excerpt), /*#__PURE__*/ React.createElement("span", {
                className: "more"
            }, "Read ", i === 0 ? 'article' : '', " ", /*#__PURE__*/ React.createElement(Icon, {
                name: "arrow",
                size: 14
            }))))))))), /*#__PURE__*/ React.createElement(ReviewsSection, null), /*#__PURE__*/ React.createElement(MemberBand, null), /*#__PURE__*/ React.createElement(Footer, null));
    }
    /* ── LODGE ───────────────────────────────────────────────── */ function LodgePage() {
        const toc = [
            [
                'about',
                'About the lodge'
            ],
            [
                'community',
                'Community spirit'
            ],
            [
                'location',
                'Location'
            ],
            [
                'facilities',
                'Facilities'
            ],
            [
                'check-in',
                'Check-in'
            ],
            [
                'check-out',
                'Check-out'
            ],
            [
                'bring',
                'What to bring'
            ],
            [
                'getting-there',
                'Getting there'
            ],
            [
                'summer',
                'Outside ski season'
            ]
        ];
        const [active, setActive] = useState('about');
        useEffect(()=>{
            const onS = ()=>{
                let cur = toc[0][0];
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
        }, []);
        const blocks = [
            {
                id: 'about',
                title: 'About the lodge',
                content: /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("p", null, "Mitre Lodge has been on Mt Buller since 1962. We're a small, friendly club run by its members. The lodge holds about forty across twelve rooms — a mix of doubles, singles and bunks, with shared bathrooms and a big communal kitchen."), /*#__PURE__*/ React.createElement(Photo, {
                    className: "info-photo",
                    src: "assets/photo-chairlift-golden.jpg",
                    label: "Mt Buller lifts"
                }))
            },
            {
                id: 'community',
                title: 'Community spirit',
                content: /*#__PURE__*/ React.createElement("p", null, "Mitre is communal by design. Members get involved with meetings and working bees; the lodge manager and members give a warm welcome as new guests arrive. There are smiles in the morning and stories at the end of the day.")
            },
            {
                id: 'location',
                title: 'Ski-in / Ski-out location',
                content: /*#__PURE__*/ React.createElement("p", null, "Mitre is at the end of The Avenue, next to the Navy Lodge. Being the last lodge on the road, the views are excellent and access is straight onto Standard (intermediate). Bus Stop No. 9 is two lodges down.")
            },
            {
                id: 'facilities',
                title: 'Facilities',
                content: /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("p", null, "Communal lounge rooms, TV rooms, dining and a large drying room. Twelve bedrooms — 2 to 5-berth, with combinations of doubles, singles and bunks. Each bedroom has a hand basin. The kitchen has a large fridge, gas and electric stoves, ovens, microwaves, dishwashers."), /*#__PURE__*/ React.createElement("div", {
                    className: "feat-grid",
                    style: {
                        marginTop: 'var(--sp-6)'
                    }
                }, [
                    [
                        '12 bedrooms',
                        '2–5 berths · all with hand basins'
                    ],
                    [
                        'Shared kitchen',
                        'Allocated fridge & pantry shelves'
                    ],
                    [
                        'Drying room',
                        'Boots off in the foyer, please'
                    ]
                ].map(([h, s])=>/*#__PURE__*/ React.createElement("div", {
                        key: h,
                        className: "feat",
                        style: {
                            padding: 'var(--sp-5)'
                        }
                    }, /*#__PURE__*/ React.createElement("h4", null, h), /*#__PURE__*/ React.createElement("p", {
                        className: "muted",
                        style: {
                            fontSize: 14,
                            margin: '6px 0 0'
                        }
                    }, s)))))
            },
            {
                id: 'check-in',
                title: 'Check-in',
                content: /*#__PURE__*/ React.createElement("p", null, "Ring the doorbell or use the security code in your booking confirmation email. Ski boots go in the drying room before heading into the lodge. Your room allocation will be on the whiteboard in the foyer. Changeover is by 5pm.")
            },
            {
                id: 'check-out',
                title: 'Check-out',
                content: /*#__PURE__*/ React.createElement("p", null, "You're responsible for cleaning your room — wipe the basin and tiles, vacuum the carpet. Clear your pantry and fridge shelves. All done by 5pm. Taxi: (03) 5777 6070.")
            },
            {
                id: 'bring',
                title: 'What to bring',
                content: /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("p", null, "Doonas and pillows are supplied. Linen isn't — please bring a bottom sheet, top sheet (or sleeping bag), pillow case and a towel."), /*#__PURE__*/ React.createElement("p", null, "Tea, coffee, sugar, jam, honey, sauces and mustards are provided. Bring your own food and drinks. Mansfield IGA delivers: (03) 5775 2014."))
            },
            {
                id: 'getting-there',
                title: 'Getting there',
                content: /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("p", null, "Drive up and park, or take the bus from Mansfield/Merrijig. Fees are paid at the Merrijig gate. Chains must be carried until end of season — hire them in Mansfield."), /*#__PURE__*/ React.createElement("p", null, "Oversnow taxis: Mon–Thu 7am–midnight, Fri 7am–3am, Sat 7am–2am, Sun 7am–midnight. Tell the driver it's next to Navy at the end of The Avenue."), /*#__PURE__*/ React.createElement("a", {
                    className: "btn btn-ghost btn-sm",
                    href: "directions.html",
                    style: {
                        marginTop: 'var(--sp-4)',
                        display: 'inline-flex'
                    }
                }, /*#__PURE__*/ React.createElement(Icon, {
                    name: "map-pin",
                    size: 14
                }), " Full directions & map"))
            },
            {
                id: 'summer',
                title: 'Outside ski season',
                content: /*#__PURE__*/ React.createElement("p", null, "Mountain biking, bushwalking, horse riding, scenic chairlift rides, summer events. The lodge is available for individuals or group bookings out of season. We'll send keys and walk you through opening and security.")
            }
        ];
        return /*#__PURE__*/ React.createElement("main", null, /*#__PURE__*/ React.createElement("section", {
            className: "page-header"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "page-header-bg"
        }, /*#__PURE__*/ React.createElement(Pic, {
            src: "assets/photo-resort-crowd.jpg",
            alt: ""
        }), /*#__PURE__*/ React.createElement("div", {
            className: "page-header-overlay"
        })), /*#__PURE__*/ React.createElement("div", {
            className: "container-wide page-header-inner"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "crumbs"
        }, /*#__PURE__*/ React.createElement("a", {
            href: "index.html"
        }, "Home"), /*#__PURE__*/ React.createElement("span", null, "/"), /*#__PURE__*/ React.createElement("span", null, "The Lodge")), /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("span", {
            className: "eyebrow",
            style: {
                color: 'var(--brand-ice)'
            }
        }, "A guide for members & guests"), /*#__PURE__*/ React.createElement("h1", {
            style: {
                marginTop: 14,
                color: '#fff'
            }
        }, "The Lodge."), /*#__PURE__*/ React.createElement("p", {
            style: {
                fontFamily: 'var(--font-editorial)',
                fontStyle: 'italic',
                fontSize: 'var(--fs-24)',
                color: 'rgba(255,255,255,.75)',
                marginTop: 'var(--sp-5)',
                maxWidth: '56ch'
            }
        }, "Last lodge on The Avenue. Ski straight in, walk five minutes to the lifts.")), /*#__PURE__*/ React.createElement("div", {
            className: "hdr-meta"
        }, [
            [
                '12 rooms',
                '2–5 berths'
            ],
            [
                '~40 beds',
                'doonas supplied'
            ],
            [
                'Bus stop 9',
                'two lodges away'
            ],
            [
                'Wi-Fi',
                'browsing only'
            ]
        ].map(([b, s])=>/*#__PURE__*/ React.createElement("div", {
                key: b
            }, /*#__PURE__*/ React.createElement("b", null, b), s))))), /*#__PURE__*/ React.createElement("section", {
            className: "section"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide info-layout"
        }, /*#__PURE__*/ React.createElement("aside", {
            className: "info-toc"
        }, /*#__PURE__*/ React.createElement("h5", null, "On this page"), toc.map(([id, lbl])=>/*#__PURE__*/ React.createElement("a", {
                key: id,
                href: '#' + id,
                className: active === id ? 'active' : ''
            }, lbl))), /*#__PURE__*/ React.createElement("div", null, blocks.map((b)=>/*#__PURE__*/ React.createElement(R, {
                key: b.id
            }, /*#__PURE__*/ React.createElement("div", {
                className: "info-block",
                id: b.id
            }, /*#__PURE__*/ React.createElement("h2", null, b.title), b.content)))))), /*#__PURE__*/ React.createElement(MemberBand, null), /*#__PURE__*/ React.createElement(Footer, null));
    }
    /* ── BULLER ──────────────────────────────────────────────── */ function BullerPage() {
        const contacts = [
            [
                'Lift tickets, Ski &amp; Snowboard School',
                '(03) 5777 7800'
            ],
            [
                'Mt Buller taxis',
                '(03) 5777 6070'
            ],
            [
                'Resort Management (gate, parking)',
                '(03) 5777 6077'
            ],
            [
                'Towing &amp; chain fitting',
                '0427 077 572'
            ],
            [
                'Ski Patrol',
                '(03) 5777 7808'
            ],
            [
                'Emergencies (Fire / Ambo / Police)',
                '000'
            ],
            [
                'Buller Medical Centre (winter)',
                '(03) 5777 6185'
            ],
            [
                'Mansfield IGA (delivers to Mitre)',
                '(03) 5775 2014'
            ]
        ];
        const links = [
            {
                label: 'Mt Buller website',
                url: 'https://www.mtbuller.com.au/'
            },
            {
                label: 'Resort entry &amp; taxis',
                url: 'https://www.mtbuller.com.au/winter/plan-your-trip/getting-here'
            },
            {
                label: 'Lift passes',
                url: 'https://www.mtbuller.com.au/winter/tickets-passes/lift-passes'
            },
            {
                label: 'Snow cams',
                url: 'https://www.mtbuller.com.au/winter/weather/web-cams'
            },
            {
                label: 'Full snow report',
                url: 'https://www.mtbuller.com.au/winter/the-mountain/snow-report'
            },
            {
                label: 'BoM forecast',
                url: 'https://www.bom.gov.au/vic/forecasts/alpine.shtml'
            },
            {
                label: 'Resort maps',
                url: 'https://www.mtbuller.com.au/winter/the-mountain/trail-map'
            },
            {
                label: 'Race results',
                url: 'https://www.mtbuller.com.au/winter/on-the-mountain/ski-race'
            }
        ];
        const days = [
            {
                d: 'Tue',
                n: '5',
                hi: '−2',
                lo: '−8',
                sn: '12',
                icon: 'cloud-snow'
            },
            {
                d: 'Wed',
                n: '6',
                hi: '0',
                lo: '−6',
                sn: '4',
                icon: 'cloud-snow'
            },
            {
                d: 'Thu',
                n: '7',
                hi: '2',
                lo: '−4',
                sn: '0',
                icon: 'sun'
            },
            {
                d: 'Fri',
                n: '8',
                hi: '−1',
                lo: '−7',
                sn: '8',
                icon: 'cloud-snow'
            },
            {
                d: 'Sat',
                n: '9',
                hi: '−3',
                lo: '−10',
                sn: '22',
                icon: 'snow'
            },
            {
                d: 'Sun',
                n: '10',
                hi: '−4',
                lo: '−11',
                sn: '18',
                icon: 'snow'
            },
            {
                d: 'Mon',
                n: '11',
                hi: '−2',
                lo: '−9',
                sn: '6',
                icon: 'cloud-snow'
            }
        ];
        return /*#__PURE__*/ React.createElement("main", null, /*#__PURE__*/ React.createElement("section", {
            className: "page-header"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "page-header-bg"
        }, /*#__PURE__*/ React.createElement("video", {
            autoPlay: true,
            muted: true,
            loop: true,
            playsInline: true,
            poster: "assets/photo-blue-sky-resort.webp",
            style: {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                inset: 0,
                zIndex: -2
            }
        }, /*#__PURE__*/ React.createElement("source", {
            src: "assets/hero2-opt.mp4",
            type: "video/mp4"
        })), /*#__PURE__*/ React.createElement("div", {
            className: "page-header-overlay"
        })), /*#__PURE__*/ React.createElement("div", {
            className: "container-wide page-header-inner"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "crumbs"
        }, /*#__PURE__*/ React.createElement("a", {
            href: "index.html"
        }, "Home"), /*#__PURE__*/ React.createElement("span", null, "/"), /*#__PURE__*/ React.createElement("span", null, "Mt Buller")), /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("span", {
            className: "eyebrow",
            style: {
                color: 'var(--brand-ice)'
            }
        }, "The mountain · Resort info"), /*#__PURE__*/ React.createElement("h1", {
            style: {
                marginTop: 14,
                color: '#fff'
            }
        }, "Mt Buller."), /*#__PURE__*/ React.createElement("p", {
            style: {
                fontFamily: 'var(--font-editorial)',
                fontStyle: 'italic',
                fontSize: 'var(--fs-24)',
                color: 'rgba(255,255,255,.75)',
                marginTop: 'var(--sp-5)'
            }
        }, "Everything you'll want bookmarked before you drive up.")))), /*#__PURE__*/ React.createElement(ConditionsStrip, null), /*#__PURE__*/ React.createElement("section", {
            className: "section"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide"
        }, /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("div", {
            className: "section-head"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "eyebrow"
        }, "7-day outlook"), /*#__PURE__*/ React.createElement("h2", {
            style: {
                marginTop: 14
            }
        }, "Snow & weather forecast"))), /*#__PURE__*/ React.createElement(R, {
            d: 1
        }, /*#__PURE__*/ React.createElement("div", {
            className: "forecast-grid"
        }, days.map((d, i)=>/*#__PURE__*/ React.createElement("div", {
                key: i,
                className: "forecast-card"
            }, /*#__PURE__*/ React.createElement("div", {
                style: {
                    fontSize: 11,
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-soft)',
                    fontWeight: 700
                }
            }, d.d), /*#__PURE__*/ React.createElement("div", {
                style: {
                    fontFamily: 'var(--font-display)',
                    fontWeight: 500,
                    fontSize: 22,
                    margin: '4px 0'
                }
            }, d.n), /*#__PURE__*/ React.createElement("div", {
                style: {
                    margin: '12px 0',
                    color: 'var(--brand-glacier)'
                }
            }, /*#__PURE__*/ React.createElement(Icon, {
                name: d.icon,
                size: 28,
                stroke: 1.4
            })), /*#__PURE__*/ React.createElement("div", {
                style: {
                    fontSize: 14,
                    fontWeight: 600
                }
            }, d.hi, "° / ", /*#__PURE__*/ React.createElement("span", {
                className: "muted"
            }, d.lo, "°")), /*#__PURE__*/ React.createElement("div", {
                style: {
                    fontSize: 12,
                    color: 'var(--ink-muted)',
                    marginTop: 4
                }
            }, d.sn, " cm"))))))), /*#__PURE__*/ React.createElement("section", {
            className: "section section-tint"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide"
        }, /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("div", {
            className: "section-head",
            style: {
                marginBottom: 'var(--sp-8)'
            }
        }, /*#__PURE__*/ React.createElement("span", {
            className: "eyebrow"
        }, "Live from the mountain"), /*#__PURE__*/ React.createElement("h2", {
            style: {
                marginTop: 14
            }
        }, "Snow cams"), /*#__PURE__*/ React.createElement("p", {
            className: "lead muted"
        }, "Check current conditions on the slopes before you head up."))), /*#__PURE__*/ React.createElement(R, {
            d: 1
        }, /*#__PURE__*/ React.createElement("div", {
            className: "cam-embed"
        }, /*#__PURE__*/ React.createElement("iframe", {
            src: "https://www.youtube.com/embed/0OtVlfDj2w8?rel=0&modestbranding=1",
            title: "Mt Buller live snow cam",
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowFullScreen: true,
            loading: "lazy"
        }))), /*#__PURE__*/ React.createElement(R, {
            d: 2
        }, /*#__PURE__*/ React.createElement("div", {
            style: {
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: 'var(--sp-4)'
            }
        }, /*#__PURE__*/ React.createElement("a", {
            href: "https://www.mtbuller.com.au/winter/weather/web-cams",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "btn btn-ghost btn-sm"
        }, "More cams on mtbuller.com.au ", /*#__PURE__*/ React.createElement(Icon, {
            name: "external",
            size: 13
        })))))), /*#__PURE__*/ React.createElement("section", {
            className: "section"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide",
            style: {
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--sp-12)'
            }
        }, /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h2", null, "Contact numbers"), /*#__PURE__*/ React.createElement("p", {
            className: "muted",
            style: {
                maxWidth: '40ch',
                marginBottom: 'var(--sp-6)'
            }
        }, "The list members usually want when something needs sorting."), /*#__PURE__*/ React.createElement("div", {
            className: "contact-list"
        }, contacts.map(([n, v])=>/*#__PURE__*/ React.createElement("div", {
                key: n,
                className: "contact-item"
            }, /*#__PURE__*/ React.createElement("span", {
                dangerouslySetInnerHTML: {
                    __html: n
                }
            }), /*#__PURE__*/ React.createElement("span", {
                className: "val"
            }, v)))))), /*#__PURE__*/ React.createElement(R, {
            d: 1
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h2", null, "Useful links"), /*#__PURE__*/ React.createElement("p", {
            className: "muted",
            style: {
                maxWidth: '40ch',
                marginBottom: 'var(--sp-6)'
            }
        }, "Resort information, bookings and reports."), /*#__PURE__*/ React.createElement("div", {
            className: "link-list"
        }, links.map((l)=>/*#__PURE__*/ React.createElement("a", {
                key: l.label,
                href: l.url,
                target: "_blank",
                rel: "noopener noreferrer"
            }, /*#__PURE__*/ React.createElement("span", {
                dangerouslySetInnerHTML: {
                    __html: l.label
                }
            }), /*#__PURE__*/ React.createElement(Icon, {
                name: "arrow-up-right",
                size: 16
            })))))))), /*#__PURE__*/ React.createElement("section", {
            className: "section"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide"
        }, /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("div", {
            className: "section-head"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "eyebrow"
        }, "On the mountain this season"), /*#__PURE__*/ React.createElement("h2", {
            style: {
                marginTop: 14
            }
        }, "Events to plan around"))), /*#__PURE__*/ React.createElement("div", {
            className: "feat-grid"
        }, [
            {
                d: '14 Jun',
                t: 'Opening Weekend',
                s: "King of the Mountain race plus fireworks Saturday night."
            },
            {
                d: '12 Jul',
                t: "Buller Mardi Gras",
                s: "Costume parade down Bourke Street; lodge dinner pre-game."
            },
            {
                d: '23 Aug',
                t: "Telemark Festival",
                s: "Free-heel classes, demo skis, end-of-day at Kooroora."
            }
        ].map((e, i)=>/*#__PURE__*/ React.createElement(R, {
                key: e.t,
                d: i
            }, /*#__PURE__*/ React.createElement("div", {
                className: "feat"
            }, /*#__PURE__*/ React.createElement("span", {
                className: "chip",
                style: {
                    marginBottom: 'var(--sp-3)'
                }
            }, e.d), /*#__PURE__*/ React.createElement("h3", null, e.t), /*#__PURE__*/ React.createElement("p", null, e.s))))))), /*#__PURE__*/ React.createElement(MemberBand, null), /*#__PURE__*/ React.createElement(Footer, null));
    }
    /* ── NEWS PAGE ───────────────────────────────────────────── */ function NewsPage() {
        const [filter, setFilter] = useState('All');
        const tags = [
            'All',
            ...new Set(NEWS.map((p)=>p.tag))
        ];
        const visible = NEWS.slice(1).filter((p)=>filter === 'All' || p.tag === filter);
        return /*#__PURE__*/ React.createElement("main", null, /*#__PURE__*/ React.createElement("section", {
            className: "page-header"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "page-header-bg"
        }, /*#__PURE__*/ React.createElement(Pic, {
            src: "assets/photo-resort-crowd.jpg",
            alt: ""
        }), /*#__PURE__*/ React.createElement("div", {
            className: "page-header-overlay"
        })), /*#__PURE__*/ React.createElement("div", {
            className: "container-wide page-header-inner"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "crumbs"
        }, /*#__PURE__*/ React.createElement("a", {
            href: "index.html"
        }, "Home"), /*#__PURE__*/ React.createElement("span", null, "/"), /*#__PURE__*/ React.createElement("span", null, "News")), /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("span", {
            className: "eyebrow",
            style: {
                color: 'var(--brand-ice)'
            }
        }, "News, notices & used gear"), /*#__PURE__*/ React.createElement("h1", {
            style: {
                marginTop: 14,
                color: '#fff'
            }
        }, "From the lodge."), /*#__PURE__*/ React.createElement("p", {
            style: {
                fontFamily: 'var(--font-editorial)',
                fontStyle: 'italic',
                fontSize: 'var(--fs-24)',
                color: 'rgba(255,255,255,.75)',
                marginTop: 'var(--sp-5)',
                maxWidth: '56ch'
            }
        }, "Snow reports, season notices, working bee dates, and the occasional pair of skis going to a new home.")))), /*#__PURE__*/ React.createElement("section", {
            className: "section"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide"
        }, /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("article", {
            className: "news-featured",
            onClick: ()=>onNav('article', NEWS[0].id),
            style: {
                cursor: 'pointer'
            }
        }, /*#__PURE__*/ React.createElement(Photo, {
            tone: NEWS[0].tone,
            src: NEWS[0].src
        }), /*#__PURE__*/ React.createElement("div", {
            className: "news-featured-body"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "row",
            style: {
                marginBottom: 12
            }
        }, /*#__PURE__*/ React.createElement("span", {
            className: "chip"
        }, NEWS[0].tag), /*#__PURE__*/ React.createElement("span", {
            className: "muted",
            style: {
                fontSize: 13
            }
        }, NEWS[0].date, " · ", NEWS[0].read, " read")), /*#__PURE__*/ React.createElement("h2", null, NEWS[0].title), /*#__PURE__*/ React.createElement("p", {
            className: "lead"
        }, NEWS[0].excerpt), /*#__PURE__*/ React.createElement("div", {
            style: {
                marginTop: 'var(--sp-5)'
            }
        }, /*#__PURE__*/ React.createElement("span", {
            className: "btn btn-link"
        }, "Read the full report ", /*#__PURE__*/ React.createElement(Icon, {
            name: "arrow",
            size: 14
        })))))), /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("div", {
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
                key: p.id,
                d: i % 3
            }, /*#__PURE__*/ React.createElement("article", {
                className: "news-card",
                onClick: ()=>onNav('article', p.id),
                style: {
                    cursor: 'pointer'
                }
            }, /*#__PURE__*/ React.createElement(Photo, {
                tone: p.tone,
                src: p.src,
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
            }, p.tag), p.date), /*#__PURE__*/ React.createElement("h3", null, p.title), /*#__PURE__*/ React.createElement("p", null, p.excerpt), /*#__PURE__*/ React.createElement("span", {
                className: "more"
            }, "Read ", /*#__PURE__*/ React.createElement(Icon, {
                name: "arrow",
                size: 14
            }))))))))), /*#__PURE__*/ React.createElement(MemberBand, null), /*#__PURE__*/ React.createElement(Footer, null));
    }
    /* ── ARTICLE ─────────────────────────────────────────────── */ function ArticlePage() {
        const post = NEWS.find((p)=>p.id === ART_ID) || NEWS[0];
        return /*#__PURE__*/ React.createElement("main", null, /*#__PURE__*/ React.createElement("section", {
            className: "page-header"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "page-header-bg"
        }, /*#__PURE__*/ React.createElement(Pic, {
            src: post.src || 'assets/photo-mt-buller-peak.jpg',
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
        }, "News"), /*#__PURE__*/ React.createElement("span", null, "/"), /*#__PURE__*/ React.createElement("span", null, post.tag)), /*#__PURE__*/ React.createElement("div", {
            className: "article-wrap"
        }, /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("span", {
            className: "chip",
            style: {
                marginBottom: 14,
                background: 'rgba(255,255,255,.15)',
                color: '#fff'
            }
        }, post.tag), /*#__PURE__*/ React.createElement("h1", {
            style: {
                color: '#fff'
            }
        }, post.title), /*#__PURE__*/ React.createElement("div", {
            style: {
                color: 'rgba(255,255,255,.6)',
                fontSize: 14,
                marginTop: 'var(--sp-4)'
            }
        }, post.date, " · ", post.read, " read · By the Web Committee"))))), /*#__PURE__*/ React.createElement("section", {
            className: "section"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide article-wrap"
        }, post.body.map((para, i)=>/*#__PURE__*/ React.createElement(R, {
                key: i,
                d: i % 2
            }, /*#__PURE__*/ React.createElement("p", null, para))), /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("hr", {
            className: "divider"
        }), /*#__PURE__*/ React.createElement("div", {
            className: "row"
        }, /*#__PURE__*/ React.createElement("a", {
            className: "btn btn-ghost btn-sm",
            href: "news.html"
        }, "← Back to news"), /*#__PURE__*/ React.createElement("a", {
            className: "btn btn-primary btn-sm",
            href: "login.html"
        }, "Members' notices →"))))), /*#__PURE__*/ React.createElement(Footer, null));
    }
    /* ── ENQUIRIES ───────────────────────────────────────────── */ function EnquiriesPage() {
        const [done, setDone] = useState(false);
        const [form, setForm] = useState({
            name: '',
            email: '',
            phone: '',
            interest: 'membership',
            message: ''
        });
        return /*#__PURE__*/ React.createElement("main", null, /*#__PURE__*/ React.createElement("section", {
            className: "page-header"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "page-header-bg"
        }, /*#__PURE__*/ React.createElement(Pic, {
            src: "assets/photo-resort-crowd.jpg",
            alt: ""
        }), /*#__PURE__*/ React.createElement("div", {
            className: "page-header-overlay"
        })), /*#__PURE__*/ React.createElement("div", {
            className: "container-wide page-header-inner"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "crumbs"
        }, /*#__PURE__*/ React.createElement("a", {
            href: "index.html"
        }, "Home"), /*#__PURE__*/ React.createElement("span", null, "/"), /*#__PURE__*/ React.createElement("span", null, "Enquiries")), /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("span", {
            className: "eyebrow",
            style: {
                color: 'var(--brand-ice)'
            }
        }, "Get in touch"), /*#__PURE__*/ React.createElement("h1", {
            style: {
                marginTop: 14,
                color: '#fff'
            }
        }, "Say hello."), /*#__PURE__*/ React.createElement("p", {
            style: {
                fontFamily: 'var(--font-editorial)',
                fontStyle: 'italic',
                fontSize: 'var(--fs-24)',
                color: 'rgba(255,255,255,.75)',
                marginTop: 'var(--sp-5)',
                maxWidth: '56ch'
            }
        }, "Whether you're thinking about joining, after a group booking, or just have a question — drop us a line.")))), /*#__PURE__*/ React.createElement("section", {
            className: "section"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide enquire-grid"
        }, /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h2", {
            style: {
                fontSize: 'var(--fs-32)'
            }
        }, "How membership works"), /*#__PURE__*/ React.createElement("p", {
            className: "muted"
        }, "Mitre is a small, member-run club. New memberships open when existing members move on."), /*#__PURE__*/ React.createElement("ol", {
            className: "muted",
            style: {
                paddingLeft: '1.2em',
                lineHeight: 1.8,
                marginTop: 'var(--sp-5)'
            }
        }, /*#__PURE__*/ React.createElement("li", null, /*#__PURE__*/ React.createElement("b", {
            style: {
                color: 'var(--ink)'
            }
        }, "Get in touch."), " Use the form, or email the secretary."), /*#__PURE__*/ React.createElement("li", null, /*#__PURE__*/ React.createElement("b", {
            style: {
                color: 'var(--ink)'
            }
        }, "Visit the lodge."), " Stay a weekend or two as a member's guest."), /*#__PURE__*/ React.createElement("li", null, /*#__PURE__*/ React.createElement("b", {
            style: {
                color: 'var(--ink)'
            }
        }, "Submit a nomination."), " A current member proposes; another seconds."), /*#__PURE__*/ React.createElement("li", null, /*#__PURE__*/ React.createElement("b", {
            style: {
                color: 'var(--ink)'
            }
        }, "Committee review."), " Decisions are made monthly during winter.")), /*#__PURE__*/ React.createElement("hr", {
            className: "divider"
        }), /*#__PURE__*/ React.createElement("h3", null, "Direct contacts"), /*#__PURE__*/ React.createElement("div", {
            className: "contact-list",
            style: {
                marginTop: 'var(--sp-4)'
            }
        }, [
            [
                'Secretary',
                'secretary@mitreskiclub.com'
            ],
            [
                'Bookings',
                'bookings@mitreskiclub.com'
            ],
            [
                'President',
                'president@mitreskiclub.com'
            ],
            [
                'Treasurer',
                'treasurer@mitreskiclub.com'
            ]
        ].map(([n, v])=>/*#__PURE__*/ React.createElement("div", {
                key: n,
                className: "contact-item"
            }, /*#__PURE__*/ React.createElement("span", null, n), /*#__PURE__*/ React.createElement("span", {
                className: "val"
            }, v)))))), /*#__PURE__*/ React.createElement(R, {
            d: 1
        }, /*#__PURE__*/ React.createElement("div", {
            className: "form-card"
        }, done ? /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
            className: "form-success"
        }, /*#__PURE__*/ React.createElement(Icon, {
            name: "check",
            size: 20
        }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("b", null, "Thanks — your message is on its way."), /*#__PURE__*/ React.createElement("br", null), "We'll be in touch within a week.")), /*#__PURE__*/ React.createElement("button", {
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
                    interest: 'membership',
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
        }, "Send us a note"), /*#__PURE__*/ React.createElement("p", {
            className: "muted",
            style: {
                margin: 0,
                fontSize: 14
            }
        }, "* required"), /*#__PURE__*/ React.createElement("div", {
            className: "form-row-2"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "field"
        }, /*#__PURE__*/ React.createElement("label", null, "First name *"), /*#__PURE__*/ React.createElement("input", {
            className: "input",
            required: true,
            value: form.name,
            onChange: (e)=>setForm({
                    ...form,
                    name: e.target.value
                })
        })), /*#__PURE__*/ React.createElement("div", {
            className: "field"
        }, /*#__PURE__*/ React.createElement("label", null, "Last name *"), /*#__PURE__*/ React.createElement("input", {
            className: "input",
            required: true
        }))), /*#__PURE__*/ React.createElement("div", {
            className: "form-row-2"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "field"
        }, /*#__PURE__*/ React.createElement("label", null, "Email *"), /*#__PURE__*/ React.createElement("input", {
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
        }, /*#__PURE__*/ React.createElement("label", null, "Phone"), /*#__PURE__*/ React.createElement("input", {
            className: "input",
            type: "tel",
            value: form.phone,
            onChange: (e)=>setForm({
                    ...form,
                    phone: e.target.value
                })
        }))), /*#__PURE__*/ React.createElement("div", {
            className: "field"
        }, /*#__PURE__*/ React.createElement("label", null, "What's this about?"), /*#__PURE__*/ React.createElement("select", {
            className: "select",
            value: form.interest,
            onChange: (e)=>setForm({
                    ...form,
                    interest: e.target.value
                })
        }, /*#__PURE__*/ React.createElement("option", {
            value: "membership"
        }, "Becoming a member"), /*#__PURE__*/ React.createElement("option", {
            value: "guest"
        }, "Staying as a member's guest"), /*#__PURE__*/ React.createElement("option", {
            value: "group"
        }, "Group booking (off-season)"), /*#__PURE__*/ React.createElement("option", {
            value: "other"
        }, "Something else"))), /*#__PURE__*/ React.createElement("div", {
            className: "field"
        }, /*#__PURE__*/ React.createElement("label", null, "Your message *"), /*#__PURE__*/ React.createElement("textarea", {
            className: "textarea",
            required: true,
            placeholder: "A short note about what you're after, your skiing/snowboarding history, or who put you onto Mitre…",
            value: form.message,
            onChange: (e)=>setForm({
                    ...form,
                    message: e.target.value
                })
        })), /*#__PURE__*/ React.createElement("label", {
            className: "checkbox",
            style: {
                fontSize: 14
            }
        }, /*#__PURE__*/ React.createElement("input", {
            type: "checkbox",
            required: true
        }), " I'm happy for the committee to contact me."), /*#__PURE__*/ React.createElement("button", {
            type: "submit",
            className: "btn btn-cta btn-lg",
            style: {
                alignSelf: 'flex-start',
                marginTop: 'var(--sp-2)'
            }
        }, "Send enquiry ", /*#__PURE__*/ React.createElement("span", {
            className: "arrow"
        }, "→"))))))), /*#__PURE__*/ React.createElement(Footer, null));
    }
    /* ── LOGIN ───────────────────────────────────────────────── */ function LoginPage() {
        const [done, setDone] = useState(false);
        return /*#__PURE__*/ React.createElement("main", null, /*#__PURE__*/ React.createElement("div", {
            className: "login-shell"
        }, /*#__PURE__*/ React.createElement("aside", {
            className: "login-art"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "login-art-media"
        }, /*#__PURE__*/ React.createElement(Pic, {
            src: "assets/photo-resort-crowd.jpg",
            alt: "Mt Buller resort",
            style: {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                inset: 0
            },
            priority: true
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
        }, "Welcome back", /*#__PURE__*/ React.createElement("br", null), /*#__PURE__*/ React.createElement("em", null, "to the mountain.")), /*#__PURE__*/ React.createElement("p", {
            style: {
                color: 'var(--snow-300)',
                marginTop: 'var(--sp-5)',
                maxWidth: '32ch',
                fontSize: 16,
                lineHeight: 1.6
            }
        }, "Bookings, season dates, members' notices and used-gear listings — all yours.")), /*#__PURE__*/ React.createElement("div", {
            style: {
                position: 'relative',
                zIndex: 1
            }
        }, /*#__PURE__*/ React.createElement("div", {
            className: "login-art-quote-block"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "login-art-quote"
        }, '"Last lodge on the Avenue. Ski straight in off Standard."'), /*#__PURE__*/ React.createElement("span", {
            style: {
                color: 'var(--snow-500)',
                marginTop: 10,
                fontSize: 12,
                display: 'block',
                letterSpacing: '.08em',
                textTransform: 'uppercase'
            }
        }, "— Mitre Ski Club, est. 1962")))), /*#__PURE__*/ React.createElement("section", {
            className: "login-form-wrap"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "login-form"
        }, /*#__PURE__*/ React.createElement("a", {
            className: "login-form-back",
            href: "index.html"
        }, "← Back to mitreskiclub.com"), /*#__PURE__*/ React.createElement("span", {
            className: "eyebrow"
        }, "Members"), /*#__PURE__*/ React.createElement("h1", {
            style: {
                marginTop: 12
            }
        }, "Log in to bookings."), /*#__PURE__*/ React.createElement("p", {
            className: "small"
        }, "Use the email you registered with the club. ", /*#__PURE__*/ React.createElement("a", {
            href: "#",
            style: {
                color: 'var(--brand-deep)',
                borderBottom: '1px solid currentColor'
            }
        }, "Forgotten your password?")), done && /*#__PURE__*/ React.createElement("div", {
            className: "form-success"
        }, /*#__PURE__*/ React.createElement(Icon, {
            name: "check",
            size: 18
        }), /*#__PURE__*/ React.createElement("div", null, "Sending you to bookings.mitreskiclub.com…")), /*#__PURE__*/ React.createElement("form", {
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
        }, /*#__PURE__*/ React.createElement("label", null, "Email address"), /*#__PURE__*/ React.createElement("input", {
            className: "input",
            type: "email",
            required: true
        })), /*#__PURE__*/ React.createElement("div", {
            className: "field"
        }, /*#__PURE__*/ React.createElement("label", null, "Password"), /*#__PURE__*/ React.createElement("input", {
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
        }), " Log in ", /*#__PURE__*/ React.createElement("span", {
            className: "arrow"
        }, "→"))), /*#__PURE__*/ React.createElement("hr", {
            className: "divider",
            style: {
                margin: 'var(--sp-8) 0'
            }
        }), /*#__PURE__*/ React.createElement("p", {
            className: "small"
        }, "Not a member? ", /*#__PURE__*/ React.createElement("a", {
            href: "enquiries.html",
            style: {
                color: 'var(--brand-deep)',
                borderBottom: '1px solid currentColor'
            }
        }, "Enquire about joining →"))))));
    }
    /* ── GALLERY ─────────────────────────────────────────────── */ const GALLERY_ITEMS = [
        {
            src: 'assets/photo-resort-crowd.jpg',
            caption: 'Opening weekend 2024',
            sub: 'Lodge crew',
            cat: 'lodge'
        },
        {
            src: 'assets/photo-chairlift-golden.jpg',
            caption: 'Golden hour on the lift',
            sub: 'July 2025',
            cat: 'mountain'
        },
        {
            src: 'assets/photo-snowboarder-pov.jpg',
            caption: "Powder day POV",
            sub: 'First light off Standard',
            cat: 'mountain'
        },
        {
            src: 'assets/photo-blue-sky-resort.jpg',
            caption: 'Perfect blue sky',
            sub: 'Summit view, 2023',
            cat: 'mountain'
        },
        {
            src: 'assets/photo-mt-buller-peak.jpg',
            caption: 'Above the clouds',
            sub: 'Mt Buller peak',
            cat: 'mountain'
        },
        {
            src: 'assets/photo-resort-crowd.jpg',
            caption: 'Working bee weekend',
            sub: 'May 2024 — all hands',
            cat: 'bee'
        },
        {
            src: 'assets/photo-chairlift-golden.jpg',
            caption: 'Pre-dinner drinks',
            sub: 'Lodge lounge, 2024',
            cat: 'lodge'
        },
        {
            src: 'assets/photo-blue-sky-resort.jpg',
            caption: 'Sunday departure run',
            sub: "Last turns of the trip",
            cat: 'mountain'
        },
        {
            src: 'assets/photo-snowboarder-pov.jpg',
            caption: "Mitre crew out early",
            sub: 'Bourke St, 7am',
            cat: 'mountain'
        },
        {
            src: 'assets/photo-mt-buller-peak.jpg',
            caption: 'Summer mountain bike trip',
            sub: 'March 2025',
            cat: 'summer'
        },
        {
            src: 'assets/photo-resort-crowd.jpg',
            caption: 'AGM dinner at the lodge',
            sub: 'June 2025',
            cat: 'lodge'
        },
        {
            src: 'assets/photo-chairlift-golden.jpg',
            caption: 'New members weekend',
            sub: 'September 2024',
            cat: 'lodge'
        }
    ];
    const GALLERY_CATS = [
        [
            'all',
            'All photos'
        ],
        [
            'mountain',
            'On the mountain'
        ],
        [
            'lodge',
            'Lodge life'
        ],
        [
            'bee',
            'Working bees'
        ],
        [
            'summer',
            'Off-season'
        ]
    ];
    function GalleryPage() {
        const [cat, setCat] = useState('all');
        const visible = GALLERY_ITEMS.filter((g)=>cat === 'all' || g.cat === cat);
        return /*#__PURE__*/ React.createElement("main", null, /*#__PURE__*/ React.createElement("section", {
            className: "page-header"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "page-header-bg"
        }, /*#__PURE__*/ React.createElement(Pic, {
            src: "assets/photo-resort-crowd.jpg",
            alt: ""
        }), /*#__PURE__*/ React.createElement("div", {
            className: "page-header-overlay"
        })), /*#__PURE__*/ React.createElement("div", {
            className: "container-wide page-header-inner"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "crumbs"
        }, /*#__PURE__*/ React.createElement("a", {
            href: "index.html"
        }, "Home"), /*#__PURE__*/ React.createElement("span", null, "/"), /*#__PURE__*/ React.createElement("span", null, "Gallery")), /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("span", {
            className: "eyebrow",
            style: {
                color: 'var(--brand-ice)'
            }
        }, "Members' gallery"), /*#__PURE__*/ React.createElement("h1", {
            style: {
                marginTop: 14,
                color: '#fff'
            }
        }, "Sixty winters of moments."), /*#__PURE__*/ React.createElement("p", {
            style: {
                fontFamily: 'var(--font-editorial)',
                fontStyle: 'italic',
                fontSize: 'var(--fs-24)',
                color: 'rgba(255,255,255,.75)',
                marginTop: 'var(--sp-5)',
                maxWidth: '56ch'
            }
        }, "Powder days, working bees, golden hours and the last ski of the season.")))), /*#__PURE__*/ React.createElement("section", {
            className: "section"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "gallery-filters"
        }, GALLERY_CATS.map(([id, lbl])=>/*#__PURE__*/ React.createElement("button", {
                key: id,
                className: 'btn btn-sm ' + (cat === id ? 'btn-primary' : 'btn-ghost'),
                onClick: ()=>setCat(id)
            }, lbl))), /*#__PURE__*/ React.createElement("div", {
            className: "gallery-grid"
        }, visible.map((g, i)=>/*#__PURE__*/ React.createElement(R, {
                key: i,
                d: i % 3
            }, /*#__PURE__*/ React.createElement("div", {
                className: "gallery-item"
            }, /*#__PURE__*/ React.createElement("img", {
                src: g.src,
                alt: g.caption,
                loading: "lazy"
            }), /*#__PURE__*/ React.createElement("div", {
                className: "gallery-caption"
            }, /*#__PURE__*/ React.createElement("span", null, g.caption), /*#__PURE__*/ React.createElement("small", null, g.sub)))))), /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("div", {
            className: "gallery-insta-cta"
        }, /*#__PURE__*/ React.createElement("div", {
            style: {
                fontSize: 32,
                marginBottom: 'var(--sp-3)'
            }
        }, "📸"), /*#__PURE__*/ React.createElement("h3", null, "Follow us on Instagram"), /*#__PURE__*/ React.createElement("p", {
            style: {
                color: 'rgba(255,255,255,.8)',
                margin: '0 auto var(--sp-6)',
                maxWidth: '44ch'
            }
        }, "Members sharing the season in real time — powder alerts, working bee photos, and the occasional après ski."), /*#__PURE__*/ React.createElement("a", {
            href: "https://www.instagram.com/mitreskiclub/",
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
        }), " @mitreskiclub"), /*#__PURE__*/ React.createElement("p", {
            style: {
                color: 'rgba(255,255,255,.5)',
                marginTop: 'var(--sp-4)',
                fontSize: 13
            }
        }, "Got photos from Mitre? Send them to ", /*#__PURE__*/ React.createElement("a", {
            href: "mailto:secretary@mitreskiclub.com",
            style: {
                color: 'rgba(255,255,255,.7)'
            }
        }, "secretary@mitreskiclub.com"), " to be featured."))))), /*#__PURE__*/ React.createElement(Footer, null));
    }
    /* ── SHOP ────────────────────────────────────────────────── */ const GEAR = [
        {
            id: 'volkl-mantra',
            title: "Volkl Mantra M6",
            type: 'Skis',
            size: '172 cm',
            price: 380,
            status: 'available',
            seller: 'Tim B.',
            posted: '2 days ago',
            tone: 'glacier',
            src: 'assets/photo-chairlift-golden.jpg',
            desc: "2022 season, excellent condition. One edge repair near tip, otherwise clean. Marker bindings not included."
        },
        {
            id: 'arcteryx-sabre',
            title: "Arc'teryx Sabre LT Shell",
            type: 'Jacket',
            size: 'Medium',
            price: 450,
            status: 'available',
            seller: 'Sarah K.',
            posted: '5 days ago',
            tone: 'deep',
            src: 'assets/photo-snowboarder-pov.jpg',
            desc: "Worn one season. Gore-Tex, all seams intact, no damage. Navy blue. DWR treatment still active."
        },
        {
            id: 'salomon-qst-kids',
            title: "Salomon QST Jr. (pair)",
            type: 'Kids skis',
            size: '130 cm',
            price: 120,
            status: 'available',
            seller: 'The Hendersons',
            posted: '1 week ago',
            tone: 'sky',
            src: 'assets/photo-blue-sky-resort.jpg',
            desc: "Two seasons' use by a 9-year-old. Edges good, no major base damage. Bindings set for 23 BSL."
        },
        {
            id: 'nordica-strider',
            title: "Nordica Strider 130",
            type: 'Boots',
            size: '27.5 (EU 42)',
            price: 160,
            status: 'reserved',
            seller: 'Marcus W.',
            posted: '3 days ago',
            tone: 'sunset',
            src: 'assets/photo-resort-crowd.jpg',
            desc: "One full season. Soles in great shape, liner fresh. Stiff enough for advanced skiing, walkable sole."
        },
        {
            id: 'smith-vantage',
            title: "Smith Vantage MIPS",
            type: 'Helmet',
            size: 'Medium (55–59 cm)',
            price: 180,
            status: 'available',
            seller: 'Priya S.',
            posted: '4 days ago',
            tone: 'morning',
            src: 'assets/photo-mt-buller-peak.jpg',
            desc: "2023 model, two seasons' use, no impact. All vents working, MIPS liner clean and intact. Matte black."
        },
        {
            id: 'dynastar-legend',
            title: "Dynastar Legend 88 W",
            type: 'Skis',
            size: '164 cm',
            price: 290,
            status: 'sold',
            seller: 'Anna R.',
            posted: '2 weeks ago',
            tone: 'glacier',
            src: 'assets/photo-chairlift-golden.jpg',
            desc: "Three seasons' use. Solid all-mountain ski, good edge hold. Selling because I moved up to a wider waist."
        }
    ];
    const GEAR_CATS = [
        'All',
        'Skis',
        'Boots',
        'Jacket',
        'Helmet',
        'Kids skis'
    ];
    function ShopPage() {
        const [cat, setCat] = useState('All');
        const visible = GEAR.filter((g)=>cat === 'All' || g.type === cat);
        return /*#__PURE__*/ React.createElement("main", null, /*#__PURE__*/ React.createElement("section", {
            className: "page-header"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "page-header-bg"
        }, /*#__PURE__*/ React.createElement(Pic, {
            src: "assets/photo-snowboarder-pov.jpg",
            alt: ""
        }), /*#__PURE__*/ React.createElement("div", {
            className: "page-header-overlay"
        })), /*#__PURE__*/ React.createElement("div", {
            className: "container-wide page-header-inner"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "crumbs"
        }, /*#__PURE__*/ React.createElement("a", {
            href: "index.html"
        }, "Home"), /*#__PURE__*/ React.createElement("span", null, "/"), /*#__PURE__*/ React.createElement("span", null, "Used gear shop")), /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("span", {
            className: "eyebrow",
            style: {
                color: 'var(--brand-ice)'
            }
        }, "Members' classifieds"), /*#__PURE__*/ React.createElement("h1", {
            style: {
                marginTop: 14,
                color: '#fff'
            }
        }, "Used ski gear."), /*#__PURE__*/ React.createElement("p", {
            style: {
                fontFamily: 'var(--font-editorial)',
                fontStyle: 'italic',
                fontSize: 'var(--fs-24)',
                color: 'rgba(255,255,255,.75)',
                marginTop: 'var(--sp-5)',
                maxWidth: '56ch'
            }
        }, "Skis, boots, jackets and helmets from fellow members. Good gear, fair prices.")))), /*#__PURE__*/ React.createElement("section", {
            className: "section"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide"
        }, /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("div", {
            className: "shop-notice"
        }, /*#__PURE__*/ React.createElement(Icon, {
            name: "info",
            size: 18,
            stroke: 2
        }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("b", null, "Members-only listings."), " Contact the seller directly using the details in the member portal. To list your own gear, email ", /*#__PURE__*/ React.createElement("a", {
            href: "mailto:secretary@mitreskiclub.com"
        }, "secretary@mitreskiclub.com"), " with photos, price and description. All sales are between members — the club takes no commission."))), /*#__PURE__*/ React.createElement("div", {
            className: "gear-filters"
        }, GEAR_CATS.map((c)=>/*#__PURE__*/ React.createElement("button", {
                key: c,
                className: 'btn btn-sm ' + (cat === c ? 'btn-primary' : 'btn-ghost'),
                onClick: ()=>setCat(c)
            }, c))), /*#__PURE__*/ React.createElement("div", {
            className: "gear-grid"
        }, visible.map((g, i)=>/*#__PURE__*/ React.createElement(R, {
                key: g.id,
                d: i % 3
            }, /*#__PURE__*/ React.createElement("div", {
                className: "gear-card"
            }, /*#__PURE__*/ React.createElement("div", {
                className: "gear-img"
            }, /*#__PURE__*/ React.createElement(Photo, {
                src: g.src,
                ratio: "4/3",
                tone: g.tone,
                label: g.type
            }), /*#__PURE__*/ React.createElement("span", {
                className: 'gear-badge ' + (g.status === 'sold' ? 'sold' : g.status === 'reserved' ? 'reserved' : '')
            }, g.status === 'available' ? g.type : g.status)), /*#__PURE__*/ React.createElement("div", {
                className: "gear-body"
            }, /*#__PURE__*/ React.createElement("h3", null, g.title), /*#__PURE__*/ React.createElement("div", {
                className: "gear-size"
            }, g.size), /*#__PURE__*/ React.createElement("p", {
                className: "gear-desc"
            }, g.desc), /*#__PURE__*/ React.createElement("div", {
                className: "gear-seller"
            }, /*#__PURE__*/ React.createElement(Icon, {
                name: "users",
                size: 13
            }), g.seller, " · ", g.posted), /*#__PURE__*/ React.createElement("div", {
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
                href: "login.html",
                style: {
                    flex: 1
                }
            }, /*#__PURE__*/ React.createElement(Icon, {
                name: "lock",
                size: 13
            }), " Contact seller")))))))), /*#__PURE__*/ React.createElement(MemberBand, null), /*#__PURE__*/ React.createElement(Footer, null));
    }
    /* ── DIRECTIONS ──────────────────────────────────────────── */ function DirectionsPage() {
        const [tab, setTab] = useState('car');
        const carSteps = [
            {
                n: 1,
                title: 'Leave Melbourne via the Hume Freeway',
                body: "Head northeast on the Hume Freeway (M31). Take the Seymour exit and continue towards Mansfield on the Maroondah Highway."
            },
            {
                n: 2,
                title: 'Through Mansfield — chains available here',
                body: "Mansfield is 190 km from Melbourne CBD (about 2.5 hrs). Hire or buy snow chains at any of the service stations or gear shops on the main street. Chains must be carried from the gate."
            },
            {
                n: 3,
                title: 'Pay resort entry at the Merrijig gate',
                body: "The entry gate is at Merrijig, 9 km before the village. Staff will collect resort entry fees. Keep your receipt — you'll need it for parking."
            },
            {
                n: 4,
                title: 'Drive to the top — follow signs to The Avenue',
                body: "Drive up the mountain road (about 16 km, allow 30–40 min in ski season). At the top, follow signs to The Avenue. Mitre is the last lodge — number 14."
            },
            {
                n: 5,
                title: 'Park in the designated guest parking area',
                body: "There is allocated parking behind the lodge. The lodge number is 14 The Avenue. Ring the bell or use the code from your booking confirmation."
            }
        ];
        const busSteps = [
            {
                n: 1,
                title: 'Book the Mansfield–Mt Buller bus',
                body: "The Mansfield–Mt Buller Snowball Express bus runs daily during ski season from the Mansfield Bus Terminal. Bookings via Mount Buller Resort Management: (03) 5777 6077."
            },
            {
                n: 2,
                title: 'Take the train to Seymour or Shepparton',
                body: "V/Line trains run from Southern Cross Station to Seymour (1.5 hrs). From Seymour you can connect to the coach service to Mansfield."
            },
            {
                n: 3,
                title: 'Coach from Mansfield to Mt Buller',
                body: "The resort bus drops passengers at the village plaza. From there, the oversnow taxi service (03) 5777 6070 runs to all lodge addresses. Tell the driver 14 The Avenue."
            }
        ];
        const steps = tab === 'car' ? carSteps : busSteps;
        const links = [
            {
                icon: 'external',
                title: 'Mt Buller resort entry',
                sub: 'Fees, permits & conditions',
                url: 'https://www.mtbuller.com.au/winter/plan-your-trip/getting-here'
            },
            {
                icon: 'external',
                title: 'Oversnow taxi service',
                sub: 'Book: (03) 5777 6070',
                url: 'tel:0357776070'
            },
            {
                icon: 'map-pin',
                title: 'Google Maps',
                sub: '14 The Avenue, Mt Buller VIC',
                url: 'https://www.google.com/maps/place/Mitre+Ski+Club/data=!4m2!3m1!1s0x0:0xf93f066352e269fc?sa=X&ved=1t:2428&ictx=111'
            },
            {
                icon: 'external',
                title: 'VicRoads traffic info',
                sub: 'Road conditions & alerts',
                url: 'https://traffic.vicroads.vic.gov.au/'
            },
            {
                icon: 'external',
                title: 'Snow chains info',
                sub: 'When & how to fit chains',
                url: 'https://www.mtbuller.com.au/winter/plan-your-trip/getting-here#chains'
            },
            {
                icon: 'external',
                title: 'V/Line trains',
                sub: 'Melbourne → Seymour / Shepparton',
                url: 'https://www.vline.com.au/'
            }
        ];
        return /*#__PURE__*/ React.createElement("main", null, /*#__PURE__*/ React.createElement("section", {
            className: "page-header"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "page-header-bg"
        }, /*#__PURE__*/ React.createElement(Pic, {
            src: "assets/photo-mt-buller-peak.jpg",
            alt: "Mt Buller"
        }), /*#__PURE__*/ React.createElement("div", {
            className: "page-header-overlay"
        })), /*#__PURE__*/ React.createElement("div", {
            className: "container-wide page-header-inner"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "crumbs"
        }, /*#__PURE__*/ React.createElement("a", {
            href: "index.html"
        }, "Home"), /*#__PURE__*/ React.createElement("span", null, "/"), /*#__PURE__*/ React.createElement("span", null, "Directions")), /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("span", {
            className: "eyebrow",
            style: {
                color: 'var(--brand-ice)'
            }
        }, "Getting here"), /*#__PURE__*/ React.createElement("h1", {
            style: {
                marginTop: 14,
                color: '#fff'
            }
        }, "Find us on the mountain."), /*#__PURE__*/ React.createElement("p", {
            style: {
                fontFamily: 'var(--font-editorial)',
                fontStyle: 'italic',
                fontSize: 'var(--fs-24)',
                color: 'rgba(255,255,255,.75)',
                marginTop: 'var(--sp-5)',
                maxWidth: '56ch'
            }
        }, "14 The Avenue, Mt Buller VIC 3723. Last lodge on the road.")))), /*#__PURE__*/ React.createElement("section", {
            className: "section"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "container-wide"
        }, /*#__PURE__*/ React.createElement(R, null, /*#__PURE__*/ React.createElement("div", {
            className: "map-embed"
        }, /*#__PURE__*/ React.createElement("iframe", {
            src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1561.2!2d146.4375!3d-37.1527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xf93f066352e269fc!2sMitre%20Ski%20Club!5e0!3m2!1sen!2sau!4v1",
            allowFullScreen: "",
            loading: "lazy",
            referrerPolicy: "no-referrer-when-downgrade",
            title: "Mitre Ski Club location"
        }))), /*#__PURE__*/ React.createElement("div", {
            className: "directions-grid"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h2", null, "Step-by-step directions"), /*#__PURE__*/ React.createElement("div", {
            className: "transport-tabs",
            style: {
                marginTop: 'var(--sp-5)'
            }
        }, /*#__PURE__*/ React.createElement("button", {
            className: 'transport-tab ' + (tab === 'car' ? 'active' : ''),
            onClick: ()=>setTab('car')
        }, /*#__PURE__*/ React.createElement(Icon, {
            name: "car",
            size: 15
        }), " By car"), /*#__PURE__*/ React.createElement("button", {
            className: 'transport-tab ' + (tab === 'bus' ? 'active' : ''),
            onClick: ()=>setTab('bus')
        }, /*#__PURE__*/ React.createElement(Icon, {
            name: "bus",
            size: 15
        }), " By bus / train")), steps.map((s)=>/*#__PURE__*/ React.createElement("div", {
                key: s.n,
                className: "dir-step"
            }, /*#__PURE__*/ React.createElement("div", {
                className: "dir-num"
            }, s.n), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", null, s.title), /*#__PURE__*/ React.createElement("p", null, s.body))))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h2", null, "Useful links"), /*#__PURE__*/ React.createElement("p", {
            className: "muted",
            style: {
                marginTop: 'var(--sp-3)',
                marginBottom: 'var(--sp-2)'
            }
        }, "Everything you need before heading up."), /*#__PURE__*/ React.createElement("div", {
            className: "useful-links-grid"
        }, links.map((l, i)=>/*#__PURE__*/ React.createElement(R, {
                key: i,
                d: i % 3
            }, /*#__PURE__*/ React.createElement("a", {
                href: l.url,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "useful-link-card"
            }, /*#__PURE__*/ React.createElement("div", {
                className: "icon-wrap"
            }, /*#__PURE__*/ React.createElement(Icon, {
                name: l.icon,
                size: 18
            })), /*#__PURE__*/ React.createElement("h4", null, l.title), /*#__PURE__*/ React.createElement("p", null, l.sub))))), /*#__PURE__*/ React.createElement("div", {
            style: {
                marginTop: 'var(--sp-10)',
                padding: 'var(--sp-6)',
                background: 'var(--bg-elev)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-lg)'
            }
        }, /*#__PURE__*/ React.createElement("h3", {
            style: {
                marginBottom: 'var(--sp-3)'
            }
        }, "Address"), /*#__PURE__*/ React.createElement("p", {
            style: {
                color: 'var(--ink-muted)',
                fontSize: 15,
                margin: 0,
                lineHeight: 1.8
            }
        }, "Mitre Ski Club", /*#__PURE__*/ React.createElement("br", null), "14 The Avenue", /*#__PURE__*/ React.createElement("br", null), "Mt Buller VIC 3723", /*#__PURE__*/ React.createElement("br", null), /*#__PURE__*/ React.createElement("br", null), "Lodge phone (winter only):", /*#__PURE__*/ React.createElement("br", null), /*#__PURE__*/ React.createElement("a", {
            href: "tel:0357776070",
            style: {
                color: 'var(--brand-deep)'
            }
        }, "Ask at resort reception"))))))), /*#__PURE__*/ React.createElement(Footer, null));
    }
    /* ── APP ─────────────────────────────────────────────────── */ function App() {
        const [theme, setTheme] = useState(()=>localStorage.getItem('mitre-theme') || 'light');
        useEffect(()=>{
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('mitre-theme', theme);
        }, [
            theme
        ]);
        const showNav = PAGE !== 'login';
        return /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(GlobalFX, null), showNav && /*#__PURE__*/ React.createElement(TopNav, {
            current: PAGE
        }), PAGE === 'home' && /*#__PURE__*/ React.createElement(HomePage, null), PAGE === 'lodge' && /*#__PURE__*/ React.createElement(LodgePage, null), PAGE === 'buller' && /*#__PURE__*/ React.createElement(BullerPage, null), PAGE === 'news' && /*#__PURE__*/ React.createElement(NewsPage, null), PAGE === 'article' && /*#__PURE__*/ React.createElement(ArticlePage, null), PAGE === 'enquiries' && /*#__PURE__*/ React.createElement(EnquiriesPage, null), PAGE === 'login' && /*#__PURE__*/ React.createElement(LoginPage, null), PAGE === 'gallery' && /*#__PURE__*/ React.createElement(GalleryPage, null), PAGE === 'shop' && /*#__PURE__*/ React.createElement(ShopPage, null), PAGE === 'directions' && /*#__PURE__*/ React.createElement(DirectionsPage, null), /*#__PURE__*/ React.createElement("div", {
            className: "theme-toggle"
        }, [
            'light',
            'dark'
        ].map((t)=>/*#__PURE__*/ React.createElement("button", {
                key: t,
                className: theme === t ? 'active' : '',
                onClick: ()=>setTheme(t)
            }, t.charAt(0).toUpperCase() + t.slice(1)))));
    }
    ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/ React.createElement(App, null));
});

