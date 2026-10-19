import Link from "next/link";
import { getPublishedEducation } from "@/lib/queries";

const TOPIC_ICON: Record<string, string> = {
  "Biosekuritas": "🧼",
  "Sikap awal": "🚨",
  "Manajemen pakan": "🌾",
};

export default function EdukasiPage() {
  const list = getPublishedEducation();

  return (
    <div className="space-y-5">
      <div className="text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-100 text-2xl">
          📚
        </span>
        <h1 className="mt-3 text-2xl font-bold">Materi edukasi</h1>
        <p className="mt-1 text-sm text-stone-600">
          Materi singkat untuk peternak. Setiap materi mencantumkan sumber,
          penelaah, dan tanggal telaah.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((e) => (
          <Link
            key={e.id}
            href={`/edukasi/${e.id}`}
            className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md"
          >
            <span className="text-2xl">{TOPIC_ICON[e.topic] ?? "📖"}</span>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              {e.topic}
            </p>
            <p className="mt-1 font-semibold leading-snug group-hover:text-emerald-800">
              {e.title}
            </p>
            <p className="mt-2 flex-1 text-sm text-stone-600">{e.summary}</p>
            <p className="mt-3 text-xs text-stone-500">
              Untuk: {e.species_scope.join(", ")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
