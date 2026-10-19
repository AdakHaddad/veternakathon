import Link from "next/link";
import { getDashboard } from "@/lib/queries";

export default function HomePage() {
  const d = getDashboard();

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-700 via-emerald-800 to-stone-900 p-8 text-white shadow-sm sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Sistem Pelaporan Wilayah
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
          Laporkan masalah kesehatan hewan Anda
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-emerald-100 sm:text-base">
          VET-REGION membantu peternak mengirim laporan terstruktur dan
          memantau tindak lanjutnya — laporan Anda tidak boleh hilang setelah
          dikirim.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/lapor"
            className="rounded-xl bg-white px-5 py-2.5 font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-50"
          >
            Buat laporan baru
          </Link>
          <Link
            href="/edukasi"
            className="rounded-xl border border-white/30 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
          >
            Materi edukasi ternak
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap gap-6 border-t border-white/15 pt-6 text-sm">
          <HeroStat value={d.total} label="Laporan tercatat" />
          <HeroStat value={d.unverified} label="Menunggu ditinjau" />
          <HeroStat value={d.confirmed} label="Terverifikasi resmi" />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <FeatureCard
          step="1"
          title="Buat laporan"
          desc="Isi data singkat: jenis ternak, tanda yang terlihat, jumlah perkiraan, dan wilayah."
          href="/lapor"
        />
        <FeatureCard
          step="2"
          title="Terima nomor rujukan"
          desc="Setelah terkirim, Anda mendapat nomor laporan unik untuk memantau status."
          href="/lapor"
        />
        <FeatureCard
          step="3"
          title="Pantau tindak lanjut"
          desc="Responder resmi menerima laporan, mencatat tindakan, dan memperbarui status."
          href="/cek"
        />
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold">Cek status laporan Anda</h2>
            <p className="mt-1 text-sm text-stone-600">
              Sudah punya nomor laporan? Lacak perkembangannya sekarang.
            </p>
          </div>
          <Link
            href="/cek"
            className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Cek Status →
          </Link>
        </div>
      </section>
    </div>
  );
}

function HeroStat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-emerald-200">{label}</p>
    </div>
  );
}

function FeatureCard({
  step,
  title,
  desc,
  href,
}: {
  step: string;
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md"
    >
      <span className="grid size-8 place-items-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-800">
        {step}
      </span>
      <p className="mt-3 font-semibold">{title}</p>
      <p className="mt-1 text-sm text-stone-600">{desc}</p>
    </Link>
  );
}
