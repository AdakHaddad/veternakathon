import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDashboard } from "@/lib/queries";
import { STATUS_LABEL_ID, WORKFLOW_STATUSES } from "@/lib/types";

const STATUS_COLOR: Record<string, string> = {
  "Submitted": "bg-stone-400",
  "Received": "bg-blue-500",
  "Needs Information": "bg-amber-500",
  "Under Review": "bg-indigo-500",
  "Referred/Escalated": "bg-purple-500",
  "Closed": "bg-emerald-600",
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session || (session.role !== "responder" && session.role !== "admin")) {
    redirect("/masuk?error=1");
  }
  const d = getDashboard();
  const byStatusList = WORKFLOW_STATUSES.map((s) => ({
    status: s,
    count: d.byStatus.get(s) ?? 0,
  }));
  const maxStatus = Math.max(1, ...byStatusList.map((b) => b.count));
  const maxRegion = Math.max(1, ...d.byRegion.map((r) => r.count));
  const maxSpecies = Math.max(1, ...d.bySpecies.map((s) => s.count));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dasbor wilayah</h1>
        <p className="mt-1 text-sm text-stone-600">
          Login sebagai <strong>{session.display_name}</strong> · Wilayah
          kewenangan: Kabupaten Sleman (pilot)
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Total laporan"
          value={d.total}
          icon="📋"
          tint="bg-emerald-100"
        />
        <Stat
          label="Belum terverifikasi"
          value={d.unverified}
          hint="Laporan warga, belum ditinjau responder"
          icon="⏳"
          tint="bg-amber-100"
        />
        <Stat
          label="Dikonfirmasi resmi"
          value={d.confirmed}
          hint="Dari pihak berwenang"
          icon="✅"
          tint="bg-blue-100"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Berdasar status</h2>
          <ul className="mt-3 space-y-3">
            {byStatusList.map(({ status, count }) => (
              <li key={status}>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-700">{STATUS_LABEL_ID[status]}</span>
                  <span className="font-mono font-medium">{count}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className={`h-full rounded-full ${STATUS_COLOR[status]}`}
                    style={{ width: `${(count / maxStatus) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Berdasar sub-wilayah</h2>
          <ul className="mt-3 space-y-3">
            {d.byRegion.map((r) => (
              <li key={r.region.id}>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-700">{r.region.name}</span>
                  <span className="text-xs text-stone-500">
                    {r.unverified} belum verif.
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-100">
                    <div
                      className="h-full rounded-full bg-emerald-600"
                      style={{ width: `${(r.count / maxRegion) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right font-mono text-sm">{r.count}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">Berdasar jenis ternak</h2>
        <ul className="mt-3 space-y-3">
          {d.bySpecies.map((s) => (
            <li key={s.species}>
              <div className="flex justify-between text-sm">
                <span className="text-stone-700">
                  {s.species === "ayam" ? "🐤 Ayam" : "🐄 Sapi"}
                </span>
                <span className="font-mono font-medium">{s.count}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-full rounded-full bg-stone-700"
                  style={{ width: `${(s.count / maxSpecies) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  icon,
  tint,
}: {
  label: string;
  value: number;
  hint?: string;
  icon: string;
  tint: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          {label}
        </p>
        <span className={`grid size-8 place-items-center rounded-lg ${tint}`}>
          {icon}
        </span>
      </div>
      <p className="mt-1 text-3xl font-bold">{value}</p>
      {hint ? <p className="mt-1 text-xs text-stone-500">{hint}</p> : null}
    </div>
  );
}
