// THE JOB TAG CONSULTANCY — shared behaviour

/* ==========================================================================
   CONFIG — paste your published Google Sheet CSV link here
   ========================================================================== */
const JOBS_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTsB_3FTdwl0iBE44T-8Z_h48IYlQq8fQp4XjHvm9A55qdJeWnlAG2sE9Jy3cv4SCs3kohdIdNHr58q/pub?gid=2133062683&single=true&output=csv";
const TESTIMONIALS_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSpLhTW-g3u-vRIKu74rPPMOY3GQh2B3WUMBATJP4Ylx2SdZFCjCp_ZDxeiQ9iZxbF_emzlY3Y1De09/pub?output=csv";
const WHATSAPP_NUMBER = "918128134433";

document.addEventListener('DOMContentLoaded', () => {

  /* mobile nav toggle */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
    }));
  }

  /* scroll reveal (re-run after dynamic content loads too, see initRevealFor below) */
  initRevealFor(document.querySelectorAll('.reveal'));

  /* generic form -> success message (static site, no backend) */
  document.querySelectorAll('form[data-static-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = form.parentElement.querySelector('.form-success') || form.querySelector('.form-success');
      if (success) {
        success.classList.add('is-visible');
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      form.reset();
    });
  });

  /* forms that submit via WhatsApp instead of a fake success message */
  document.querySelectorAll('form[data-whatsapp-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = form.dataset.whatsappForm;
      let waLink;
      if (type === 'candidate') waLink = buildCandidateWhatsAppLink(form);
      else if (type === 'contact') waLink = buildContactWhatsAppLink(form);
      else waLink = buildEmployerWhatsAppLink(form);
      window.open(waLink, '_blank', 'noopener');

      const success = form.parentElement.querySelector('.form-success') || form.querySelector('.form-success');
      if (success) {
        success.classList.add('is-visible');
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      form.reset();
    });
  });

  /* jobs page: load listings from Google Sheet */
  loadJobsFromSheet();

  /* homepage: load a preview of the latest 6 listings */
  loadFeaturedJobsOnHome();

  /* homepage: load testimonials from Google Sheet */
  loadTestimonialsFromSheet();

});

function initRevealFor(els) {
  if ('IntersectionObserver' in window && els.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
  } else {
    els.forEach(el => el.classList.add('is-visible'));
  }
}

function fieldVal(form, id) {
  const el = form.querySelector('#' + id);
  return el && el.value ? el.value.trim() : '';
}

function buildCandidateWhatsAppLink(form) {
  const name = fieldVal(form, 'c-name');
  const phone = fieldVal(form, 'c-phone');
  const email = fieldVal(form, 'c-email');
  const exp = fieldVal(form, 'c-exp');
  const role = fieldVal(form, 'c-role');

  let text = "Hi, I'd like to submit my resume to The Job Tag Consultancy.\n";
  text += "Name: " + name + "\n";
  text += "Phone: " + phone + "\n";
  text += "Email: " + email + "\n";
  if (exp) text += "Experience: " + exp + "\n";
  if (role) text += "Preferred Role: " + role + "\n";
  text += "\n(I'll attach my resume here in the chat.)";

  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
}

function buildContactWhatsAppLink(form) {
  const name = fieldVal(form, 'ct-name');
  const phone = fieldVal(form, 'ct-phone');
  const email = fieldVal(form, 'ct-email');
  const reason = fieldVal(form, 'ct-reason');
  const message = fieldVal(form, 'ct-message');

  let text = "Hi, I'm reaching out via The Job Tag Consultancy website.\n";
  text += "Name: " + name + "\n";
  text += "Phone: " + phone + "\n";
  text += "Email: " + email + "\n";
  if (reason) text += "I am a: " + reason + "\n";
  text += "Message: " + message;

  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
}

function buildEmployerWhatsAppLink(form) {
  const company = fieldVal(form, 'company');
  const contactName = fieldVal(form, 'contact-name');
  const phone = fieldVal(form, 'phone');
  const email = fieldVal(form, 'email');
  const role = fieldVal(form, 'role');
  const openings = fieldVal(form, 'openings');
  const details = fieldVal(form, 'details');

  let text = "Hi, I'd like to post a hiring requirement with The Job Tag Consultancy.\n";
  text += "Company: " + company + "\n";
  text += "Contact Name: " + contactName + "\n";
  text += "Phone: " + phone + "\n";
  text += "Email: " + email + "\n";
  text += "Role to Fill: " + role + "\n";
  if (openings) text += "Openings: " + openings + "\n";
  if (details) text += "Details: " + details + "\n";

  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
}

