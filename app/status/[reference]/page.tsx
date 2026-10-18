import Link from "next/link";
import { notFound } from "next/navigation";
import {
  STATUS_LABEL_ID,
  VERIFICATION_LABEL_ID,
  type WorkflowStatus,
} from "@/lib/types";
import {
  getActionsForReport,
  getRegionName,
  getReportByReference,
} from "@/lib/queries";

const ORDER: WorkflowStatus[] = [
  "Submitted",
  "Received",
  "Needs Information",
  "Under Review",
  "Referred/Escalated",
  "Closed",
];

export default async function StatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ reference: string }>;
  searchParams: Promise<{ baru?: string }>;
}) {
  const { reference } = await params;
  const { baru } = await searchParams;
  const report = getReportByReference(reference);
  if (!report) notFound();

  const actions = getActionsForReport(report.id);
  const publicActions = actions.filter(
    (a) => !["assigned", "verification_changed"].includes(a.action_type),
  );
  const isClosed = report.workflow_status === "Closed";

  return (
    <div className="space-y-5">
      {baru ? (
        <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4">
          <p className="font-semibold text-emerald-900">
            Laporan berhasil dikirim. Ini nomor laporan Anda:
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-emerald-900">
            {report.reference}
          </p>
          <p className="mt-1 text-sm text-emerald-900/80">
            Simpan nomor ini. PEMANTAUAN STATUS: Anda bisa kembali ke beranda
            dan buka tautan &ldquo;Cek status&rdquo; dengan nomor ini.
          </p>
        </div>
      ) : null}

      <div className="rounded-lg border bg-white p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-xl font-bold">
            Laporan{" "}
            <span className="font-mono">{report.reference}</span>
          </h1>
          <span className="text-sm text-stone-500">
            Dikirim: {new Date(report.created_at).toLocaleDateString("id-ID")}
          </span>
        </div>

        <div className="mt-4 space-y-1 text-sm">
          <p>
            Status: <Badge status={report.workflow_status} />
          </p>
          <p>
            Status verifikasi:{" "}
            <span className="font-medium">
              {VERIFICATION_LABEL_ID[report.verification_status]}
            </span>{" "}
            <span className="text-stone-500">
              (laporan warga belum otomatis dianggap terkonfirmasi)
            </span>
          </p>
        </div>

        <ol className="mt-4 flex flex-wrap gap-1 text-xs">
          {ORDER.map((s, i) => {
            const reached = ORDER.indexOf(report.workflow_status) >= i;
            return (
              <li
                key={s}
                className={`rounded px-2 py-1 ${
                  reached
                    ? "bg-emerald-700 text-white"
                    : "bg-stone-200 text-stone-600"
                }`}
              >
                {STATUS_LABEL_ID[s]}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="rounded-lg border bg-white p-5">
        <h2 className="font-semibold">Rincian laporan</h2>
        <dl className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
          <Item label="Ternak" value={report.species} />
          <Item label="Wilayah (umum)" value={getRegionName(report.region_id)} />
          <Item
            label="Perkiraan jumlah terkena"
            value={report.affected_count != null ? String(report.affected_count) : "tidak diketahui"}
          />
          <Item
            label="Perkiraan jumlah mati"
            value={report.dead_count != null ? String(report.dead_count) : "tidak diketahui"}
          />
          <Item
            label="Tanda yang dilaporkan"
            value={report.observed_signs.join(", ") || "-"}
          />
          {report.observed_signs_note ? (
            <Item label="Catatan pelapor" value={report.observed_signs_note} />
          ) : null}
        </dl>
        <p className="mt-2 text-xs text-stone-500">
          Detail lokasi dan kontak tidak ditampilkan di halaman ini.
        </p>
      </div>

      {!isClosed && (
        <div className="rounded-lg border bg-white p-5">
          <h2 className="font-semibold">Tandai bahwa Anda menambahkan informasi</h2>
          <p className="text-sm text-stone-600">
            Responder mungkin meminta data tambahan. Anda bisa mencatat kutipan
            jawaban Anda agar ada dalam riwayat.
          </p>
          {/* formviel: informant add note is a responder-only flow in this prototype */}
          <p className="mt-2 text-xs text-stone-500">
            Prototipe ini belum menerima balasan informasi dari pelapor secara
            langsung; gunakan kontak responder yang tercantum dalam status
            hasil.
          </p>
        </div>
      )}

      <div className="rounded-lg border bg-white p-5">
        <h2 className="font-semibold">Riwayat tindak lanjut</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {publicActions.map((a) => (
            <li key={a.id} className="border-b pb-2 last:border-0">
              <p className="font-medium">{STATUS_ACTION_LABEL[a.action_type] ?? a.action_type}</p>
              {a.note ? <p className="text-stone-600">{a.note}</p> : null}
              <p className="text-xs text-stone-400">
                {new Date(a.created_at).toLocaleString("id-ID")} — {a.actor_name}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {report.outcome_summary ? (
        <div className="rounded-lg border bg-white p-5">
          <h2 className="font-semibold">Hasil (dalam uji coba)</h2>
          <p className="text-sm">{report.outcome_summary}</p>
          <p className="mt-1 text-xs text-stone-500">
            Sumber: {report.outcome_source ?? "-"} ·{" "}
            {report.outcome_verified
              ? "Hasil ini berasal dari pihak yang diberi wewenang."
              : "Hasil belum diverifikasi."}
          </p>
        </div>
      ) : null}

      <div className="text-sm">
        <Link href="/" className="text-emerald-700 hover:underline">
          ← Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}

const STATUS_ACTION_LABEL: Record<string, string> = {
  submitted: "Laporan dibuat",
  received: "Diterima responder",
  needs_information: "Meminta informasi tambahan",
  information_added: "Informasi ditambahkan",
  under_review: "Sedang ditinjau",
  referred: "Dirujuk/eskalasi",
  closed: "Alur ditutup",
  note: "Catatan",
  status_changed: "Status diperbarui",
};

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-stone-400">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Badge({ status }: { status: WorkflowStatus }) {
  const style: Record<WorkflowStatus, string> = {
    "Submitted": "bg-stone-200 text-stone-800",
    "Received": "bg-blue-100 text-blue-800",
    "Needs Information": "bg-amber-100 text-amber-900",
    "Under Review": "bg-indigo-100 text-indigo-900",
    "Referred/Escalated": "bg-purple-100 text-purple-900",
    "Closed": "bg-emerald-100 text-emerald-900",
  };
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium ${style[status]}`}>
      {STATUS_LABEL_ID[status]}
    </span>
  );
}
