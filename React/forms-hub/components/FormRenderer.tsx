"use client";

import { useMemo, useState } from "react";

type Field = {
  name: string;
  label: string;
  type: "text" | "email" | "textarea";
  required?: boolean;
  placeholder?: string;
};

export function FormRenderer({
  formSlug,
  title,
  fields,
  client,
  theme,
}: {
  formSlug: string;
  title: string;
  fields: Field[];
  client?: string;
  theme?: string;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, ""]))
  );

  const isDark = useMemo(() => theme === "dark", [theme]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    // Honeypot (simple spam trap)
    if ((values["_hp"] ?? "").trim().length > 0) {
      setStatus("success");
      setMessage("Thanks!");
      return;
    }

    const payload: Record<string, string> = {};
    for (const f of fields) payload[f.name] = (values[f.name] ?? "").trim();

    try {
      const res = await fetch(`/api/forms/${encodeURIComponent(formSlug)}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client, data: payload }),
      });

      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j?.error ?? "Submission failed");

      setStatus("success");
      setMessage(j?.message ?? "Submitted successfully.");
      setValues(Object.fromEntries(fields.map((f) => [f.name, ""])));
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message ?? "Something went wrong.");
    }
  }

  const shell = isDark
    ? "bg-slate-900 text-slate-50 ring-slate-700"
    : "bg-white text-slate-900 ring-slate-200";

  const input = isDark
    ? "bg-slate-950 border-slate-700 placeholder:text-slate-500"
    : "bg-white border-slate-200 placeholder:text-slate-400";

  return (
    <div className={`w-full rounded-2xl p-6 shadow-sm ring-1 ${shell}`}>
      <div className="mb-4">
        <div className="text-xl font-semibold">{title}</div>
        <div className={isDark ? "text-slate-300" : "text-slate-600"}>
          Powered by Forms Hub
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid gap-4">
        {/* Honeypot */}
        <input
          aria-hidden="true"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          value={values["_hp"] ?? ""}
          onChange={(e) => setValues((v) => ({ ...v, _hp: e.target.value }))}
        />

        {fields.map((f) => {
          const common =
            `w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-offset-0 ${input}`;
          return (
            <label key={f.name} className="grid gap-1">
              <span className="text-sm font-medium">
                {f.label} {f.required ? <span className="text-red-500">*</span> : null}
              </span>

              {f.type === "textarea" ? (
                <textarea
                  className={common}
                  rows={5}
                  required={!!f.required}
                  placeholder={f.placeholder ?? ""}
                  value={values[f.name] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                />
              ) : (
                <input
                  className={common}
                  type={f.type}
                  required={!!f.required}
                  placeholder={f.placeholder ?? ""}
                  value={values[f.name] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                />
              )}
            </label>
          );
        })}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-xl bg-slate-900 px-4 py-2 font-medium text-white hover:opacity-95 disabled:opacity-60"
        >
          {status === "submitting" ? "Submitting..." : "Submit"}
        </button>

        {status !== "idle" ? (
          <div
            className={
              status === "success"
                ? "rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-800"
                : status === "error"
                ? "rounded-xl border border-red-200 bg-red-50 p-3 text-red-800"
                : ""
            }
          >
            {message}
          </div>
        ) : null}
      </form>
    </div>
  );
}