function setupJobFilter() {
  const filterBar = document.querySelector('.filter-bar');
  const jobItems = document.querySelectorAll('.job-item');
  if (!filterBar || !jobItems.length) return;
  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const cat = btn.dataset.filter;
    jobItems.forEach(item => {
      const show = cat === 'all' || item.dataset.category === cat;
      item.style.display = show ? '' : 'none';
    });
  });
}

/* ==========================================================================
   Minimal CSV parser (handles quoted fields with commas/newlines)
   ========================================================================== */
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { inQuotes = false; }
      } else {
        field += c;
      }
    } else {
      if (c === '"') { inQuotes = true; }
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(field); field = '';
        rows.push(row); row = [];
      } else {
        field += c;
      }
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(c => c.trim() !== ''));
}

function badgeClass(label) {
  if (!label) return '';
  const l = label.toLowerCase();
  if (l === 'urgent') return 'urgent';
  if (['hybrid', 'remote', 'field'].includes(l)) return 'remote';
  return '';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : str;
  return div.innerHTML;
}

/* ==========================================================================
   Fetch + parse job rows from the published Google Sheet (shared by both
   the full Jobs page and the homepage preview)
   ========================================================================== */
let _jobsCache = null;
async function fetchJobsData() {
  if (_jobsCache) return _jobsCache;
  if (!JOBS_SHEET_CSV_URL || JOBS_SHEET_CSV_URL.indexOf('PASTE_YOUR') === 0) {
    throw new Error('Sheet URL not configured');
  }
  const res = await fetch(JOBS_SHEET_CSV_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('Sheet fetch failed: ' + res.status);
  const text = await res.text();
  const rows = parseCSV(text);
  if (rows.length < 2) throw new Error('Sheet has no data rows');

  const header = rows[0].map(h => h.trim().toLowerCase());
  const jobs = rows.slice(1).map(r => {
    const obj = {};
    header.forEach((h, i) => { obj[h] = (r[i] || '').trim(); });
    return obj;
  }).filter(j => j.title && (!j.active || j.active.toLowerCase() !== 'no'));

  _jobsCache = jobs;
  return jobs;
}

function jobCardHtml(j, opts) {
  opts = opts || {};
  const badgeHtml = j.badge
    ? '<span class="badge ' + badgeClass(j.badge) + '">' + escapeHtml(j.badge) + '</span>'
    : '';
  const expHtml = j.experience ? '<span class="badge">' + escapeHtml(j.experience) + '</span>' : '';
  const metaParts = [j.location, j.type, j.industry].filter(Boolean).map(escapeHtml);
  const inner =
    '<div>' +
      '<h3>' + escapeHtml(j.title) + '</h3>' +
      '<div class="meta">' + metaParts.join(' &middot; ') + '</div>' +
    '</div>' +
    badgeHtml + expHtml +
    '<span class="salary">' + escapeHtml(j.salary || '') + '</span>';

  if (opts.linkToJobsPage) {
    // homepage preview: whole card links to the jobs page
    return '<a href="jobs.html" class="job-item reveal is-visible">' + inner + '</a>';
  }

  // full jobs page: card + dedicated Apply button opening WhatsApp
  const msg = encodeURIComponent(
    "Hi, I'm interested in the " + j.title + " position listed on your website. Could you share more details?"
  );
  const waLink = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + msg;
  return (
    '<div class="job-item reveal is-visible" data-category="' + escapeHtml(j.category || '') + '">' +
      inner +
      '<a class="btn btn-primary apply-btn" href="' + waLink + '" target="_blank" rel="noopener">Apply</a>' +
    '</div>'
  );
}

/* ==========================================================================
   Jobs page: full listing + filter
   ========================================================================== */
/* ==========================================================================
   SEO: inject JobPosting structured data for the currently listed jobs
   ========================================================================== */
function injectJobPostingSchema(jobs) {
  const existing = document.getElementById('job-posting-schema');
  if (existing) existing.remove();

  const today = new Date().toISOString().split('T')[0];
  const validThrough = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const postings = jobs.slice(0, 30).map(j => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": j.title || "",
    "description": (j.title ? j.title + " role at The Job Tag Consultancy" : "Job opening") +
      (j.industry ? " in the " + j.industry + " industry" : "") +
      (j.experience ? ", " + j.experience + " experience required" : "") + ".",
    "identifier": {
      "@type": "PropertyValue",
      "name": "The Job Tag Consultancy",
      "value": (j.title || "job") + "-" + (j.location || "")
    },
    "datePosted": today,
    "validThrough": validThrough,
    "employmentType": j.type ? j.type.toUpperCase().replace(/[\s-]+/g, '_') : "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": "The Job Tag Consultancy",
      "sameAs": "https://thejobtag.com/",
      "logo": "https://thejobtag.com/images/logo.png"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": j.location || "Rajkot",
        "addressRegion": "Gujarat",
        "addressCountry": "IN"
      }
    },
    "industry": j.industry || undefined,
    "baseSalary": j.salary ? {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": { "@type": "QuantitativeValue", "value": j.salary, "unitText": "YEAR" }
    } : undefined
  }));

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'job-posting-schema';
  script.textContent = JSON.stringify(postings.length === 1 ? postings[0] : postings);
  document.head.appendChild(script);
}

