import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getSession } from "@/lib/auth";
import { signOut } from "@/lib/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "VET-REGION — Prototipe Pelaporan Kesehatan Hewan",
  description:
    "Prototipe koordinasi pelaporan dan tindak lanjut penyakit hewan tingkat wilayah (pilot).",
};

const SIMULATION_BANNER =
  "Data dalam aplikasi ini adalah SIMULASI untuk uji coba prototipe. Aplikasi ini tidak mendiagnosis penyakit dan tidak menggantikan pelaporan resmi (iSIKHNAS / Dinas). Untuk kejadian darurat atau wajib lapor, hubungi Puskeswan atau petugas kesehatan hewan setempat.";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  return (
    <html lang="id">
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">
        <div className="bg-amber-100 border-b border-amber-300 px-4 py-2 text-center text-xs text-amber-900">
          {SIMULATION_BANNER}
        </div>
        <header className="border-b bg-white px-4 py-3">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
            <Link href="/" className="font-bold tracking-tight">
              🐄 VET-REGION
            </Link>
            <nav className="flex items-center gap-3 text-sm">
              <Link href="/lapor" className="hover:underline">
                Buat Laporan
              </Link>
              <Link href="/cek" className="hover:underline">
                Cek Status
              </Link>
              <Link href="/edukasi" className="hover:underline">
                Edukasi
              </Link>
              {session && (session.role === "responder" || session.role === "admin") ? (
                <>
                  <Link href="/responder" className="hover:underline">
                    Antrean
                  </Link>
                  <Link href="/dashboard" className="hover:underline">
                    Dasbor
                  </Link>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="rounded border px-2 py-1 text-xs hover:bg-stone-100"
                    >
                      Keluar ({session.display_name})
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/masuk" className="hover:underline">
                  Masuk Responder
                </Link>
              )}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
        <footer className="mx-auto max-w-4xl px-4 pb-10 pt-4 text-xs text-stone-500">
          VET-REGION — prototipe untuk kompetisi (data simulasi). Status
          &ldquo;Ditutup&rdquo; berarti alur administrasi selesai, bukan bukti
          hewan sembuh. Keputusan klinis dan klaim luar biasa tetap menjadi
          kewenangan pejabat berwenang.
        </footer>
      </body>
    </html>
  );
}
