import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getOpenQueue, getRegionName } from "@/lib/queries";
import { STATUS_LABEL_ID } from "@/lib/types";

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
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Antrean responder</h1>
        <p className="text-sm text-stone-600">
          Login sebagai <strong>{session.display_name}</strong>. Wilayah
          kewenangan: Kabupaten Sleman (pilot). Klik laporan untuk membuka
          detail.
        </p>
      </div>
      {error ? (
        <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          Ada masalah memproses permintaan.
        </p>
      ) : null}

      <ul className="divide-y rounded-lg border bg-white">
        {queue.length === 0 ? (
          <li className="p-4 text-sm text-stone-700">
            Antrean kosong (untuk uji coba).
          </li>
        ) : null}
        {queue.map((r) => (
          <li key={r.id}>
            <Link
              href={`/responder/${r.reference}`}
              className="block p-4 hover:bg-stone-50"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium">
                  <span className="font-mono">{r.reference}</span> ·{" "}
                  {r.species} · {getRegionName(r.region_id)}
                </span>
                <span className="flex gap-2">
                  <StatusChip status={r.workflow_status} />
                  {r.verification_status === "unverified" ? (
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
                      belum terverifikasi
                    </span>
                  ) : (
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-900">
                      verifikasi: {r.verification_status}
                    </span>
                  )}
                </span>
              </div>
              <p className="mt-1 text-sm text-stone-600">
                Tanda: {r.observed_signs.join(", ") || "-"} · Terkena:{" "}
                {r.affected_count ?? "tk"} · Mati: {r.dead_count ?? "tk"} ·
                Masuk: {new Date(r.created_at).toLocaleDateString("id-ID")}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusChip({ status }: { status: keyof typeof STATUS_LABEL_ID }) {
  return (
    <span className="rounded bg-stone-200 px-2 py-0.5 text-xs font-medium text-stone-800">
      {STATUS_LABEL_ID[status]}
    </span>
  );
}