async function loadJobsFromSheet() {
  const container = document.getElementById('job-list');
  if (!container) return; // not on the jobs page

  try {
    const jobs = await fetchJobsData();
    if (!jobs.length) {
      container.innerHTML = '<p class="center">No openings listed right now — check back soon, or send us your resume anyway.</p>';
      return;
    }
    container.innerHTML = jobs.map(j => jobCardHtml(j, { linkToJobsPage: false })).join('');
    setupJobFilter();
    injectJobPostingSchema(jobs);
  } catch (err) {
    if (err.message === 'Sheet URL not configured') {
      container.innerHTML = '<p class="center">Job listings aren\'t connected yet. Add your Google Sheet link in js/script.js.</p>';
    } else {
      container.innerHTML = '<p class="center">Couldn\'t load current openings right now. Please check back shortly, or <a href="tel:+918128134433" style="text-decoration:underline;">call us</a>.</p>';
    }
    console.error('Job sheet load error:', err);
  }
}

/* ==========================================================================
   Homepage: preview of latest 6 listings, each linking to the Jobs page
   ========================================================================== */
async function loadFeaturedJobsOnHome() {
  const container = document.getElementById('job-list-home');
  if (!container) return; // not on the homepage

  try {
    const jobs = await fetchJobsData();
    if (!jobs.length) {
      container.innerHTML = '<p class="center">No openings listed right now — check back soon.</p>';
      return;
    }
    container.innerHTML = jobs.slice(0, 6).map(j => jobCardHtml(j, { linkToJobsPage: true })).join('');
  } catch (err) {
    container.innerHTML = '<p class="center">Openings will appear here shortly. <a href="jobs.html" style="text-decoration:underline;">View jobs page &rarr;</a></p>';
    console.error('Featured jobs load error:', err);
  }
}

/* ==========================================================================
   Homepage: testimonials loaded from a Google Sheet
   Expected columns: quote, name, title, active
   ========================================================================== */
async function loadTestimonialsFromSheet() {
  const container = document.getElementById('testimonials-list');
  if (!container) return; // not on the homepage

  if (!TESTIMONIALS_SHEET_CSV_URL || TESTIMONIALS_SHEET_CSV_URL.indexOf('PASTE_YOUR') === 0) {
    return; // not configured yet — leave the existing fallback markup in place
  }

  try {
    const res = await fetch(TESTIMONIALS_SHEET_CSV_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Sheet fetch failed: ' + res.status);
    const text = await res.text();
    const rows = parseCSV(text);
    if (rows.length < 2) throw new Error('Sheet has no data rows');

    const header = rows[0].map(h => h.trim().toLowerCase());
    const testimonials = rows.slice(1).map(r => {
      const obj = {};
      header.forEach((h, i) => { obj[h] = (r[i] || '').trim(); });
      return obj;
    }).filter(t => t.quote && (!t.active || t.active.toLowerCase() !== 'no'));

    if (!testimonials.length) return; // keep fallback markup if sheet is empty

    const cardHtml = (t, hidden) => {
      const citeParts = [t.name, t.title].filter(Boolean).map(escapeHtml);
      return (
        '<div class="quote-card reveal is-visible"' + (hidden ? ' aria-hidden="true"' : '') + '>' +
          '<p>' + escapeHtml(t.quote) + '</p>' +
          (citeParts.length ? '<cite>' + citeParts.join(', ') + '</cite>' : '') +
        '</div>'
      );
    };

    // render the set twice back-to-back so the marquee's -50% translateX loop is seamless
    container.innerHTML =
      testimonials.map(t => cardHtml(t, false)).join('') +
      testimonials.map(t => cardHtml(t, true)).join('');

  } catch (err) {
    console.error('Testimonials sheet load error:', err);
    // leave existing fallback markup in place on failure
  }
}
