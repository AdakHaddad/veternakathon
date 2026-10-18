import Link from "next/link";
import { getPublishedEducation } from "@/lib/queries";

export default function EdukasiPage() {
  const list = getPublishedEducation();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Materi edukasi</h1>
        <p className="text-sm text-stone-600">
          Materi singkat untuk peternak. Setiap materi mencantumkan sumber,
          penelaah, dan tanggal telaah.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((e) => (
          <Link
            key={e.id}
            href={`/edukasi/${e.id}`}
            className="block rounded-lg border bg-white p-4 hover:border-emerald-600"
          >
            <p className="text-xs uppercase tracking-wide text-stone-400">
              {e.topic}
            </p>
            <p className="mt-1 font-semibold">{e.title}</p>
            <p className="mt-1 text-sm text-stone-600">{e.summary}</p>
            <p className="mt-2 text-xs text-stone-500">
              Untuk: {e.species_scope.join(", ")} · Sumber: {e.source_name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
