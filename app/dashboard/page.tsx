import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDashboard } from "@/lib/queries";
import { STATUS_LABEL_ID, WORKFLOW_STATUSES } from "@/lib/types";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session || (session.role !== "responder" && session.role !== "admin")) {
    redirect("/masuk?error=1");
  }
  const d = getDashboard();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">Dasbor wilayah</h1>
        <p className="text-sm text-stone-600">
          Login sebagai <strong>{session.display_name}</strong>. Data{" "}
          <strong>SIMULASI</strong> untuk uji coba; dasbor ini tidak
          menampilkan koordinat atau identitas pelapor.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Total laporan (simulasi)" value={d.total} />
        <Stat
          label="Belum terverifikasi"
          value={d.unverified}
          hint="Laporan warga, belum ditinjau responder"
        />
        <Stat
          label="Dikonfirmasi sumber resmi"
          value={d.confirmed}
          hint="Hanya dari pihak berwenang"
        />
      </div>

      <section className="rounded-lg border bg-white p-4">
        <h2 className="font-semibold">Berdasar status</h2>
        <ul className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
          {WORKFLOW_STATUSES.map((s) => (
            <li
              key={s}
              className="flex justify-between rounded border px-3 py-2"
            >
              <span>{STATUS_LABEL_ID[s]}</span>
              <span className="font-mono">{d.byStatus.get(s) ?? 0}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-stone-500">
          &ldquo;Ditutup&rdquo; berarti alur administrasi selesai, bukan bukti
          hewan sembuh. Hasil (outcome) terpisah dari status alur.
        </p>
      </section>

      <section className="rounded-lg border bg-white p-4">
        <h2 className="font-semibold">Berdasar sub-wilayah (agregat)</h2>
        <table className="mt-2 w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-stone-400">
              <th className="py-1">Sub-wilayah</th>
              <th className="py-1 text-right">Laporan</th>
              <th className="py-1 text-right">Belum terverifikasi</th>
            </tr>
          </thead>
          <tbody>
            {d.byRegion.map((r) => (
              <tr key={r.region.id} className="border-t">
                <td className="py-2">{r.region.name}</td>
                <td className="py-2 text-right font-mono">{r.count}</td>
                <td className="py-2 text-right font-mono">{r.unverified}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-stone-500">
          Jika jumlah di suatu area terlalu kecil pada penerapan nyata, angka
          dan lokasi bisa ditekan untuk melindungi identitas peternak (rule of
          suppression). Prototipe ini menampilkan wilayah agregat, bukan
          koordinat.
        </p>
      </section>

      <section className="rounded-lg border bg-white p-4">
        <h2 className="font-semibold">Berdasar jenis ternak</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {d.bySpecies.map((s) => (
            <li key={s.species} className="flex justify-between border-b pb-1">
              <span>{s.species}</span>
              <span className="font-mono">{s.count}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="rounded border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
        Dasbor ini tidak menegaskan terjadinya luar biasa (KLB). Kluster laporan
        hanya menjadi pemicu untuk ditinjau responder berwenang; keputusan resmi
        tetap wewenang pejabat/dinas.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-stone-400">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
      {hint ? <p className="mt-1 text-xs text-stone-500">{hint}</p> : null}
    </div>
  );
}
