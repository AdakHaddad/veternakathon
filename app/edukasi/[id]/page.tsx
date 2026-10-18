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
      <div className="rounded-lg border bg-white p-5">
        <p className="text-xs uppercase tracking-wide text-stone-400">
          {e.topic} · untuk {e.species_scope.join(", ")}
        </p>
        <h1 className="mt-1 text-xl font-bold">{e.title}</h1>
        <p className="mt-3 leading-relaxed">{e.summary}</p>
        <dl className="mt-4 space-y-1 border-t pt-3 text-sm">
          <Meta label="Sumber" value={e.source_name} />
          <Meta label="Tautan" value={e.source_url} href_={e.source_url.startsWith("http")} />
          <Meta label="Penelaah" value={e.reviewer} />
          <Meta
            label="Tanggal telaah"
            value={new Date(e.reviewed_at).toLocaleDateString("id-ID")}
          />
        </dl>
        <div className="mt-4 rounded border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
          Materi ini adalah ringkasan edukasi, bukan diagnosis. Untuk kejadian
          mendesak atau penyakit wajib lapor, hubungi Puskeswan atau dinas
          kesehatan hewan setempat; jangan mengandalkan aplikasi ini sebagai
          satu-satunya jalur.
        </div>
      </div>
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
      <dt className="w-32 shrink-0 text-xs uppercase tracking-wide text-stone-400">
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
