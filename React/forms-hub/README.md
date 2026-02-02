# Forms Hub (MVP)

A reusable forms service you can embed on *any* client website (plain HTML or React/Next.js).
It provides:
- `/embed/<slug>`: hosted form renderer (iframe-friendly)
- `/api/forms/<slug>/submit`: submission API
- Local durable log: `./data/submissions.jsonl` (one JSON per line)
- Destination connectors (stubs): Email, Google Sheets, MySQL, Webhook

> This is an MVP starter you can extend into a full multi-tenant product.

## 1) Run locally

```bash
npm install
npm run dev
```

Open:
- Home: `http://localhost:3000`
- Demo form: `http://localhost:3000/embed/contact?client=demo&theme=light`
- Admin: `http://localhost:3000/admin`

## 2) Embed in a client site

Replace `forms.yourdomain.com` with your deployed domain.

```html
<iframe
  src="https://forms.yourdomain.com/embed/contact?client=acme&theme=light"
  style="width:100%;border:0;min-height:720px;"
  loading="lazy"
></iframe>
```

## 3) Add / edit forms

Edit: `data/forms.demo.json`

Each form has:
- `slug`, `title`
- `fields` (text/email/textarea for now)
- `settings` (success message, rate limit)
- `destinations` (email/sheets/mysql/webhook)

## 4) Emails, Google Sheets, MySQL

This starter includes *connector stubs* (it logs to console).
To productionize:
- Email: integrate Resend / SendGrid / SES
- Sheets: Google API (service account or OAuth per client)
- MySQL: use `mysql2` and insert into a table
- Add a queue (BullMQ/Redis) for retries and throughput
- Add multi-tenant auth (client keys + domain allowlist)

## 5) Security checklist (recommended)

- Turnstile/reCAPTCHA
- Domain allowlist per client
- HMAC signature on requests (for headless usage)
- Strong rate limiting
- Input sanitization
- Central DB (Postgres/MySQL) as source of truth
