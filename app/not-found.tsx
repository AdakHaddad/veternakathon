import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md space-y-4 py-10 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-stone-600">
        Halaman tidak tersedia
      </p>
      <h1 className="text-2xl font-bold">404 — Tidak ditemukan</h1>
      <p className="text-stone-600">
        Halaman atau laporan yang Anda cari tidak ada. Periksa kembali
        nomor laporan di halaman &ldquo;Cek status&rdquo;, atau kembali ke
        beranda.
      </p>
      <div className="flex justify-center gap-3 pt-2">
        <Link
          href="/"
          className="rounded-md bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800"
        >
          Ke beranda
        </Link>
        <Link
          href="/cek"
          className="rounded-md border px-4 py-2 font-medium hover:bg-stone-100"
        >
          Cek status
        </Link>
      </div>
    </div>
  );
}
