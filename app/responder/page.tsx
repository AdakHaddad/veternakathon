import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getOpenQueue, getRegionName } from "@/lib/queries";
import { STATUS_LABEL_ID, type WorkflowStatus } from "@/lib/types";

const BADGE_STYLE: Record<WorkflowStatus, string> = {
  "Submitted": "bg-stone-200 text-stone-800",
  "Received": "bg-blue-100 text-blue-800",
  "Needs Information": "bg-amber-100 text-amber-900",
  "Under Review": "bg-indigo-100 text-indigo-900",
  "Referred/Escalated": "bg-purple-100 text-purple-900",
  "Closed": "bg-emerald-100 text-emerald-900",
};

const SPECIES_ICON: Record<string, string> = {
  ayam: "🐤",
  sapi: "🐄",
};

export default async function ResponderQueuePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (!session || (session.role !== "responder" && session.role !== "admin")) {
    redirect("/masuk?error=1");
  }
  const { error } = await searchParams;
  const queue = getOpenQueue();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Antrean responder</h1>
        <p className="mt-1 text-sm text-stone-600">
          Login sebagai <strong>{session.display_name}</strong>. Wilayah
          kewenangan: Kabupaten Sleman (pilot). Klik laporan untuk membuka
          detail.
        </p>
      </div>
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">
          Ada masalah memproses permintaan.
        </p>
      ) : null}

      <div className="rounded-xl bg-white px-5 py-3 text-sm shadow-sm">
        <span className="font-semibold">{queue.length}</span> laporan terbuka
        dalam antrean
      </div>

      {queue.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center shadow-sm">
          <span className="text-4xl">🎉</span>
          <p className="mt-2 font-medium">Antrean kosong</p>
          <p className="text-sm text-stone-600">Semua laporan sudah ditangani.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {queue.map((r) => (
            <li key={r.id}>
              <Link
                href={`/responder/${r.reference}`}
                className="block rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-lg bg-stone-100 text-lg">
                      {SPECIES_ICON[r.species] ?? "🐾"}
                    </span>
                    <span className="font-mono font-semibold">{r.reference}</span>
                    <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium">
                      {r.species}
                    </span>
                  </span>
                  <span className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE_STYLE[r.workflow_status]}`}
                    >
                      {STATUS_LABEL_ID[r.workflow_status]}
                    </span>
                    {r.verification_status === "unverified" ? (
                      <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-amber-200">
                        belum terverifikasi
                      </span>
                    ) : null}
                  </span>
                </div>
                <p className="mt-2 text-sm text-stone-600">
                  Tanda: {r.observed_signs.join(", ") || "-"}
                </p>
                <p className="mt-1 flex flex-wrap gap-x-4 text-xs text-stone-500">
                  <span>
                    📍 {getRegionName(r.region_id)}
                  </span>
                  <span>Terkena: {r.affected_count ?? "-"}</span>
                  <span>Mati: {r.dead_count ?? "-"}</span>
                  <span>
                    Masuk:{" "}
                    {new Date(r.created_at).toLocaleDateString("id-ID")}
                  </span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
