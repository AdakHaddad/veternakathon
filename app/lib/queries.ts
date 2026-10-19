import "server-only";

import { getDb } from "./store";
import type { Region, WorkflowStatus } from "./types";

export function getRegions(): Region[] {
  return getDb().regions;
}

export function getRegionName(regionId: string): string {
  const r = getDb().regions.find((x) => x.id === regionId);
  return r?.name ?? regionId;
}

export function getReportByReference(reference: string) {
  return getDb().reports.find((r) => r.reference === reference) ?? null;
}

export function getActionsForReport(reportId: string) {
  return getDb()
    .report_actions.filter((a) => a.report_id === reportId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export function getOpenQueue() {
  const db = getDb();
  const openStatuses: WorkflowStatus[] = [
    "Submitted",
    "Received",
    "Needs Information",
    "Under Review",
    "Referred/Escalated",
  ];
  return db.reports
    .filter(
      (r) =>
        openStatuses.includes(r.workflow_status) &&
        r.region_id.startsWith("rgn-sleman"),
    )
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export type DashboardData = {
  total: number;
  byStatus: Map<WorkflowStatus, number>;
  unverified: number;
  confirmed: number;
  bySpecies: { species: string; count: number }[];
  byRegion: { region: Region; count: number; unverified: number }[];
};

export function getDashboard(): DashboardData {
  const db = getDb();
  const byStatus = new Map<WorkflowStatus, number>();
  const speciesCount = new Map<string, number>();

  for (const r of db.reports) {
    byStatus.set(r.workflow_status, (byStatus.get(r.workflow_status) ?? 0) + 1);
    speciesCount.set(r.species, (speciesCount.get(r.species) ?? 0) + 1);
  }

  const regions = db.regions.filter((r) => r.parent_region_id === "rgn-sleman");
  const byRegion = regions.map((region) => {
    const reports = db.reports.filter((r) => r.region_id === region.id);
    return {
      region,
      count: reports.length,
      unverified: reports.filter((r) => r.verification_status === "unverified")
        .length,
    };
  });

  return {
    total: db.reports.length,
    byStatus,
    unverified: db.reports.filter((r) => r.verification_status === "unverified")
      .length,
    confirmed: db.reports.filter((r) => r.verification_status === "confirmed")
      .length,
    bySpecies: [...speciesCount.entries()].map(([species, count]) => ({
      species,
      count,
    })),
    byRegion,
  };
}

export function getPublishedEducation() {
  return getDb().education_resources.filter((e) => e.is_published);
}

export function getEducationById(id: string) {
  return getDb().education_resources.find((e) => e.id === id) ?? null;
}
