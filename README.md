# The Job Tag Consultancy — Website

A static, multi-page website for The Job Tag Consultancy (recruitment agency, Rajkot). No build step, no dependencies — plain HTML/CSS/JS, ready for GitHub Pages.

## Pages
- `index.html` — Home
- `about.html` — About Us
- `services.html` — Services
- `jobs.html` — Job listings (with client-side category filter)
- `employers.html` — For Employers (hiring request form)
- `candidates.html` — For Candidates (resume submission form)
- `contact.html` — Contact (details, embedded map, contact form)

## Structure
```
/
├── index.html, about.html, services.html, jobs.html, employers.html, candidates.html, contact.html
├── css/style.css      → all styling (source copy, for editing)
├── js/script.js       → nav toggle, scroll reveal, job filter, form handling (source copy, for editing)
└── images/logo.png    → your logo (source copy, for editing)
```

**Note:** the `.html` files are self-contained — the CSS, JS, and logo are already inlined directly into each page (as `<style>`, `<script>`, and a base64 image), so every page works correctly on its own, with no dependency on the `css/`, `js/`, or `images/` folders. Those folders are kept purely as clean source copies for future editing — if you change `css/style.css` or `js/script.js`, you'll need to re-inline them into the HTML files (or ask Claude to do it) for the change to show up.

## Deploying to GitHub Pages

1. Create a new repository on GitHub (e.g. `job-tag-consultancy-website`) — or use your existing one.
2. Upload all the files in this folder to the repository, keeping the folder structure intact (`css/`, `js/`, `images/` as subfolders).
   - Easiest way: on the repo page, click **Add file → Upload files**, drag in everything, then **Commit changes**.
   - Or via git:
     ```bash
     git init
     git add .
     git commit -m "Initial website"
     git branch -M main
     git remote add origin https://github.com/<your-username>/<your-repo>.git
     git push -u origin main
     ```
3. In the repository, go to **Settings → Pages**.
4. Under **Source**, select **Deploy from a branch**, branch **main**, folder **/ (root)**. Save.
5. GitHub will give you a URL like `https://<your-username>.github.io/<your-repo>/` — it usually goes live within a minute or two.

## Using your own domain

Since you already own a domain:
1. In **Settings → Pages**, under **Custom domain**, enter your domain (e.g. `thejobtagconsultancy.com`) and save. GitHub will create a `CNAME` file in your repo automatically.
2. At your domain registrar (GoDaddy, Namecheap, etc.), add these DNS records:
   - For an apex domain (`thejobtagconsultancy.com`): four **A** records pointing to
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - For `www.thejobtagconsultancy.com`: a **CNAME** record pointing to `<your-username>.github.io`
3. Back in **Settings → Pages**, tick **Enforce HTTPS** once the certificate is issued (can take up to 24 hours).

## Updating job listings daily (Google Sheet — no code needed)

The Jobs page and the Home page preview both pull their listings live from a Google Sheet. Once set up, you never touch code again — just edit the sheet.

### One-time setup

1. Open Google Sheets and create a new sheet.
2. Import `jobs-template.csv` (included in this folder) to get the exact column headers you need: **File → Import → Upload → Replace current sheet**. Or just type these headers into row 1 yourself:
   ```
   title, location, type, industry, category, experience, salary, badge, active
   ```
3. Fill in one row per job opening. Notes on each column:
   - **category** must be one of: `sales`, `it`, `finance`, `hr`, `manufacturing`, `marketing`, `support`, `logistics`, `healthcare`, `education`, `legal`, `design` (these match the filter buttons on the Jobs page)
   - **badge** is optional — use `Urgent`, `Hybrid`, `Remote`, `Field`, or leave blank
   - **active** — set to `no` to hide a listing without deleting the row (leave blank or `yes` to show it)
