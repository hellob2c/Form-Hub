import { getForm } from "@/lib/store";
import { FormRenderer } from "@/components/FormRenderer";

export default function EmbedPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { client?: string; theme?: string };
}) {
  const form = getForm(params.slug);
  const client = searchParams?.client;
  const theme = searchParams?.theme ?? "light";

  if (!form) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="text-xl font-semibold">Form not found</div>
          <div className="mt-2 text-slate-600">
            Unknown slug: <code className="rounded bg-slate-100 px-1">{params.slug}</code>
          </div>
        </div>
      </main>
    );
  }

  // A minimal container to look good in iframes.
  return (
    <main className={theme === "dark" ? "min-h-screen bg-slate-950 p-4" : "min-h-screen bg-slate-50 p-4"}>
      <div className="mx-auto max-w-2xl">
        <FormRenderer
          formSlug={form.slug}
          title={form.title}
          fields={form.fields}
          client={client}
          theme={theme}
        />
      </div>
    </main>
  );
}
