"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, requireResponder } from "@/lib/auth";
import { getDb, save } from "@/lib/store";
import type { Report, ReportAction, VerificationStatus, WorkflowStatus } from "@/lib/types";

function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function makeReference(dbReports: Report[]): string {
  const year = new Date().getFullYear();
  const seq = 1000 + dbReports.length + 1;
  return `VR-${year}-${seq}`;
}

const VALID_TRANSITIONS: Record<WorkflowStatus, WorkflowStatus[]> = {
  Submitted: ["Received", "Needs Information", "Under Review", "Referred/Escalated"],
  Received: ["Needs Information", "Under Review", "Referred/Escalated", "Closed"],
  "Needs Information": ["Received", "Under Review", "Referred/Escalated", "Closed"],
  "Under Review": ["Needs Information", "Received", "Referred/Escalated", "Closed"],
  "Referred/Escalated": ["Under Review", "Received", "Closed"],
  Closed: [],
};

function canTransition(from: WorkflowStatus, to: WorkflowStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

/* -------------------------------- session --------------------------------- */

export async function signIn(formData: FormData) {
  const userId = String(formData.get("user_id") ?? "");
  const db = getDb();
  const profile = db.profiles.find((p) => p.id === userId);
  if (!profile) redirect("/masuk?error=1");

  const store = await cookies();
  store.set(SESSION_COOKIE, profile.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  db.audit_events.push({
    id: newId("aud"),
    actor_id: profile.id,
    event_type: "signed_in",
    target_type: "profile",
    target_id: profile.id,
    created_at: nowIso(),
    metadata: null,
  });
  save();

  redirect(profile.role === "admin" ? "/dashboard" : "/responder");
}

/* ------------------------------ reporter flow ---------------------------- */

export async function submitReport(formData: FormData) {
  const db = getDb();

  const species = String(formData.get("species") ?? "");
  const signs = formData.getAll("observed_signs").map(String);
  const signsNote = String(formData.get("observed_signs_note") ?? "").trim();
  const onsetAt = String(formData.get("onset_at") ?? "") || null;
  const affectedRaw = String(formData.get("affected_count") ?? "").trim();
  const deadRaw = String(formData.get("dead_count") ?? "").trim();
  const regionId = String(formData.get("region_id") ?? "");
  const locationDetail = String(formData.get("location_detail") ?? "").trim();
  const reporterName = String(formData.get("reporter_name") ?? "").trim();
  const reporterContact = String(formData.get("reporter_contact") ?? "").trim();
  const consent = formData.get("consent");

  if (!species || !regionId || !consent || (signs.length === 0 && !signsNote)) {
    redirect("/lapor?error=1");
  }

  const now = nowIso();
  const report: Report = {
    id: newId("rep"),
    reference: makeReference(db.reports),
    created_at: now,
    reporter_name: reporterName || null,
    reporter_contact: reporterContact || null,
    species,
    observed_signs: signs,
    observed_signs_note: signsNote || null,
    onset_at: onsetAt,
    affected_count:
      affectedRaw && affectedRaw !== "unknown" ? Number(affectedRaw) : null,
    dead_count: deadRaw && deadRaw !== "unknown" ? Number(deadRaw) : null,
    region_id: regionId,
    restricted_location_detail: locationDetail || null,
    workflow_status: "Submitted",
    verification_status: "unverified",
    assigned_responder_id: null,
    outcome_summary: null,
    outcome_source: null,
    outcome_verified: false,
    updated_at: now,
  };

  db.reports.push(report);
  db.report_actions.push({
    id: newId("act"),
    report_id: report.id,
    actor_id: "reporter",
    actor_name: reporterName || "Pelapor",
    action_type: "submitted",
    note: "Laporan pertama kali dibuat.",
    created_at: now,
  });
  db.audit_events.push({
    id: newId("aud"),
    actor_id: "reporter",
    event_type: "report_submitted",
    target_type: "report",
    target_id: report.id,
    created_at: now,
    metadata: { region_id: regionId, species },
  });
  save();

  redirect(`/status/${report.reference}?baru=1`);
}

/* --------------------------- responder/admin flow -------------------------- */

function logAction(
  db: ReturnType<typeof getDb>,
  report: Report,
  actorId: string,
  actorName: string,
  actionType: ReportAction["action_type"],
  note: string | null,
) {
  const now = nowIso();
  db.report_actions.push({
    id: newId("act"),
    report_id: report.id,
    actor_id: actorId,
    actor_name: actorName,
    action_type: actionType,
    note,
    created_at: now,
  });
  db.audit_events.push({
    id: newId("aud"),
    actor_id: actorId,
    event_type: actionType,
    target_type: "report",
    target_id: report.id,
    created_at: now,
    metadata: null,
  });
  report.updated_at = now;
}

export async function updateReport(formData: FormData) {
  let session;
  try {
    session = await requireResponder();
  } catch {
    redirect("/masuk?Alamat%20ini%20khusus%20responder=1");
  }

  const formDataRef = String(formData.get("reference") ?? "");
  const db = getDb();
  const report = db.reports.find((r) => r.reference === formDataRef);
  if (!report) redirect("/responder?error=tidak-ditemukan");

  const nextStatus = String(formData.get("workflow_status") ?? "");
  const nextVerificationRaw = String(formData.get("verification_status") ?? "");
  const assignTo = String(formData.get("assign_to") ?? "");
  const note = String(formData.get("note") ?? "").trim();
  const outcomeSummary = String(formData.get("outcome_summary") ?? "").trim();
  const outcomeSource = String(formData.get("outcome_source") ?? "").trim();

  let changed = false;

  if (nextStatus && nextStatus !== report.workflow_status) {
    const target = nextStatus as WorkflowStatus;
    if (!canTransition(report.workflow_status, target)) {
      redirect(`/responder/${report.reference}?error=transisi-tidak-valid`);
    }
    logAction(
      db,
      report,
      session.id,
      session.display_name,
      target === "Closed" ? "closed" : "status_changed",
      note || `Status diubah: ${report.workflow_status} -> ${target}`,
    );
    report.workflow_status = target;
    changed = true;
  }

  if (nextVerificationRaw && nextVerificationRaw !== report.verification_status) {
    logAction(
      db,
      report,
      session.id,
      session.display_name,
      "verification_changed",
      note || `Status verifikasi diubah menjadi: ${nextVerificationRaw}`,
    );
    report.verification_status = nextVerificationRaw as VerificationStatus;
    changed = true;
  }

  if (assignTo && assignTo !== (report.assigned_responder_id ?? "")) {
    const targetProfile = db.profiles.find((p) => p.id === assignTo);
    if (targetProfile) {
      logAction(
        db,
        report,
        session.id,
        session.display_name,
        "assigned",
        note || `Ditugaskan ke ${targetProfile.display_name}`,
      );
      report.assigned_responder_id = targetProfile.id;
      changed = true;
    }
  }

  if (outcomeSummary && outcomeSummary !== (report.outcome_summary ?? "")) {
    report.outcome_summary = outcomeSummary;
    report.outcome_source = outcomeSource || "responder";
    changed = true;
  }

  if (note && !changed) {
    logAction(db, report, session.id, session.display_name, "note", note);
  }

  if (!changed && !note) {
    redirect(`/responder/${report.reference}?error=kosong`);
  }

  save();
  redirect(`/responder/${report.reference}?ok=1`);
}

export async function addReporterInfo(formData: FormData) {
  const ref = String(formData.get("reference") ?? "");
  const info = String(formData.get("information") ?? "").trim();
  const name = String(formData.get("from_name") ?? "").trim() || "Pelapor";
  const db = getDb();
  const report = db.reports.find((r) => r.reference === ref);
  if (!report || !info) {
    redirect(`/status/${ref}?error=info-kosong`);
  }
  const now = nowIso();
  db.report_actions.push({
    id: newId("act"),
    report_id: report.id,
    actor_id: "reporter",
    actor_name: name,
    action_type: "information_added",
    note: info,
    created_at: now,
  });
  db.audit_events.push({
    id: newId("aud"),
    actor_id: "reporter",
    event_type: "information_added",
    target_type: "report",
    target_id: report.id,
    created_at: now,
    metadata: null,
  });
  report.updated_at = now;
  save();
  redirect(`/status/${report.reference}?ok=1`);
}

export async function signOut() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/");
}

export async function lookupReference(formData: FormData) {
  const ref = String(formData.get("reference") ?? "").trim();
  if (!ref) redirect("/cek?error=1");
  const db = getDb();
  const report = db.reports.find(
    (r) => r.reference.toLowerCase() === ref.toLowerCase(),
  );
  if (!report) redirect(`/cek?error=1&ref=${encodeURIComponent(ref)}`);
  redirect(`/status/${report.reference}`);
}
