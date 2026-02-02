import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "submissions.jsonl");
const FORMS_DEMO_FILE = path.join(DATA_DIR, "forms.demo.json");

export type FormField = {
  name: string;
  label: string;
  type: "text" | "email" | "textarea";
  required?: boolean;
  placeholder?: string;
};

export type Destination =
  | { type: "email"; enabled: boolean; config: { to: string; from: string; subject: string } }
  | { type: "google_sheets"; enabled: boolean; config: { spreadsheetId: string; sheetName: string } }
  | { type: "mysql"; enabled: boolean; config: { table: string } }
  | { type: "webhook"; enabled: boolean; config: { url: string } };

export type FormDefinition = {
  slug: string;
  title: string;
  fields: FormField[];
  settings?: {
    successMessage?: string;
    rateLimitPerMinute?: number;
  };
  destinations?: Destination[];
};

export type HubConfig = {
  forms: FormDefinition[];
};

export function loadConfig(): HubConfig {
  const raw = fs.readFileSync(FORMS_DEMO_FILE, "utf-8");
  return JSON.parse(raw) as HubConfig;
}

export function getForm(slug: string): FormDefinition | undefined {
  const cfg = loadConfig();
  return cfg.forms.find((f) => f.slug === slug);
}

export type SubmissionRecord = {
  id: string;
  client?: string;
  formSlug: string;
  createdAt: string;
  ip?: string;
  userAgent?: string;
  data: Record<string, string>;
};

export function appendSubmission(rec: SubmissionRecord) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.appendFileSync(SUBMISSIONS_FILE, JSON.stringify(rec) + "\n", "utf-8");
}
