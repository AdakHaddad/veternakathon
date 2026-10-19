import Link from "next/link";
import { lookupReference } from "@/lib/actions";
import { getDb } from "@/lib/store";
import { STATUS_LABEL_ID } from "@/lib/types";

export default async function CekStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ref?: string }>;
}) {
  const { error, ref } = await searchParams;
  const recent = getDb()
    .reports.slice()
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-100 text-2xl">
          🔎
        </span>
        <h1 className="mt-3 text-2xl font-bold">Cek status laporan</h1>
        <p className="mt-1 text-sm text-stone-600">
          Masukkan nomor laporan Anda (contoh format: VR-2026-1001).
        </p>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm font-medium text-red-800">
          Nomor laporan tidak ditemukan{ref ? `: ${ref}` : ""}. Periksa
          penulisannya.
        </p>
      ) : null}

      <form
        action={lookupReference}
        className="flex gap-2 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm"
      >
        <input
          name="reference"
          required
          placeholder="VR-2026-1001"
          className="input-el flex-1 font-mono"
        />
        <button
          type="submit"
          className="rounded-xl bg-emerald-700 px-5 py-2 font-semibold text-white transition hover:bg-emerald-800"
        >
          Cari
        </button>
      </form>

      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          Nomor laporan terbaru (data demo — klik untuk lihat)
        </p>
        <ul className="mt-2 divide-y text-sm">
          {recent.map((r) => (
            <li key={r.id}>
              <Link
                href={`/status/${r.reference}`}
                className="flex items-center justify-between gap-2 py-2 hover:text-emerald-700"
              >
                <span className="font-mono">{r.reference}</span>
                <span className="rounded bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-700">
                  {STATUS_LABEL_ID[r.workflow_status]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-center text-sm">
        Lupa nomor?{" "}
        <Link href="/lapor" className="font-medium text-emerald-700 hover:underline">
          Buat laporan baru
        </Link>
      </p>
    </div>
  );
}
