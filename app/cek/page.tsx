import Link from "next/link";
import { lookupReference } from "@/lib/actions";

export default async function CekStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ref?: string }>;
}) {
  const { error, ref } = await searchParams;
  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-xl font-bold">Cek status laporan</h1>
      <p className="text-sm text-stone-600">
        Masukkan nomor laporan Anda (contoh format: VR-2026-1001).
      </p>
      {error ? (
        <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          Nomor laporan tidak ditemukan{ref ? `: ${ref}` : ""}. Periksa
          penulisannya.
        </p>
      ) : null}
      <form action={lookupReference} className="flex gap-2">
        <input
          name="reference"
          required
          placeholder="VR-2026-1001"
          className="flex-1 rounded border p-2 font-mono text-sm"
        />
        <button
          type="submit"
          className="rounded-md bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800"
        >
          Cari
        </button>
      </form>
      <p className="text-sm">
        Lupa nomor?{" "}
        <Link href="/lapor" className="text-emerald-700 hover:underline">
          Buat laporan baru
        </Link>
        .
      </p>
    </div>
  );
}
