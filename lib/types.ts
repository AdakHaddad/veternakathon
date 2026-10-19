export type WorkflowStatus =
  | "Submitted"
  | "Received"
  | "Needs Information"
  | "Under Review"
  | "Referred/Escalated"
  | "Closed";

export const WORKFLOW_STATUSES: WorkflowStatus[] = [
  "Submitted",
  "Received",
  "Needs Information",
  "Under Review",
  "Referred/Escalated",
  "Closed",
];

export const STATUS_LABEL_ID: Record<WorkflowStatus, string> = {
  "Submitted": "Terkirim",
  "Received": "Diterima",
  "Needs Information": "Perlu Informasi",
  "Under Review": "Ditinjau",
  "Referred/Escalated": "Dirujuk/Eskalasi",
  "Closed": "Ditutup",
};

export type VerificationStatus =
  | "unverified"
  | "reviewed"
  | "confirmed"
  | "not confirmed"
  | "unable to determine";

export const VERIFICATION_LABEL_ID: Record<VerificationStatus, string> = {
  "unverified": "Belum terverifikasi",
  "reviewed": "Sudah ditinjau",
  "confirmed": "Dikonfirmasi oleh sumber resmi",
  "not confirmed": "Tidak terkonfirmasi",
  "unable to determine": "Tidak dapat dipastikan",
};

export type Role = "reporter" | "responder" | "admin";

export type Profile = {
  id: string;
  display_name: string;
  role: Role;
  approved_region_id: string | null;
  professional_verification_status: "unverified" | "verified";
};

export type Report = {
  id: string;
  reference: string;
  created_at: string;
  reporter_name: string | null;
  reporter_contact: string | null;
  species: string;
  observed_signs: string[];
  observed_signs_note: string | null;
  onset_at: string | null;
  affected_count: number | null;
  dead_count: number | null;
  region_id: string;
  restricted_location_detail: string | null;
  workflow_status: WorkflowStatus;
  verification_status: VerificationStatus;
  assigned_responder_id: string | null;
  outcome_summary: string | null;
  outcome_source: string | null;
  outcome_verified: boolean;
  updated_at: string;
};

export type ReportAction = {
  id: string;
  report_id: string;
  actor_id: string;
  actor_name: string;
  action_type:
    | "submitted"
    | "received"
    | "needs_information"
    | "information_added"
    | "under_review"
    | "referred"
    | "closed"
    | "note"
    | "assigned"
    | "status_changed"
    | "verification_changed";
  note: string | null;
  created_at: string;
};

export type EducationResource = {
  id: string;
  title: string;
  topic: string;
  species_scope: string[];
  summary: string;
  source_name: string;
  source_url: string;
  reviewer: string;
  reviewed_at: string;
  is_published: boolean;
};

export type Region = {
  id: string;
  name: string;
  parent_region_id: string | null;
  routing_contact_or_group: string | null;
};

export type AuditEvent = {
  id: string;
  actor_id: string;
  event_type: string;
  target_type: string;
  target_id: string;
  created_at: string;
  metadata: Record<string, unknown> | null;
};

export type Db = {
  profiles: Profile[];
  reports: Report[];
  report_actions: ReportAction[];
  education_resources: EducationResource[];
  regions: Region[];
  audit_events: AuditEvent[];
};
