export default function Home() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-semibold">Forms Hub (MVP)</h1>
        <p className="mt-2 text-slate-600">
          This is a reusable forms service. Use <code className="rounded bg-slate-100 px-1">/embed/&lt;slug&gt;</code> to embed a form.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <a className="rounded-xl border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100" href="/embed/contact?client=demo&theme=light">
            <div className="font-medium">Demo embed: Contact</div>
            <div className="text-sm text-slate-600">/embed/contact?client=demo</div>
          </a>
          <a className="rounded-xl border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100" href="/admin">
            <div className="font-medium">Admin</div>
            <div className="text-sm text-slate-600">Basic config + embed code</div>
          </a>
        </div>

        <div className="mt-6 text-sm text-slate-600">
          Submissions are stored in <code className="rounded bg-slate-100 px-1">./data/submissions.jsonl</code> (one JSON per line).
          Destinations (Email/Sheets/MySQL) are stubbed and can be enabled via environment variables.
        </div>
      </div>
    </main>
  );
}
