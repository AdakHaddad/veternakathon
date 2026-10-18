import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updateReport } from "@/lib/actions";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/store";
import {
  getActionsForReport,
  getRegionName,
  getReportByReference,
} from "@/lib/queries";
import {
  STATUS_LABEL_ID,
  VERIFICATION_LABEL_ID,
  WORKFLOW_STATUSES,
  type WorkflowStatus,
} from "@/lib/types";

const TRANSITIONS: Record<WorkflowStatus, WorkflowStatus[]> = {
  Submitted: ["Received", "Needs Information", "Under Review", "Referred/Escalated"],
  Received: ["Needs Information", "Under Review", "Referred/Escalated", "Closed"],
  "Needs Information": ["Received", "Under Review", "Referred/Escalated", "Closed"],
  "Under Review": ["Needs Information", "Received", "Referred/Escalated", "Closed"],
  "Referred/Escalated": ["Under Review", "Received", "Closed"],
  Closed: [],
};

const ACTION_LABEL: Record<string, string> = {
  submitted: "Laporan dibuat",
  received: "Diterima responder",
  needs_information: "Meminta informasi tambahan",
  information_added: "Informasi ditambahkan",
  under_review: "Sedang ditinjau",
  referred: "Dirujuk/eskalasi",
  closed: "Alur ditutup",
  note: "Catatan",
  assigned: "Penugasan",
  status_changed: "Status diperbarui",
  verification_changed: "Verifikasi diperbarui",
};

export default async function ResponderReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ reference: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const session = await getSession();
  if (!session || (session.role !== "responder" && session.role !== "admin")) {
    redirect("/masuk?error=1");
  }
  const { reference } = await params;
  const { ok, error } = await searchParams;
  const report = getReportByReference(reference);
  if (!report) notFound();

  const actions = getActionsForReport(report.id);
  const responders = getDb().profiles.filter((p) => p.role === "responder");
  const targets = TRANSITIONS[report.workflow_status] ?? [];

  return (
    <div className="space-y-4">
      <div>
        <Link href="/responder" className="text-sm text-emerald-700 hover:underline">
          ← Antrean
        </Link>
        <h1 className="text-xl font-bold">
          Laporan <span className="font-mono">{report.reference}</span>
        </h1>
        <p className="text-sm text-stone-600">
          {STATUS_LABEL_ID[report.workflow_status]} · Verifikasi:{" "}
          {VERIFICATION_LABEL_ID[report.verification_status]} · Dibuat{" "}
          {new Date(report.created_at).toLocaleString("id-ID")}
        </p>
      </div>
      {ok ? (
        <p className="rounded border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900">
          Perubahan tersimpan dan tercatat di riwayat/audit.
        </p>
      ) : null}
      {error ? (
        <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error === "transisi-tidak-valid"
            ? "Perubahan status tidak diizinkan oleh alur."
            : error === "kosong"
              ? "Tidak ada perubahan yang dikirim."
              : "Ada masalah memproses permintaan."}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-lg border bg-white p-4">
          <h2 className="font-semibold">Rincian laporan</h2>
          <dl className="mt-2 space-y-1 text-sm">
            <Row label="Ternak" value={report.species} />
            <Row label="Tanda" value={report.observed_signs.join(", ") || "-"} />
            {report.observed_signs_note ? (
              <Row label="Catatan pelapor" value={report.observed_signs_note} />
            ) : null}
            <Row
              label="Awal tanda"
              value={
                report.onset_at
                  ? new Date(report.onset_at).toLocaleDateString("id-ID")
                  : "tidak diketahui"
              }
            />
            <Row
              label="Terkena / mati"
              value={`${report.affected_count ?? "tk"} / ${report.dead_count ?? "tk"}`}
            />
            <Row label="Wilayah" value={getRegionName(report.region_id)} />
            <Row
              label="Detail lokasi (terbatas)"
              value={report.restricted_location_detail ?? "(tidak diisi)"}
            />
            <Row label="Kontak pelapor" value={report.reporter_contact ?? "(tidak diisi)"} />
          </dl>
          <p className="mt-2 text-xs text-stone-500">
            Data Batasi ini hanya untuk kebutuhan operasional. Jangan
            memperlihatkan di muka umum. Laporan itu masih data SIMULASI.
          </p>
        </section>

        <section className="rounded-lg border bg-white p-4">
          <h2 className="font-semibold">Update laporan</h2>
          <form action={updateReport} className="mt-2 space-y-3 text-sm">
            <input type="hidden" name="reference" value={report.reference} />
            <div>
              <label className="font-medium">Status alur</label>
              <select
                name="workflow_status"
                defaultValue=""
                className="mt-1 w-full rounded border p-2"
              >
                <option value="">(tidak diubah)</option>
                {WORKFLOW_STATUSES.filter((s) => s !== report.workflow_status).map(
                  (s) => (
                    <option key={s} value={s} disabled={!targets.includes(s)}>
                      {STATUS_LABEL_ID[s]}
                      {targets.includes(s) ? "" : " (tidak diizinkan)"}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div>
              <label className="font-medium">Status verifikasi</label>
              <select
                name="verification_status"
                defaultValue=""
                className="mt-1 w-full rounded border p-2"
              >
                <option value="">(tidak diubah)</option>
                <option value="unverified">Belum terverifikasi</option>
                <option value="reviewed">Sudah ditinjau</option>
                <option value="confirmed">Dikonfirmasi oleh sumber resmi</option>
                <option value="not confirmed">Tidak terkonfirmasi</option>
                <option value="unable to determine">Tidak dapat dipastikan</option>
              </select>
            </div>
            <div>
              <label className="font-medium">Assign ke responder</label>
              <select
                name="assign_to"
                defaultValue=""
                className="mt-1 w-full rounded border p-2"
              >
                <option value="">(tidak diubah)</option>
                {responders.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.display_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-medium">Catatan tindakan</label>
              <textarea
                name="note"
                rows={2}
                placeholder="mis. 'Akan melakukan kunjungan Kamis', 'Meminta foto kandang'"
                className="mt-1 w-full rounded border p-2"
              />
            </div>
            <div>
              <label className="font-medium">
                Ringkasan hasil (opsional; sumber dicatat)
              </label>
              <input
                name="outcome_summary"
                placeholder="mis. hasil pemeriksaan lapangan"
                className="mt-1 w-full rounded border p-2"
              />
              <input
                name="outcome_source"
                placeholder="sumber, mis. responder UPT Puskeswan"
                className="mt-1 w-full rounded border p-2"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800"
            >
              Simpan perubahan
            </button>
            <p className="text-xs text-stone-500">
              Perubahan dan siapa yang mengubahnya (actor) tercatat lengkap di
              riwayat dan audit.
            </p>
          </form>
        </section>
      </div>

      <section className="rounded-lg border bg-white p-4">
        <h2 className="font-semibold">Riwayat tindakan</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {actions.map((a) => (
            <li key={a.id} className="border-b pb-2 last:border-0">
              <p className="font-medium">{ACTION_LABEL[a.action_type] ?? a.action_type}</p>
              {a.note ? <p className="text-stone-600">{a.note}</p> : null}
              <p className="text-xs text-stone-400">
                {new Date(a.created_at).toLocaleString("id-ID")} — {a.actor_name}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="w-40 shrink-0 text-xs uppercase tracking-wide text-stone-400">
        {label}
      </span>
      <span>{value}</span>
    </div>
  );
}