4. Publish the sheet to the web as CSV: **File → Share → Publish to web** → choose your sheet/tab → format **Comma-separated values (.csv)** → **Publish**. Copy the link it gives you.
5. Open `js/script.js` in this project, find this line near the top:
   ```js
   const JOBS_SHEET_CSV_URL = "PASTE_YOUR_PUBLISHED_SHEET_CSV_LINK_HERE";
   ```
   and replace the placeholder with the link you copied.
6. Since the HTML files have the JS inlined for easy previewing, you'll also need to paste the same link into the matching line inside the `<script>` block at the bottom of **every** `.html` file (`index.html`, `jobs.html`, etc.) — or ask Claude to do this re-inlining for you after you send the sheet link.
7. Push the updated files to GitHub. Done — the site is now live-connected to your sheet.

### Daily updates (after setup)
Just open the Google Sheet and add, edit, or remove rows. Changes typically appear on the live site within seconds to a minute — no GitHub, no code, no redeploying.

### If the sheet isn't reachable
If the CSV link is missing or fails to load, the Jobs page will show a friendly fallback message instead of breaking, and the Home page preview will show a "View jobs page" link.

## Updating testimonials (Google Sheet — no code needed)

Same idea as job listings. The "What clients & candidates say" section on the Home page can pull from a Google Sheet.

### One-time setup
1. Create a new Google Sheet (or a new tab in your existing one) and import `testimonials-template.csv` to get the right columns, or type these headers into row 1 yourself:
   ```
   quote, name, title, active
   ```
2. Fill in one row per testimonial. `active` is optional — set to `no` to hide a quote without deleting it.
3. **File → Share → Publish to web** → choose the sheet/tab → format **CSV** → **Publish** → copy the link.
4. In `js/script.js`, find:
   ```js
   const TESTIMONIALS_SHEET_CSV_URL = "PASTE_YOUR_PUBLISHED_TESTIMONIALS_SHEET_CSV_LINK_HERE";
   ```
   and paste your link in place of the placeholder.
5. Paste the same link into the matching line inside the inlined `<script>` block in `index.html` (or ask Claude to do this re-inlining for you).
6. Push to GitHub. Done.

**Note:** until this is connected, the Home page shows the original 3 sample testimonials as a safe fallback — nothing breaks if you skip this setup.

### Daily updates (after setup)
Add, edit, or remove rows in the sheet — changes appear on the site automatically, no GitHub or code needed.

## SEO (structured data, social sharing, AI search visibility)

Every page now includes:
- **Canonical URL, Open Graph, and Twitter Card tags** — controls how links look when shared on WhatsApp, Facebook, LinkedIn, X/Twitter, etc.
- **Organization (EmploymentAgency) structured data** — a machine-readable summary of your business (name, address, phone, hours) that helps Google, Bing, and AI answer engines (ChatGPT, Perplexity, Google AI Overviews) understand and cite your business accurately.
- **FAQPage structured data** — matches the visible FAQ section on the Home page. Google and AI search tools frequently pull FAQ content directly into their answers, so this is one of the highest-leverage things for "AI search visibility."
- **JobPosting structured data** — automatically generated in the browser for whatever jobs are currently live in your Google Sheet, so job aggregators and Google for Jobs can pick up your listings without any manual work.
- **`robots.txt` and `sitemap.xml`** at the site root, pointing search engines to all 7 pages.

### After you go live, do these (can't be done until the domain is live):
1. Submit `https://thejobtag.com/sitemap.xml` in **Google Search Console** and **Bing Webmaster Tools**.
2. Set up and verify a **Google Business Profile** with the same name, address, and phone number as the site (matching NAP details helps local + AI search a lot).
3. Consider adding a **1200×630px social share image** (currently using the logo) — ask Claude to design one if you want a proper branded preview image for social links.

## Editing everything else
- Contact details (phone/email/address) appear in the footer of every page and on `contact.html` — search-and-replace across files if they change.
- Colors, fonts and spacing are all defined as CSS variables at the top of `css/style.css` under `:root`.
- All other text (About, Services, hero copy, etc.) is plain text inside each `.html` file — edit directly.

