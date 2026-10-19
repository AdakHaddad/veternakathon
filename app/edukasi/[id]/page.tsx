import Link from "next/link";
import { notFound } from "next/navigation";
import { getEducationById } from "@/lib/queries";

export default async function EdukasiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const e = getEducationById(id);
  if (!e || !e.is_published) notFound();

  return (
    <article className="mx-auto max-w-2xl space-y-4">
      <Link href="/edukasi" className="text-sm text-emerald-700 hover:underline">
        ← Semua materi
      </Link>
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
          {e.topic} · untuk {e.species_scope.join(", ")}
        </span>
        <h1 className="mt-3 text-2xl font-bold leading-snug">{e.title}</h1>
        <p className="mt-3 leading-relaxed">{e.summary}</p>
      </div>

      <dl className="grid gap-x-6 gap-y-2 rounded-2xl border border-stone-200 bg-white p-5 text-sm shadow-sm sm:grid-cols-2">
        <Meta label="Sumber" value={e.source_name} />
        <Meta label="Tautan" value={e.source_url} href_={e.source_url.startsWith("http")} />
        <Meta label="Penelaah" value={e.reviewer} />
        <Meta
          label="Tanggal telaah"
          value={new Date(e.reviewed_at).toLocaleDateString("id-ID")}
        />
      </dl>
    </article>
  );
}

function Meta({
  label,
  value,
  href_,
}: {
  label: string;
  value: string;
  href_?: boolean;
}) {
  return (
    <div className="flex gap-2">
      <dt className="w-32 shrink-0 text-xs uppercase tracking-wide text-stone-600">
        {label}
      </dt>
      <dd className="break-all">
        {href_ ? (
          <a href={value} className="text-emerald-700 hover:underline" rel="noreferrer" target="_blank">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
