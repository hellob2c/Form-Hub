import { loadConfig } from "@/lib/store";

export default function AdminPage() {
  const cfg = loadConfig();

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Admin (MVP)</h1>
            <p className="mt-2 text-slate-600">
              This admin is read-only for MVP. Edit <code className="rounded bg-slate-100 px-1">data/forms.demo.json</code> to add forms
              and configure destinations.
            </p>
          </div>
          <a className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 hover:bg-slate-100" href="/">
            Home
          </a>
        </div>

        <div className="mt-6 grid gap-4">
          {cfg.forms.map((f) => {
            const embedUrl = `/embed/${encodeURIComponent(f.slug)}?client=CLIENT_SLUG&theme=light`;
            const iframeCode = `<iframe src="https://forms.yourdomain.com${embedUrl}" style="width:100%;border:0;min-height:720px;" loading="lazy"></iframe>`;
            return (
              <div key={f.slug} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">{f.title}</div>
                    <div className="text-sm text-slate-600">slug: {f.slug}</div>
                  </div>
                  <a className="rounded-xl bg-slate-900 px-4 py-2 text-white hover:opacity-95" href={`/embed/${f.slug}?client=demo&theme=light`}>
                    Preview
                  </a>
                </div>

                <div className="mt-4 grid gap-2">
                  <div className="text-sm font-medium text-slate-700">Embed URL (relative)</div>
                  <pre className="overflow-auto rounded-xl bg-slate-950 p-3 text-xs text-slate-50">{embedUrl}</pre>

                  <div className="text-sm font-medium text-slate-700">Iframe snippet</div>
                  <pre className="overflow-auto rounded-xl bg-slate-950 p-3 text-xs text-slate-50">{iframeCode}</pre>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
