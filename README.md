# Shubham Logistic Services — Website

Static multi-page site (HTML5 + Bootstrap 5 + vanilla JS). No build step —
just upload the folder as-is to any static host (GitHub Pages, Netlify,
cPanel, etc.).

## Folder structure

```
/
├── index.html, about.html, services.html, industries.html,
│   why-us.html, branches.html, gallery.html, contact.html
├── assets/
│   ├── css/style.css        ← all styling (design tokens at the top as CSS vars)
│   ├── js/main.js           ← shared behaviour (nav, animations, forms, lightbox…)
│   ├── js/config.js         ← ONE line you need to edit (see below)
│   └── img/favicon.svg
├── google-apps-script/Code.gs   ← backend for the contact form
├── GOOGLE_SHEETS_SETUP.md       ← step-by-step guide for the above
└── README.md                    ← this file
```

## What's implemented

- **Fully responsive** layout (Bootstrap 5 grid + custom breakpoints) across
  desktop, tablet and mobile.
- **8 pages**: Home, About, Services, Industries, Why Us, Branches, Gallery, Contact.
- **Sticky nav** with active-page highlighting.
- **Preloader** on every page (fades out once the page has loaded).
- **Scroll-in animations** and **animated stat counters**.
- **Back-to-top** floating button on every page.
- **Floating WhatsApp button** with a quick-message popup and multiple office numbers.
- **Gallery lightbox** — click any tile to view it enlarged, with keyboard
  (arrow keys / Esc) and on-screen prev/next navigation.
- **Contact forms** (homepage + dedicated Contact page) with:
  - client-side validation (required fields + email format, inline error banner)
  - submission to **Google Sheets** via a Google Apps Script webhook
  - a success confirmation state
- **Embedded Google Maps** for all offices (Hyderabad HQ, Mumbai, Delhi NCR),
  switchable on the Contact page.
- **Favicon**, meta descriptions per page, semantic HTML, and social/contact
  links throughout.

## Before you go live

1. **Connect the contact form to Google Sheets** — see `GOOGLE_SHEETS_SETUP.md`.
   Until you do this, submissions still show a success message (so the demo
   works end-to-end) but nothing is stored anywhere — check your browser
   console for a warning reminding you this is still pending.
2. **Add real photos.** The gallery and hero sections currently use styled
   icon placeholders because no photos were supplied yet. Drop images into
   `assets/img/gallery/` and swap each `.gallery-placeholder-img` div's
   contents for an `<img src="..." alt="...">` tag — the lightbox will pick
   them up automatically.
3. **Add the real logo.** `assets/img/logo.png` is referenced in the navbar
   (it fails gracefully and hides itself if missing). Drop your logo file
   in at that path and it will appear automatically.
4. Double-check all phone numbers, emails and addresses in the footer and
   Contact page match your latest details.
