import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { appendSubmission, getForm } from "@/lib/store";
import { checkRateLimit } from "@/lib/rateLimit";
import { dispatchDestinations } from "@/lib/destinations";

function getIP(req: Request) {
  // Works on many proxies/CDNs; adjust for your hosting if needed.
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim();
  return undefined;
}

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const form = getForm(params.slug);
  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const ip = getIP(req) ?? "unknown";
  const ua = req.headers.get("user-agent") ?? undefined;

  const limit = form.settings?.rateLimitPerMinute ?? 10;
  const rlKey = `${params.slug}:${ip}`;
  const rl = checkRateLimit(rlKey, limit);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const client = typeof body?.client === "string" ? body.client : undefined;
  const data = typeof body?.data === "object" && body?.data ? (body.data as Record<string, string>) : null;
  if (!data) return NextResponse.json({ error: "Missing data" }, { status: 400 });

  // Validate fields declared in schema
  const cleaned: Record<string, string> = {};
  for (const f of form.fields) {
    const v = (data[f.name] ?? "").toString().trim();
    if (f.required && !v) {
      return NextResponse.json({ error: `Missing required field: ${f.name}` }, { status: 400 });
    }
    if (f.type === "email" && v) {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      if (!ok) return NextResponse.json({ error: `Invalid email` }, { status: 400 });
    }
    cleaned[f.name] = v;
  }

  const rec = {
    id: crypto.randomUUID(),
    client,
    formSlug: form.slug,
    createdAt: new Date().toISOString(),
    ip: ip === "unknown" ? undefined : ip,
    userAgent: ua,
    data: cleaned,
  };

  // Always store locally for MVP (durable log)
  appendSubmission(rec);

  // Forward to destinations (stubs by default)
  try {
    await dispatchDestinations(form, rec);
  } catch (e) {
    // Keep the submission; destination failures can be retried later in a real queue system.
    console.error("Destination error:", e);
  }

  return NextResponse.json({ ok: true, message: form.settings?.successMessage ?? "Submitted." });
}
