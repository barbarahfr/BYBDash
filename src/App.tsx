/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Client, Department, Task, Team, TeamMember, CustomColumn } from './types';
import { INITIAL_DEPARTMENTS, INITIAL_CLIENTS, INITIAL_TEAMS, INITIAL_TEAM_MEMBERS, INITIAL_CUSTOM_COLUMNS } from './initialData';
import DashboardStats from './components/DashboardStats';
import ClientDirectoryTable from './components/ClientDirectoryTable';
import ScopeMatrixTable from './components/ScopeMatrixTable';
import DepartmentTemplateManager from './components/DepartmentTemplateManager';
import ClientFormModal from './components/ClientFormModal';
import BentoClientDashboard from './components/BentoClientDashboard';
import TeamManager from './components/TeamManager';
import CollaboratorProfileModal from './components/CollaboratorProfileModal';
import { 
  FolderGit, 
  Layers, 
  Settings2, 
  Download, 
  Upload, 
  HelpCircle, 
  Database,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileSpreadsheet,
  Grid,
  Users
} from 'lucide-react';

export default function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [customColumns, setCustomColumns] = useState<CustomColumn[]>([]);
  
  // Dashboard Tab state
  const [activeTab, setActiveTab] = useState<'bento' | 'directory' | 'matrix' | 'departments' | 'team'>('bento');

  // Collaborator Profile modal states
  const [selectedCollaborator, setSelectedCollaborator] = useState<TeamMember | null>(null);
  const [isCollaboratorModalOpen, setIsCollaboratorModalOpen] = useState(false);
  const [collaboratorToEdit, setCollaboratorToEdit] = useState<TeamMember | null>(null);

  const handleViewCollaboratorByName = (name: string) => {
    if (!name || name === '—' || name === 'Unassigned' || name === 'Unassigned responsible') return;
    const member = teamMembers.find(m => m.name.toLowerCase().trim() === name.toLowerCase().trim());
    if (member) {
      setSelectedCollaborator(member);
      setIsCollaboratorModalOpen(true);
    }
  };

  const handleEditCollaboratorFromModal = (member: TeamMember) => {
    setCollaboratorToEdit(member);
    setIsCollaboratorModalOpen(false);
    setActiveTab('team');
  };

  // Highlight spotlight client selection inside Bento Grid block
  const [selectedClientId, setSelectedClientId] = useState<string>('');

  // Client Modal Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // File import raw notifications
  const [importNotification, setImportNotification] = useState<{ text: string; isError: boolean } | null>(null);

  // 1. Initial State Hydration on Mount
  useEffect(() => {
    try {
      const cachedClients = localStorage.getItem('byb_agency_clients');
      const cachedDepts = localStorage.getItem('byb_agency_departments');
      const cachedTeams = localStorage.getItem('byb_agency_teams');
      const cachedMembers = localStorage.getItem('byb_agency_team_members');
      const cachedCustomCols = localStorage.getItem('byb_agency_custom_columns');

      if (cachedCustomCols) {
        setCustomColumns(JSON.parse(cachedCustomCols));
      } else {
        setCustomColumns(INITIAL_CUSTOM_COLUMNS);
      }

      if (cachedClients && cachedDepts) {
        let parsedClients = JSON.parse(cachedClients);
        let parsedDepts = JSON.parse(cachedDepts);
        
        // Auto-upgrade legacy structures or force upgrade if old clients list is detected
        const hasLegacy = parsedDepts.some((d: any) => d.id === 'inbound' || d.id === 'copywrite');
        const hasOldPresetOnly = parsedClients.length <= 4 && parsedClients.some((c: any) => c.id === 'c1' || c.name === 'Aura Premium Cosmetics');
        
        if (hasLegacy || hasOldPresetOnly) {
          parsedClients = INITIAL_CLIENTS;
          parsedDepts = INITIAL_DEPARTMENTS;
          localStorage.setItem('byb_agency_clients', JSON.stringify(INITIAL_CLIENTS));
          localStorage.setItem('byb_agency_departments', JSON.stringify(INITIAL_DEPARTMENTS));
          localStorage.setItem('byb_agency_teams', JSON.stringify(INITIAL_TEAMS));
          localStorage.setItem('byb_agency_team_members', JSON.stringify(INITIAL_TEAM_MEMBERS));
          localStorage.setItem('byb_agency_custom_columns', JSON.stringify(INITIAL_CUSTOM_COLUMNS));
          
          setClients(INITIAL_CLIENTS);
          setDepartments(INITIAL_DEPARTMENTS);
          setTeams(INITIAL_TEAMS);
          setTeamMembers(INITIAL_TEAM_MEMBERS);
          setCustomColumns(INITIAL_CUSTOM_COLUMNS);
        } else {
          setClients(parsedClients);
          setDepartments(parsedDepts);
          
          let teamsList = INITIAL_TEAMS;
          let membersList = INITIAL_TEAM_MEMBERS;
          let upgradedTeams = false;
          
          if (cachedTeams) {
            try {
              const parsedTeamsList = JSON.parse(cachedTeams);
              const hasLegacyTeams = parsedTeamsList.some((t: any) => t.id === 'team_atendimento' || t.id === 'team_operacoes' || t.name === 'Atendimento & CS');
              if (hasLegacyTeams) {
                teamsList = INITIAL_TEAMS;
                membersList = INITIAL_TEAM_MEMBERS;
                upgradedTeams = true;
              } else {
                teamsList = parsedTeamsList;
                if (cachedMembers) {
                  membersList = JSON.parse(cachedMembers);
                }
              }
            } catch (e) {
              console.error('Error parsing teams', e);
            }
          }
          
          setTeams(teamsList);
          setTeamMembers(membersList);
          
          if (upgradedTeams) {
            localStorage.setItem('byb_agency_teams', JSON.stringify(INITIAL_TEAMS));
            localStorage.setItem('byb_agency_team_members', JSON.stringify(INITIAL_TEAM_MEMBERS));
          }
        }

        if (parsedClients.length > 0) {
          setSelectedClientId(parsedClients[0].id);
        }
      } else {
        // First run load
        setClients(INITIAL_CLIENTS);
        setDepartments(INITIAL_DEPARTMENTS);
        setTeams(INITIAL_TEAMS);
        setTeamMembers(INITIAL_TEAM_MEMBERS);
        setCustomColumns(INITIAL_CUSTOM_COLUMNS);

        if (INITIAL_CLIENTS.length > 0) {
          setSelectedClientId(INITIAL_CLIENTS[0].id);
        }
        localStorage.setItem('byb_agency_clients', JSON.stringify(INITIAL_CLIENTS));
        localStorage.setItem('byb_agency_departments', JSON.stringify(INITIAL_DEPARTMENTS));
        localStorage.setItem('byb_agency_teams', JSON.stringify(INITIAL_TEAMS));
        localStorage.setItem('byb_agency_team_members', JSON.stringify(INITIAL_TEAM_MEMBERS));
        localStorage.setItem('byb_agency_custom_columns', JSON.stringify(INITIAL_CUSTOM_COLUMNS));
      }
    } catch (e) {
      console.error('Failed to parse cached database. Falling back to defaults.', e);
      setClients(INITIAL_CLIENTS);
      setDepartments(INITIAL_DEPARTMENTS);
      setTeams(INITIAL_TEAMS);
      setTeamMembers(INITIAL_TEAM_MEMBERS);
      setCustomColumns(INITIAL_CUSTOM_COLUMNS);
      if (INITIAL_CLIENTS.length > 0) {
        setSelectedClientId(INITIAL_CLIENTS[0].id);
      }
    }
  }, []);

  // 2. Persist State Changes
  const saveToLocalStorage = (
    updatedClients: Client[], 
    updatedDepts: Department[],
    updatedTeams: Team[] = teams,
    updatedMembers: TeamMember[] = teamMembers,
    updatedCustomCols: CustomColumn[] = customColumns
  ) => {
    localStorage.setItem('byb_agency_clients', JSON.stringify(updatedClients));
    localStorage.setItem('byb_agency_departments', JSON.stringify(updatedDepts));
    localStorage.setItem('byb_agency_teams', JSON.stringify(updatedTeams));
    localStorage.setItem('byb_agency_team_members', JSON.stringify(updatedMembers));
    localStorage.setItem('byb_agency_custom_columns', JSON.stringify(updatedCustomCols));
  };

  // 3. Client Creation and Updates
  const handleSaveClient = (clientData: Omit<Client, 'id' | 'createdAt'> & { id?: string }) => {
    let updatedClients: Client[];

    if (clientData.id) {
      // Edit mode
      updatedClients = clients.map(client => {
        if (client.id === clientData.id) {
          return {
            ...client,
            name: clientData.name,
            status: clientData.status,
            ranking: clientData.ranking,
            responsibles: { ...clientData.responsibles },
            contactEmail: clientData.contactEmail,
            marketApproach: clientData.marketApproach,
            segment: clientData.segment,
            communicationObjectives: clientData.communicationObjectives,
            driveFolderLink: clientData.driveFolderLink,
            annualPlanningLink: clientData.annualPlanningLink,
            scope: clientData.scope || client.scope || {},
            notes: clientData.notes,
            satisfactionRating: clientData.satisfactionRating,
            customFields: clientData.customFields || {},
          };
        }
        return client;
      });
    } else {
      // Create mode
      const newId = 'client_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5);
      
      const newClient: Client = {
        id: newId,
        name: clientData.name,
        status: clientData.status,
        ranking: clientData.ranking,
        responsibles: { ...clientData.responsibles },
        contactEmail: clientData.contactEmail,
        marketApproach: clientData.marketApproach,
        segment: clientData.segment,
        communicationObjectives: clientData.communicationObjectives,
        driveFolderLink: clientData.driveFolderLink,
        annualPlanningLink: clientData.annualPlanningLink,
        scope: clientData.scope || {},
        notes: clientData.notes,
        createdAt: new Date().toISOString(),
        satisfactionRating: clientData.satisfactionRating || 5,
        customFields: clientData.customFields || {},
      };

      updatedClients = [newClient, ...clients];
    }

    setClients(updatedClients);
    saveToLocalStorage(updatedClients, departments);
    setEditingClient(null);
  };

  const handleDeleteClient = (clientId: string) => {
    const updatedClients = clients.filter(c => c.id !== clientId);
    setClients(updatedClients);
    saveToLocalStorage(updatedClients, departments);
    if (editingClient?.id === clientId) {
      setEditingClient(null);
    }
  };

  const handleAddCustomColumn = (newCol: Omit<CustomColumn, 'id'>) => {
    const colId = 'col_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5);
    const completedCol: CustomColumn = { ...newCol, id: colId };
    const nextCols = [...customColumns, completedCol];
    setCustomColumns(nextCols);
    saveToLocalStorage(clients, departments, teams, teamMembers, nextCols);
  };

  const handleEditCustomColumn = (updatedCol: CustomColumn) => {
    const nextCols = customColumns.map(c => c.id === updatedCol.id ? updatedCol : c);
    setCustomColumns(nextCols);
    saveToLocalStorage(clients, departments, teams, teamMembers, nextCols);
  };

  const handleDeleteCustomColumn = (colId: string) => {
    const nextCols = customColumns.filter(c => c.id !== colId);
    // Erase the field from clients as well
    const nextClients = clients.map(client => {
      if (client.customFields) {
        const { [colId]: _, ...rest } = client.customFields;
        return { ...client, customFields: rest };
      }
      return client;
    });
    setClients(nextClients);
    setCustomColumns(nextCols);
    saveToLocalStorage(nextClients, departments, teams, teamMembers, nextCols);
  };

  const handleUpdateSatisfaction = (clientId: string, rating: number) => {
    const updatedClients = clients.map(client => {
      if (client.id === clientId) {
        return { ...client, satisfactionRating: rating };
      }
      return client;
    });
    setClients(updatedClients);
    saveToLocalStorage(updatedClients, departments);
  };

  // 4. Matrix Scope Checkbox Toggles
  const handleToggleScope = (clientId: string, departmentId: string, taskId: string) => {
    const updatedClients = clients.map(client => {
      if (client.id === clientId) {
        const clientScope = { ...client.scope };
        const activeTaskIds = Array.isArray(clientScope[departmentId]) 
          ? [...clientScope[departmentId]] 
          : [];

        if (activeTaskIds.includes(taskId)) {
          // Task already assigned, filter out
          clientScope[departmentId] = activeTaskIds.filter(id => id !== taskId);
        } else {
          // Task absent, add
          clientScope[departmentId] = [...activeTaskIds, taskId];
        }

        return {
          ...client,
          scope: clientScope
        };
      }
      return client;
    });

    setClients(updatedClients);
    saveToLocalStorage(updatedClients, departments);
  };

  // Bulk toggle a department's active tasks for a client
  const handleBulkAssignDepartment = (clientId: string, departmentId: string, assignAll: boolean) => {
    const targetDept = departments.find(d => d.id === departmentId);
    if (!targetDept) return;

    const updatedClients = clients.map(client => {
      if (client.id === clientId) {
        const clientScope = { ...client.scope };
        if (assignAll) {
          // Assign all taskIds
          clientScope[departmentId] = targetDept.tasks.map(t => t.id);
        } else {
          // Clear department lists
          clientScope[departmentId] = [];
        }
        return {
          ...client,
          scope: clientScope
        };
      }
      return client;
    });

    setClients(updatedClients);
    saveToLocalStorage(updatedClients, departments);
  };

  // 5. Department Sector Template Additions
  const handleAddDepartment = (name: string, color: string) => {
    const safeId = 'dept_' + name.toLowerCase().replace(/[^a-z0-9]+/g, '_') + '_' + Math.random().toString(36).substr(2, 4);
    
    const newDepartment: Department = {
      id: safeId,
      name,
      color,
      tasks: []
    };

    const updatedDepts = [...departments, newDepartment];
    
    // Ensure all existing clients get state structure assigned
    const updatedClients = clients.map(client => {
      const clientScope = { ...client.scope };
      if (!clientScope[safeId]) {
        clientScope[safeId] = [];
      }
      return {
        ...client,
        scope: clientScope
      };
    });

    setDepartments(updatedDepts);
    setClients(updatedClients);
    saveToLocalStorage(updatedClients, updatedDepts);
  };

  const handleDeleteDepartment = (departmentId: string) => {
    const updatedDepts = departments.filter(d => d.id !== departmentId);
    
    // Purge corresponding structures from all client indices
    const updatedClients = clients.map(client => {
      const clientScope = { ...client.scope };
      delete clientScope[departmentId];
      return {
        ...client,
        scope: clientScope
      };
    });

    setDepartments(updatedDepts);
    setClients(updatedClients);
    saveToLocalStorage(updatedClients, updatedDepts);
  };

  // 6. Task additions inside department lists
  const handleAddTaskToDepartment = (departmentId: string, name: string, description: string) => {
    const safeTaskId = 'task_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 3);
    const newTask: Task = {
      id: safeTaskId,
      name,
      description
    };

    const updatedDepts = departments.map(dept => {
      if (dept.id === departmentId) {
        return {
          ...dept,
          tasks: [...dept.tasks, newTask]
        };
      }
      return dept;
    });

    setDepartments(updatedDepts);
    saveToLocalStorage(clients, updatedDepts);
  };

  const handleDeleteTaskFromDepartment = (departmentId: string, taskId: string) => {
    // 1. Delete from template list
    const updatedDepts = departments.map(dept => {
      if (dept.id === departmentId) {
        return {
          ...dept,
          tasks: dept.tasks.filter(t => t.id !== taskId)
        };
      }
      return dept;
    });

    // 2. Cascade delete from any client who has this taskId in active scope
    const updatedClients = clients.map(client => {
      const clientScope = { ...client.scope };
      if (Array.isArray(clientScope[departmentId])) {
        clientScope[departmentId] = clientScope[departmentId].filter(id => id !== taskId);
      }
      return {
        ...client,
        scope: clientScope
      };
    });

    setDepartments(updatedDepts);
    setClients(updatedClients);
    saveToLocalStorage(updatedClients, updatedDepts);
  };

  // 6.5 Team & Coordinator Management handlers
  const handleAddTeam = (teamData: Omit<Team, 'id'>) => {
    const newTeamId = 'team_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5);
    const newTeam: Team = {
      id: newTeamId,
      ...teamData
    };
    const updatedTeams = [newTeam, ...teams];
    setTeams(updatedTeams);
    
    let updatedMembers = [...teamMembers];
    if (teamData.coordinatorId) {
      updatedMembers = teamMembers.map(m => m.id === teamData.coordinatorId ? { ...m, isCoordinator: true } : m);
      setTeamMembers(updatedMembers);
    }
    
    saveToLocalStorage(clients, departments, updatedTeams, updatedMembers);
  };

  const handleEditTeam = (updatedTeam: Team) => {
    const updatedTeams = teams.map(t => t.id === updatedTeam.id ? updatedTeam : t);
    setTeams(updatedTeams);
    
    let updatedMembers = [...teamMembers];
    if (updatedTeam.coordinatorId) {
      updatedMembers = teamMembers.map(m => m.id === updatedTeam.coordinatorId ? { ...m, isCoordinator: true } : m);
      setTeamMembers(updatedMembers);
    }
    
    saveToLocalStorage(clients, departments, updatedTeams, updatedMembers);
  };

  const handleDeleteTeam = (teamId: string) => {
    const updatedTeams = teams.filter(t => t.id !== teamId);
    // Unassign members belonging to this team
    const updatedMembers = teamMembers.map(m => m.teamId === teamId ? { ...m, teamId: '' } : m);
    setTeams(updatedTeams);
    setTeamMembers(updatedMembers);
    saveToLocalStorage(clients, departments, updatedTeams, updatedMembers);
  };

  const handleAddTeamMember = (memberData: Omit<TeamMember, 'id'>, coordinatedTeamId?: string) => {
    const newMemberId = 'member_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5);
    const newMember: TeamMember = {
      id: newMemberId,
      ...memberData
    };
    const updatedMembers = [newMember, ...teamMembers];
    setTeamMembers(updatedMembers);

    let updatedTeams = [...teams];
    if (coordinatedTeamId) {
      updatedTeams = teams.map(t => t.id === coordinatedTeamId ? { ...t, coordinatorId: newMemberId } : t);
      setTeams(updatedTeams);
    }

    saveToLocalStorage(clients, departments, updatedTeams, updatedMembers);
  };

  const handleEditTeamMember = (updatedMember: TeamMember, coordinatedTeamId?: string) => {
    const updatedMembers = teamMembers.map(m => m.id === updatedMember.id ? updatedMember : m);
    setTeamMembers(updatedMembers);
    
    let updatedTeams = [...teams];
    // If coordinator status is revoked, clear coordinatorId from any teams they managed
    if (!updatedMember.isCoordinator) {
      updatedTeams = teams.map(t => t.coordinatorId === updatedMember.id ? { ...t, coordinatorId: '' } : t);
      setTeams(updatedTeams);
    } else if (coordinatedTeamId !== undefined) {
      updatedTeams = teams.map(t => {
        // If this team was previously managed by this member but is no longer
        if (t.coordinatorId === updatedMember.id && t.id !== coordinatedTeamId) {
          return { ...t, coordinatorId: '' };
        }
        // If this is the new team managed by this member
        if (t.id === coordinatedTeamId) {
          return { ...t, coordinatorId: updatedMember.id };
        }
        return t;
      });
      setTeams(updatedTeams);
    }
    
    saveToLocalStorage(clients, departments, updatedTeams, updatedMembers);
  };

  const handleDeleteTeamMember = (memberId: string) => {
    const updatedMembers = teamMembers.filter(m => m.id !== memberId);
    // If they were coordinates of any team, clear the coordinator
    const updatedTeams = teams.map(t => t.coordinatorId === memberId ? { ...t, coordinatorId: '' } : t);
    setTeamMembers(updatedMembers);
    setTeams(updatedTeams);
    saveToLocalStorage(clients, departments, updatedTeams, updatedMembers);
  };

  // 7. General utilities: Seeding restore & backup
  const handleResetToDefaults = () => {
    if (window.confirm('Restore initial demo spreadsheet data? This will overwrite your current registers.')) {
      setClients(INITIAL_CLIENTS);
      setDepartments(INITIAL_DEPARTMENTS);
      setTeams(INITIAL_TEAMS);
      setTeamMembers(INITIAL_TEAM_MEMBERS);
      saveToLocalStorage(INITIAL_CLIENTS, INITIAL_DEPARTMENTS, INITIAL_TEAMS, INITIAL_TEAM_MEMBERS);
    }
  };

  const handleExportData = () => {
    const exportObj = {
      version: '1.0',
      clients,
      departments,
      teams,
      teamMembers
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `agency_client_scope_matrix_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = event => {
      try {
        const targetResult = event.target?.result;
        if (typeof targetResult !== 'string') throw new Error('Could not read content');
        
        const parsed = JSON.parse(targetResult);
        if (Array.isArray(parsed.clients) && Array.isArray(parsed.departments)) {
          setClients(parsed.clients);
          setDepartments(parsed.departments);
          const t = Array.isArray(parsed.teams) ? parsed.teams : INITIAL_TEAMS;
          const tm = Array.isArray(parsed.teamMembers) ? parsed.teamMembers : INITIAL_TEAM_MEMBERS;
          setTeams(t);
          setTeamMembers(tm);
          saveToLocalStorage(parsed.clients, parsed.departments, t, tm);
          showImportNotice('Spreadsheet database successfully restore from JSON backup!', false);
        } else {
          showImportNotice('Invalid file structure. Make sure "clients" and "departments" array are present.', true);
        }
      } catch (err) {
        showImportNotice('Failed to parse file. Please upload a genuine JSON backup file.', true);
      }
    };
  };

  const showImportNotice = (text: string, isError: boolean) => {
    setImportNotification({ text, isError });
    setTimeout(() => {
      setImportNotification(null);
    }, 5000);
  };

  // Trigger modal for creating brand new client card
  const handleOpenCreateModal = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  // Trigger modal for editing client card
  const handleOpenEditModal = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  // Calculate high level quick-info
  const totalTasksCount = departments.reduce((acc, c) => acc + c.tasks.length, 0);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
      {/* Visual Top Bar / Workspace Header */}
      <header className="bg-white border-b border-zinc-200 shrink-0 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Title Block */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-zinc-900 text-white rounded-xl shadow-xs">
                <FileSpreadsheet size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display font-bold text-lg sm:text-xl text-zinc-900 tracking-tight">
                    byb.ag Scope Dashboard
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold bg-zinc-100 border border-zinc-200 text-zinc-700 uppercase">
                    Bento Collab
                  </span>
                </div>
                <p className="text-xs text-zinc-500 font-medium">
                  Agency Client Directory & Sector Deliverables Planning Spreadsheet
                </p>
              </div>
            </div>

            {/* Operator Session Data & DB Controls */}
            <div className="flex flex-wrap items-center gap-2 text-zinc-500 text-xs">
              
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 hidden sm:block">
                <span className="text-zinc-400 font-bold mr-1">Workspace Operator:</span>
                <span className="font-extrabold text-zinc-700">barbarah@byb.ag</span>
              </div>

              {/* Database Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleExportData}
                  className="px-2.5 py-1.5 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 rounded-lg font-bold text-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Export Database to local storage JSON backup file"
                >
                  <Download size={13} className="text-zinc-400" />
                  <span className="text-[10px] uppercase">Export Backup</span>
                </button>
                
                <label 
                  className="px-2.5 py-1.5 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 rounded-lg font-bold text-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Import spreadsheet register from JSON"
                >
                  <Upload size={13} className="text-zinc-400" />
                  <span className="text-[10px] uppercase">Import JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleResetToDefaults}
                  className="px-2 py-1.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded text-[10px] font-bold text-zinc-650 transition-colors cursor-pointer"
                  title="Restore default mock clients database"
                >
                  Reset Defaults
                </button>
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Alerts / Import Notifications */}
        {importNotification && (
          <div className={`p-3.5 rounded-lg border flex items-center gap-2.5 text-xs text-left ${
            importNotification.isError 
              ? 'bg-rose-50 border-rose-200 text-rose-800' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <AlertCircle size={15} />
            <span className="font-semibold">{importNotification.text}</span>
          </div>
        )}

        {/* Dynamic Client Analysis Metric Counter */}
        <DashboardStats 
          clients={clients} 
          departments={departments} 
          onSelectClient={handleOpenEditModal} 
        />

        {/* Tab Selection Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-px gap-3.5 select-none">
          
          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-zinc-100 p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('bento')}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'bento' 
                  ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/50' 
                  : 'text-zinc-500 hover:text-zinc-850'
              }`}
            >
              <Grid size={14} className="text-zinc-500" />
              Bento Spotlight
            </button>

            <button
              onClick={() => setActiveTab('directory')}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'directory' 
                  ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/50' 
                  : 'text-zinc-500 hover:text-zinc-850'
              }`}
            >
              <Database size={14} className="text-zinc-400" />
              Clients Directory ({clients.length})
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'matrix' 
                  ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/50' 
                  : 'text-zinc-500 hover:text-zinc-850'
              }`}
            >
              <Layers size={14} className="text-zinc-400" />
              Scope Mapping ({clients.length} × {totalTasksCount})
            </button>

            <button
              onClick={() => setActiveTab('departments')}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'departments' 
                  ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/50' 
                  : 'text-zinc-500 hover:text-zinc-850'
              }`}
            >
              <Settings2 size={14} className="text-zinc-400" />
              Sectors & Templates ({departments.length})
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'team' 
                  ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/50' 
                  : 'text-zinc-500 hover:text-zinc-850'
              }`}
            >
              <Users size={14} className="text-zinc-400" />
              Equipe ({teamMembers.length})
            </button>
          </div>

          <div className="text-[11px] text-zinc-500 flex items-center gap-1">
            <TrendingUp size={13} className="text-emerald-500 shrink-0" />
            <span>Updated live within your offline browser container.</span>
          </div>
        </div>

        {/* Primary Screen Tabs Content */}
        <div id="active-tab-container">
          {activeTab === 'bento' && (
            <BentoClientDashboard
              clients={clients}
              departments={departments}
              selectedClientId={selectedClientId}
              onSelectClient={setSelectedClientId}
              onEditClientClick={handleOpenEditModal}
              onConfigureScopeClick={() => setActiveTab('matrix')}
              onDeleteClientClick={handleDeleteClient}
              onUpdateSatisfaction={handleUpdateSatisfaction}
              onViewCollaboratorByName={handleViewCollaboratorByName}
            />
          )}

          {activeTab === 'directory' && (
            <ClientDirectoryTable
              clients={clients}
              onEditClient={handleOpenEditModal}
              onDeleteClient={handleDeleteClient}
              onAddClientClick={handleOpenCreateModal}
              customColumns={customColumns}
              onAddCustomColumn={handleAddCustomColumn}
              onEditCustomColumn={handleEditCustomColumn}
              onDeleteCustomColumn={handleDeleteCustomColumn}
              onViewCollaboratorByName={handleViewCollaboratorByName}
            />
          )}

          {activeTab === 'matrix' && (
            <ScopeMatrixTable
              clients={clients}
              departments={departments}
              onToggleScope={handleToggleScope}
              onBulkAssignDepartment={handleBulkAssignDepartment}
            />
          )}

          {activeTab === 'departments' && (
            <DepartmentTemplateManager
              departments={departments}
              onAddDepartment={handleAddDepartment}
              onDeleteDepartment={handleDeleteDepartment}
              onAddTaskToDepartment={handleAddTaskToDepartment}
              onDeleteTaskFromDepartment={handleDeleteTaskFromDepartment}
            />
          )}

          {activeTab === 'team' && (
            <TeamManager
              teams={teams}
              teamMembers={teamMembers}
              departments={departments}
              clients={clients}
              onAddTeam={handleAddTeam}
              onEditTeam={handleEditTeam}
              onDeleteTeam={handleDeleteTeam}
              onAddTeamMember={handleAddTeamMember}
              onEditTeamMember={handleEditTeamMember}
              onDeleteTeamMember={handleDeleteTeamMember}
              onViewCollaboratorByName={handleViewCollaboratorByName}
              initialMemberToEdit={collaboratorToEdit}
              onClearInitialMemberToEdit={() => setCollaboratorToEdit(null)}
            />
          )}
        </div>

      </main>

      {/* Persistent Client Input Modal Sheet */}
      <ClientFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveClient}
        clientToEdit={editingClient}
        teamMembers={teamMembers}
        customColumns={customColumns}
      />

      {/* Collaborator Profile Modal */}
      <CollaboratorProfileModal
        isOpen={isCollaboratorModalOpen}
        onClose={() => setIsCollaboratorModalOpen(false)}
        member={selectedCollaborator}
        teams={teams}
        clients={clients}
        onEditMemberClick={handleEditCollaboratorFromModal}
      />

      {/* Humble Footer */}
      <footer className="bg-white border-t border-slate-100 py-4 select-none shrink-0 text-center">
        <div className="max-w-7xl mx-auto px-4 text-[10px] font-semibold text-slate-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div>
            Client Register & Scope Matrix • Designed for Barbara (byb.ag)
          </div>
          <div className="flex items-center justify-center gap-3">
            <span>Server-side API Active</span>
            <span>•</span>
            <span>Friday, June 12, 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
