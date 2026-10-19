import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getSession } from "@/lib/auth";
import { signOut } from "@/lib/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "VET-REGION — Pelaporan Kesehatan Hewan",
  description:
    "Koordinasi pelaporan dan tindak lanjut penyakit hewan tingkat wilayah.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  const isStaff =
    session && (session.role === "responder" || session.role === "admin");

  return (
    <html lang="id">
      <body className="min-h-screen bg-stone-100 text-stone-900 antialiased">
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
              <span className="grid size-9 place-items-center rounded-lg bg-emerald-700 text-lg text-white shadow-sm">
                🐄
              </span>
              <span className="hidden sm:block">
                VET-REGION
                <span className="block text-[10px] font-medium uppercase tracking-widest text-stone-500">
                  Kesehatan Hewan Wilayah
                </span>
              </span>
            </Link>
            <nav className="flex flex-wrap items-center gap-1.5 text-sm">
              <NavLink href="/lapor">Buat Laporan</NavLink>
              <NavLink href="/cek">Cek Status</NavLink>
              <NavLink href="/edukasi">Edukasi</NavLink>
              {isStaff ? (
                <>
                  <NavLink href="/responder">Antrean</NavLink>
                  <NavLink href="/dashboard">Dasbor</NavLink>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100"
                    >
                      Keluar ({session.display_name.split(" ")[0]})
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/masuk"
                  className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-700"
                >
                  Masuk Responder
                </Link>
              )}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 pb-10 pt-4 text-center text-xs text-stone-500">
          VET-REGION
        </footer>
      </body>
    </html>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-1.5 font-medium text-stone-600 transition hover:bg-emerald-50 hover:text-emerald-800"
    >
      {children}
    </Link>
  );
}
