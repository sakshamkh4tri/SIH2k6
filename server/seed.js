import bcrypt from "bcryptjs";

const now = new Date().toISOString();
const dateIn = (days) => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);

export async function createSeed() {
  return {
    users: [{ id: "user-admin", name: "System Administrator", email: "admin@projectpulse.local", passwordHash: await bcrypt.hash("ChangeMe123!", 10), role: "admin", createdAt: now }],
    projects: [
      { id: "P104", name: "Pune Metro Line 4 Expansion Corridor", department: "Urban Dev & Metro Rail Dept", location: "Pune, Maharashtra", status: "Delayed", risk: "Critical", budgetCr: 6190, releasedCr: 4210, physicalProgress: 44, targetProgress: 68, scheduleLagDays: 32, estimatedCompletion: "2026-10-31", revisedCompletion: "2026-12-31", createdAt: now, updatedAt: now },
      { id: "H26", name: "National Corridor Modernisation Programme", department: "Infrastructure Portfolio", location: "112 National Corridors", status: "At Risk", risk: "High", budgetCr: 18300, releasedCr: 12993, physicalProgress: 62, targetProgress: 83, scheduleLagDays: 21, estimatedCompletion: "2027-03-31", revisedCompletion: "2027-04-21", createdAt: now, updatedAt: now },
      { id: "P221", name: "Bhuvan Urban Transit Link", department: "Transport & Highways", location: "Bengaluru, Karnataka", status: "In Progress", risk: "Medium", budgetCr: 2760, releasedCr: 2042, physicalProgress: 77, targetProgress: 85, scheduleLagDays: 8, estimatedCompletion: "2026-08-31", revisedCompletion: null, createdAt: now, updatedAt: now }
    ],
    milestones: [
      { id: "ms-1", projectId: "P104", name: "Civil works", plannedProgress: 68, actualProgress: 52, status: "In Progress", dueDate: dateIn(20), createdAt: now },
      { id: "ms-2", projectId: "P104", name: "Viaduct packages", plannedProgress: 62, actualProgress: 41, status: "At Risk", dueDate: dateIn(12), createdAt: now },
      { id: "ms-3", projectId: "P104", name: "Station structures", plannedProgress: 52, actualProgress: 37, status: "At Risk", dueDate: dateIn(35), createdAt: now },
      { id: "ms-4", projectId: "P104", name: "Systems integration", plannedProgress: 30, actualProgress: 18, status: "Not Started", dueDate: dateIn(80), createdAt: now }
    ],
    auditSignals: [
      { id: "sig-1", projectId: "P104", severity: "Critical", message: "Fund release ahead of work output", status: "Open", createdAt: now },
      { id: "sig-2", projectId: "P104", severity: "High", message: "Contractor productivity below baseline", status: "Open", createdAt: now },
      { id: "sig-3", projectId: "P104", severity: "High", message: "Milestone #4 forecast overdue", status: "Open", createdAt: now },
      { id: "sig-4", projectId: "P104", severity: "Medium", message: "Design approval dependency", status: "Open", createdAt: now }
    ],
    alerts: [
      { id: "alert-1", projectId: "P104", title: "Suspicious disbursement: Metro Line 4", description: "Financial disbursement leads physical execution by 24%.", severity: "Critical", status: "Open", createdAt: now, resolvedAt: null },
      { id: "alert-2", projectId: "P221", title: "Contractor productivity variance", description: "Physical output is 11% below baseline for two consecutive cycles.", severity: "High", status: "Open", createdAt: now, resolvedAt: null },
      { id: "alert-3", projectId: "H26", title: "Milestone dependency risk", description: "Approval dependency may delay the next corridor package.", severity: "Medium", status: "Open", createdAt: now, resolvedAt: null }
    ],
    progressUpdates: [],
    conversations: []
  };
}
