MITRE SKI CLUB — PREVIEW PACKAGE
=================================

This is a private, password-protected preview build for client review.

PASSWORD
--------
  mitre2026

Anyone visiting any page is redirected to gate.html until they enter
the password. Once entered correctly, access is remembered in the
browser (localStorage) so the gate doesn't reappear on subsequent
visits or page navigations.


HOW TO HOST IT
==============

The package is a static site — HTML, CSS, JS, images, and videos.
No server-side code, no database. Drop it onto any static host.

OPTION 1 — CLOUDFLARE PAGES (recommended, free)
-----------------------------------------------
1. Sign in at https://pages.cloudflare.com
2. Click "Create a project" → "Direct Upload"
3. Upload this whole folder (or the zip)
4. Cloudflare gives you a URL like
   https://mitre-preview.pages.dev
5. Share that URL + the password with the client.
   Custom domain optional (free).

OPTION 2 — NETLIFY DROP (free, fastest)
---------------------------------------
1. Go to https://app.netlify.com/drop
2. Drag this folder onto the page
3. Get a URL like https://magical-cat-1234.netlify.app
4. Share + password. Done in 30 seconds.

OPTION 3 — TIINY.HOST (free / $9 mo)
------------------------------------
1. Go to https://tiiny.host
2. Upload the zip
3. Get a shareable URL.

OPTION 4 — GODADDY / ANY APACHE HOST
------------------------------------
1. Open the GoDaddy File Manager (cPanel)
2. Upload all files into public_html (or a subfolder)
3. Visit your domain — the JS gate handles password protection.
   You don't need .htaccess for this.

OPTION 5 — LOCAL TESTING
------------------------
   python3 -m http.server 8000
   open http://localhost:8000/

   Or just double-click index.html (most browsers will redirect
   to gate.html automatically).


TO CHANGE THE PASSWORD
======================
The password is stored as a SHA-256 hash in:
  • gate.html             (line: var EXPECTED='...')
  • every .html file      (line: localStorage.getItem("mpa")!==...)

To change to a new password, generate the hash:

    echo -n "YOUR-NEW-PASSWORD" | shasum -a 256 | awk '{print $1}'

Then find/replace the old hash with the new one across all .html files.
The current hash is:
  da6457aa6e04b71db24a5c12770d77c7f2ee7072a5f9a8b2191dcf9478726269


SECURITY NOTES
==============
This is a CLIENT-SIDE password gate, suitable for "soft" preview
protection. It is NOT cryptographically secure — anyone who can
inspect JavaScript can bypass it. For a truly secure gate use:

  • Cloudflare Access (free, email-based authentication)
  • Netlify password protection (Pro plan)
  • .htaccess basic auth on Apache hosts

For a client feedback round, the JS gate is sufficient.


WHAT'S IN THIS PACKAGE
======================
HTML pages (10):       index, lodge, buller, news, article,
                       enquiries, login, gallery, shop, directions
Gate page:             gate.html (password form)
Stylesheet:            site.css
JavaScript:            dist/app.js (compiled React app)
Assets:                assets/  — videos (MP4), photos (WebP+JPG),
                       logo (SVG), favicons
Total size:            ~25 MB (videos + images dominate)


CONTACT
=======
Built by the Web Committee.
Send feedback to: secretary@mitreskiclub.com
