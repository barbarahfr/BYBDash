/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RankingType = 'A' | 'B' | 'C' | 'D';
export type MarketApproachType = 'B2B' | 'B2C';
export type ClientStatusType = 'Active' | 'Paused' | 'Onboarding' | 'Inactive';

export interface Responsibles {
  serviceLiaison: string; // Responsible for the service / Account Manager
  writer: string;
  designer: string;
  paidTrafficHandler: string;
  socialMedia: string; // Social Media Analyst / Representative
}

export interface Client {
  id: string;
  name: string;
  status: ClientStatusType;
  ranking: RankingType;
  responsibles: Responsibles;
  contactEmail: string;
  marketApproach: MarketApproachType;
  segment: string;
  communicationObjectives: string;
  driveFolderLink: string;
  annualPlanningLink: string;
  scope: { [departmentId: string]: string[] }; // Map of departmentId -> Array of active taskIds
  createdAt: string;
  notes: string;
  satisfactionRating?: number; // 1 to 5 scale
  customFields?: { [columnId: string]: any }; // Dynamic values for custom columns
}

export interface CustomColumn {
  id: string;
  name: string;
  type: 'text' | 'link' | 'dropdown' | 'multiselect';
  options?: string[]; // Options list for dropdown or multiselect
}

export interface Task {
  id: string;
  name: string;
  description: string;
}

export interface Department {
  id: string;
  name: string;
  color: string; // e.g., 'blue', 'purple', 'emerald', 'amber', 'rose'
  tasks: Task[];
}

export interface Team {
  id: string;
  name: string;
  coordinatorId: string; // ID of the team member who coordinates this team
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  teamId: string; // Team ID they are assigned to
  isCoordinator: boolean; // Whether the member can be chosen as a coordinator
  supervisedDepartmentIds?: string[]; // IDs of Departments (Escopos/Setores) this coordinator manages
}
