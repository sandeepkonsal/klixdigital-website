# Klix Digital — Website

Marketing website for Klix Digital, a full-service digital marketing agency (klixdigital.co.za).

## Stack

Static HTML/CSS/JS — no build step. Animations powered by [GSAP](https://gsap.com/) + ScrollTrigger. Fonts via Google Fonts (Space Grotesk + Inter).

## Structure

```
index.html          Home
about.html           About / team / values
services.html        SEO, Paid Media, Social, Web Design, Content, Branding, pricing, FAQ
work.html             Filterable case study grid
blog.html             Blog listing
blog/seo-2026.html    Sample article
contact.html          Contact form (Formspree) + info
404.html              Error page
css/style.css         Design system (tokens, layout, components)
js/main.js            Nav, mobile menu, custom cursor, magnetic buttons, scroll reveals,
                       counters, testimonial slider, FAQ accordion, work filter, form handling
assets/logo/          3 logo concepts (icon+wordmark, monogram, wordmark-only)
assets/favicon.svg
```

## Local development

No build tools needed. Serve the folder with any static server, e.g.:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Before going live

1. **Logo**: pick your preferred concept from `assets/logo/` and update the `<img>` references across all HTML files if you switch away from `logo-icon-wordmark.svg`.
2. **Contact form**: sign up at [Formspree](https://formspree.io) (free tier available), create a form, and replace `YOUR_FORM_ID` in `contact.html`'s form `action` attribute.
3. **Placeholder content**: team photos, client logos, case studies and testimonials in `about.html`, `index.html` and `work.html` are placeholders — swap in real clients/results once you have them.
4. **Real contact details**: replace the placeholder phone number and confirm the email address across all pages' footers and `contact.html`.

## Deploying to GitHub Pages with your domain

1. Push this repo to GitHub.
2. In the repo settings → Pages, set the source branch to `main` (root).
3. `CNAME` in this repo is already set to `klixdigital.co.za` — GitHub Pages will pick it up automatically.
4. At your domain registrar, add these DNS records:
   - `A` records for the apex domain (`klixdigital.co.za`) pointing to GitHub Pages' IPs:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - A `CNAME` record for `www` pointing to `<your-github-username>.github.io`
5. Wait for DNS propagation, then enable "Enforce HTTPS" in the Pages settings once the certificate is issued.
