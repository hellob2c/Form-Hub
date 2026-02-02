import type { Destination, SubmissionRecord, FormDefinition } from "./store";

/**
 * This file provides pluggable "destination connectors".
 * For MVP, implementations are stubs with clear TODOs.
 *
 * Recommended in production:
 * - push destination writes to a queue (BullMQ/Redis)
 * - retry on failures
 * - keep a central DB as source of truth
 */

export async function dispatchDestinations(form: FormDefinition, sub: SubmissionRecord) {
  const dests = form.destinations ?? [];
  for (const d of dests) {
    if (!d.enabled) continue;

    switch (d.type) {
      case "email":
        await sendEmail(d.config, form, sub);
        break;
      case "google_sheets":
        await writeGoogleSheets(d.config, form, sub);
        break;
      case "mysql":
        await writeMySQL(d.config, form, sub);
        break;
      case "webhook":
        await callWebhook(d.config, form, sub);
        break;
      default:
        // exhaustive check
        const _exhaustive: never = d;
        return _exhaustive;
    }
  }
}

async function sendEmail(
  cfg: { to: string; from: string; subject: string },
  form: FormDefinition,
  sub: SubmissionRecord
) {
  // TODO: integrate Resend/SES/SendGrid
  // For now, just log. This keeps the project runnable without credentials.
  console.log("[DESTINATION:EMAIL]", { to: cfg.to, from: cfg.from, subject: cfg.subject, form: form.slug, id: sub.id });
}

async function writeGoogleSheets(
  cfg: { spreadsheetId: string; sheetName: string },
  form: FormDefinition,
  sub: SubmissionRecord
) {
  // TODO: integrate Google Sheets API (service account or OAuth per client)
  console.log("[DESTINATION:SHEETS]", { spreadsheetId: cfg.spreadsheetId, sheetName: cfg.sheetName, form: form.slug, id: sub.id });
}

async function writeMySQL(
  cfg: { table: string },
  form: FormDefinition,
  sub: SubmissionRecord
) {
  // TODO: integrate MySQL connector (mysql2) and insert into cfg.table
  console.log("[DESTINATION:MYSQL]", { table: cfg.table, form: form.slug, id: sub.id });
}

async function callWebhook(
  cfg: { url: string },
  form: FormDefinition,
  sub: SubmissionRecord
) {
  // TODO: POST JSON to cfg.url
  console.log("[DESTINATION:WEBHOOK]", { url: cfg.url, form: form.slug, id: sub.id });
}
