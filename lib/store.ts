import "server-only";

import fs from "node:fs";
import path from "node:path";
import type {
  AuditEvent,
  Db,
  EducationResource,
  Profile,
  Report,
  ReportAction,
  Region,
} from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_PATH = path.join(DATA_DIR, "db.json");

function seed(): Db {
  const now = new Date();
  const iso = (daysAgo: number) =>
    new Date(now.getTime() - daysAgo * 86400000).toISOString();

  const regions: Region[] = [
    {
      id: "rgn-sleman",
      name: "Kabupaten Sleman",
      parent_region_id: null,
      routing_contact_or_group: "UPT Puskeswan Sleman (simulasi)",
    },
    {
      id: "rgn-sleman-depok",
      name: "Kapanewon Depok",
      parent_region_id: "rgn-sleman",
      routing_contact_or_group: "UPT Puskeswan Sleman (simulasi)",
    },
    {
      id: "rgn-sleman-kalasan",
      name: "Kapanewon Kalasan",
      parent_region_id: "rgn-sleman",
      routing_contact_or_group: "UPT Puskeswan Sleman (simulasi)",
    },
    {
      id: "rgn-sleman-prambanan",
      name: "Kapanewon Prambanan",
      parent_region_id: "rgn-sleman",
      routing_contact_or_group: "UPT Puskeswan Sleman (simulasi)",
    },
  ];

  const profiles: Profile[] = [
    {
      id: "usr-responder-1",
      display_name: "Dr. Sari Wulandari (demo)",
      role: "responder",
      approved_region_id: "rgn-sleman",
      professional_verification_status: "verified",
    },
    {
      id: "usr-admin-1",
      display_name: "Admin Pilot VET-REGION",
      role: "admin",
      approved_region_id: "rgn-sleman",
      professional_verification_status: "verified",
    },
  ];

  const education_resources: EducationResource[] = [
    {
      id: "edu-1",
      title: "Biosecurity dasar untuk peternakan ayam burung",
      topic: "Biosekuritas",
      species_scope: ["ayam"],
      summary:
        "Langkah dasar biosekuritas: pisahkan ternak baru, batasi kunjungan, bersihkan kandang dan alat, dan pisahkan ternak yang terlihat sakit.",
      source_name: "Dinas Peternakan dan Kesehatan Hewan DIY",
      source_url: "https://dpkh.diy.go.id",
      reviewer: "Pengkaji Prototipe (demo)",
      reviewed_at: iso(3),
      is_published: true,
    },
    {
      id: "edu-2",
      title: "Kapan Anda perlu menghubungi dinas kesehatan hewan",
      topic: "Sikap awal",
      species_scope: ["ayam", "sapi"],
      summary:
        "Segera hubungi Puskeswan atau petugas kesehatan hewan jika ternak mati mendadak, drop feed jauh, atau ada anggota yang melirik, menyekap, atau lumpuh. Jangan menunggu sampai banyak ternak sakit.",
      source_name: "iSIKHNAS - info resmi laporan kesehatan hewan",
      source_url: "https://www.isikhnas.com (tautan resmi)",
      reviewer: "Pengkaji Prototipe (demo)",
      reviewed_at: iso(5),
      is_published: true,
    },
    {
      id: "edu-3",
      title: "Manajemen pakan mencegah masalah kesehatan ternak ruminansia",
      topic: "Manajemen pakan",
      species_scope: ["sapi"],
      summary:
        "Sapi yang pakan tiba-tiba berubah cenderung menyerang kembung atau gangguan pencernaan. Ubah pakan secara bertahap dan sediakan air bersih sepanjang waktu.",
      source_name: "FAO Indonesia (tautan contoh - ganti dengan sumber terverifikasi)",
      source_url: "https://www.fao.org/indonesia",
      reviewer: "Pengkaji Prototipe (demo)",
      reviewed_at: iso(7),
      is_published: true,
    },
  ];

  const reports: Report[] = [
    {
      id: "rep-seed-1",
      reference: "VR-2026-0031",
      created_at: iso(2),
      reporter_name: "Pak Budi (contoh)",
      reporter_contact: "08xx (contoh)",
      species: "ayam",
      observed_signs: ["mati mendadak", "leher terpuntir", "nafsu makan turun"],
      observed_signs_note: "5 ekor mati dalam dua hari. Kandang tertutup.",
      onset_at: iso(3),
      affected_count: 12,
      dead_count: 5,
      region_id: "rgn-sleman-depok",
      restricted_location_detail: "Dusun Mrican (contoh)",
      workflow_status: "Received",
      verification_status: "unverified",
      assigned_responder_id: null,
      outcome_summary: null,
      outcome_source: null,
      outcome_verified: false,
      updated_at: iso(2),
    },
    {
      id: "rep-seed-2",
      reference: "VR-2026-0028",
      created_at: iso(4),
      reporter_name: "Bu Siti (contoh)",
      reporter_contact: "08yy (contoh)",
      species: "sapi",
      observed_signs: ["nafsu makan turun", "seperti kembung"],
      observed_signs_note: null,
      onset_at: iso(5),
      affected_count: 2,
      dead_count: 0,
      region_id: "rgn-sleman-kalasan",
      restricted_location_detail: null,
      workflow_status: "Closed",
      verification_status: "reviewed",
      assigned_responder_id: "usr-responder-1",
      outcome_summary:
        "Petugas mengunjungi ternak; diduga gangguan pencernaan, saturan membaik setelah pakan diatur (sumber: petugas UPT Puskeswan, simulasi)",
      outcome_source: "responder",
      outcome_verified: true,
      updated_at: iso(1),
    },
  ];

  const report_actions: ReportAction[] = [
    {
      id: "act-1",
      report_id: "rep-seed-1",
      actor_id: "reporter",
      actor_name: "Pelapor (contoh)",
      action_type: "submitted",
      note: "Laporan awal dibuat.",
      created_at: iso(2),
    },
    {
      id: "act-2",
      report_id: "rep-seed-1",
      actor_id: "usr-responder-1",
      actor_name: "Dr. Sari Wulandari (demo)",
      action_type: "received",
      note: "Akan mengontak pelapor untuk detail lokasi.",
      created_at: iso(2),
    },
    {
      id: "act-3",
      report_id: "rep-seed-2",
      actor_id: "reporter",
      actor_name: "Pelapor (contoh)",
      action_type: "submitted",
      note: "Laporan awal dibuat.",
      created_at: iso(4),
    },
    {
      id: "act-4",
      report_id: "rep-seed-2",
      actor_id: "usr-responder-1",
      actor_name: "Dr. Sari Wulandari (demo)",
      action_type: "closed",
      note: "Kunjungan selesai, kondisi membaik.",
      created_at: iso(1),
    },
  ];

  const audit_events: AuditEvent[] = [
    {
      id: "aud-1",
      actor_id: "usr-admin-1",
      event_type: "account_verified",
      target_type: "profile",
      target_id: "usr-responder-1",
      created_at: iso(10),
      metadata: null,
    },
  ];

  return {
    profiles,
    reports,
    report_actions,
    education_resources,
    regions,
    audit_events,
  };
}

function load(): Db {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf8");
    const parsed = JSON.parse(raw) as Db;
    parsed.report_actions ??= [];
    parsed.audit_events ??= [];
    return parsed;
  } catch {
    const fresh = seed();
    persist(fresh);
    return fresh;
  }
}

function persist(db: Db) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

declare global {
  var __vetregion_db: Db | undefined;
}

export function getDb(): Db {
  globalThis.__vetregion_db ??= load();
  return globalThis.__vetregion_db;
}

export function save() {
  persist(getDb());
}
