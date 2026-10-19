import Link from "next/link";
import { notFound } from "next/navigation";
import {
  STATUS_LABEL_ID,
  VERIFICATION_LABEL_ID,
  type WorkflowStatus,
} from "@/lib/types";
import { addReporterInfo } from "@/lib/actions";
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

const CURRENT_STEP = {
  "Submitted": "Laporan masuk",
  "Received": "Diterima responder",
  "Needs Information": "Menunggu informasi tambahan",
  "Under Review": "Sedang ditinjau",
  "Referred/Escalated": "Eskalasi ke dinas",
  "Closed": "Alur selesai",
} as const;

export default async function StatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ reference: string }>;
  searchParams: Promise<{ baru?: string; ok?: string; error?: string }>;
}) {
  const { reference } = await params;
  const { baru, ok, error } = await searchParams;
  const report = getReportByReference(reference);
  if (!report) notFound();

  const actions = getActionsForReport(report.id);
  const publicActions = actions.filter(
    (a) => !["assigned", "verification_changed"].includes(a.action_type),
  );
  const isClosed = report.workflow_status === "Closed";
  const currentIdx = ORDER.indexOf(report.workflow_status);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {baru ? (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-200 text-2xl">
            ✅
          </span>
          <p className="mt-2 font-semibold text-emerald-900">
            Laporan berhasil dikirim. Ini nomor laporan Anda:
          </p>
          <p className="mt-1 font-mono text-3xl font-bold text-emerald-900">
            {report.reference}
          </p>
          <p className="mt-1 text-sm text-emerald-900/80">
            Simpan nomor ini untuk membuka status di halaman &ldquo;Cek
            status&rdquo;.
          </p>
        </div>
      ) : null}
      {ok ? (
        <p className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm font-medium text-emerald-900">
          Informasi Anda tersimpan di riwayat tindak lanjut.
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">
          Informasi tidak bisa dikirim kosong.
        </p>
      ) : null}

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-2xl font-bold">
            Laporan <span className="font-mono">{report.reference}</span>
          </h1>
          <span className="text-sm text-stone-500">
            Dikirim: {new Date(report.created_at).toLocaleDateString("id-ID")}
          </span>
        </div>

        <div className="mt-4">
          <Badge status={report.workflow_status} />
          <p className="mt-2 text-sm font-medium">
            Tahap saat ini: {CURRENT_STEP[report.workflow_status]}
          </p>
          <p className="text-xs text-stone-600">
            Status verifikasi:{" "}
            <strong>{VERIFICATION_LABEL_ID[report.verification_status]}</strong>
          </p>
        </div>

        <ol className="mt-6 flex flex-wrap gap-2 text-xs">
          {ORDER.map((s, i) => {
            const reached = currentIdx >= i;
            return (
              <li
                key={s}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium ${
                  reached
                    ? "bg-emerald-700 text-white"
                    : "bg-stone-100 text-stone-500"
                }`}
              >
                <span
                  className={`grid size-4 place-items-center rounded-full text-[9px] ${
                    reached ? "bg-white/25" : "bg-stone-200"
                  }`}
                >
                  {i + 1}
                </span>
                {STATUS_LABEL_ID[s]}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">Rincian laporan</h2>
        <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <Item label="Ternak" value={report.species} />
          <Item label="Wilayah (umum)" value={getRegionName(report.region_id)} />
          <Item
            label="Perkiraan jumlah terkena"
            value={
              report.affected_count != null ? String(report.affected_count) : "-"
            }
          />
          <Item
            label="Perkiraan jumlah mati"
            value={report.dead_count != null ? String(report.dead_count) : "-"}
          />
          <Item
            label="Tanda yang dilaporkan"
            value={report.observed_signs.join(", ") || "-"}
          />
          {report.observed_signs_note ? (
            <Item label="Catatan pelapor" value={report.observed_signs_note} />
          ) : null}
        </dl>
      </div>

      {!isClosed && (
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold">Tandai bahwa Anda menambahkan informasi</h2>
          <p className="mt-1 text-sm text-stone-600">
            Responder mungkin meminta data tambahan. Anda bisa mencatat kutipan
            jawaban Anda agar ada dalam riwayat.
          </p>
          <form action={addReporterInfo} className="mt-3 space-y-2">
            <input type="hidden" name="reference" value={report.reference} />
            <input
              name="from_name"
              placeholder="Nama panggilan Anda"
              className="input-el w-full"
            />
            <textarea
              name="information"
              rows={2}
              required
              placeholder="mis. 'Saya sudah memisahkan ayam yang sakit ke kandang laut'"
              className="input-el w-full"
            />
            <button
              type="submit"
              className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Kirim informasi
            </button>
          </form>
        </div>
      )}

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">Riwayat tindak lanjut</h2>
        <Timeline
          items={publicActions.map((a) => ({
            id: a.id,
            title: PUBLIC_ACTION_LABEL[a.action_type] ?? a.action_type,
            note: a.note,
            when: new Date(a.created_at).toLocaleString("id-ID"),
            actor: a.actor_name,
          }))}
        />
      </div>

      {report.outcome_summary ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-sm">
          <h2 className="font-semibold text-emerald-900">Hasil (dalam uji coba)</h2>
          <p className="mt-1 text-sm">{report.outcome_summary}</p>
          <p className="mt-1 text-xs text-stone-600">
            Sumber: {report.outcome_source ?? "-"} ·{" "}
            {report.outcome_verified
              ? "Hasil ini berasal dari pihak yang diberi wewenang."
              : "Hasil belum diverifikasi."}
          </p>
        </div>
      ) : null}

      <div className="text-center text-sm">
        <Link href="/" className="font-medium text-emerald-700 hover:underline">
          ← Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}

const PUBLIC_ACTION_LABEL: Record<string, string> = {
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

const BADGE_STYLE: Record<WorkflowStatus, string> = {
  "Submitted": "bg-stone-200 text-stone-800",
  "Received": "bg-blue-100 text-blue-800",
  "Needs Information": "bg-amber-100 text-amber-900",
  "Under Review": "bg-indigo-100 text-indigo-900",
  "Referred/Escalated": "bg-purple-100 text-purple-900",
  "Closed": "bg-emerald-100 text-emerald-900",
};

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-stone-500">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Timeline({
  items,
}: {
  items: {
    id: string;
    title: string;
    note: string | null;
    when: string;
    actor: string;
  }[];
}) {
  return (
    <ol className="mt-3 space-y-0">
      {items.map((item, i) => (
        <li key={item.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-emerald-600" />
            {i < items.length - 1 ? (
              <span className="w-px flex-1 bg-stone-200" />
            ) : null}
          </div>
          <div className="pb-5">
            <p className="text-sm font-semibold">{item.title}</p>
            {item.note ? (
              <p className="mt-0.5 text-sm text-stone-600">{item.note}</p>
            ) : null}
            <p className="mt-0.5 text-xs text-stone-500">
              {item.when} — {item.actor}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Badge({ status }: { status: WorkflowStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${BADGE_STYLE[status]}`}
    >
      {STATUS_LABEL_ID[status]}
    </span>
  );
}
