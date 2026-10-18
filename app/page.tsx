import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-lg border bg-white p-6">
        <h1 className="text-2xl font-bold">
          Laporkan masalah kesehatan hewan Anda
        </h1>
        <p className="mt-2 text-stone-600">
          VET-REGION membantu peternak mengirim laporan terstruktur dan
          memantau tindak lanjutnya — laporan Anda tidak boleh hilang setelah
          dikirim.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/lapor"
            className="rounded-md bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800"
          >
            Buat laporan baru
          </Link>
          <Link
            href="/edukasi"
            className="rounded-md border px-4 py-2 font-medium hover:bg-stone-100"
          >
            Materi edukasi ternak
          </Link>
        </div>
      </section>

      <section className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm">
        <p className="font-semibold text-amber-900">Pemberitahuan penting</p>
        <ul className="mt-2 list-disc pl-5 text-amber-900/90">
          <li>
            Aplikasi ini <strong>tidak mendiagnosis</strong> penyakit dan tidak
            memberikan resep.
          </li>
          <li>
            Untuk kejadian darurat atau penyakit yang{" "}
            <strong>wajib dilaporkan</strong>, hubungi langsung Puskeswan /
            dinas — jangan tunggu status di aplikasi ini.
          </li>
          <li>
            Laporan Anda dibaca oleh responder yang ditunjuk pada wilayah
            penguji coba. Jangan menulis data yang tidak diperlukan.
          </li>
        </ul>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <FeatureCard
          title="1. Buat laporan"
          desc="Isi data singkat: jenis ternak, tanda yang terlihat, jumlah perkiraan, dan wilayah."
          href="/lapor"
        />
        <FeatureCard
          title="2. Terima nomor rujukan"
          desc="Setelah terkirim, Anda mendapat nomor laporan unik untuk memantau status."
          href="/lapor"
        />
        <FeatureCard
          title="3. Pantau tindak lanjut"
          desc="Responder resmi menerima laporan, mencatat tindakan, dan memperbarui status. Buka: Cek Status."
          href="/cek"
        />
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg border bg-white p-4 hover:border-emerald-600"
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-stone-600">{desc}</p>
    </Link>
  );
}
