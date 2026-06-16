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
  db, 
  auth, 
  OperationType, 
  handleFirestoreError 
} from './firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from 'firebase/auth';
import { 
  Download, 
  Upload, 
  AlertCircle,
  FileSpreadsheet,
  Grid,
  Database,
  Layers,
  Settings2,
  Users,
  TrendingUp,
  LogOut
} from 'lucide-react';

export default function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [customColumns, setCustomColumns] = useState<CustomColumn[]>([]);
  
  // Tab states
  const [activeTab, setActiveTab] = useState<'bento' | 'directory' | 'matrix' | 'departments' | 'team'>('bento');

  // Collaborator Profile modal states
  const [selectedCollaborator, setSelectedCollaborator] = useState<TeamMember | null>(null);
  const [isCollaboratorModalOpen, setIsCollaboratorModalOpen] = useState(false);
  const [collaboratorToEdit, setCollaboratorToEdit] = useState<TeamMember | null>(null);

  // User Auth and Load state
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dbLoading, setDbLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleViewCollaboratorByName = (name: string) => {
    if (!name || name === '—' || name === 'Unassigned' || name === 'Unassigned responsible' || name === 'Sem designação') return;
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

  // Highlight spotlight client selection
  const [selectedClientId, setSelectedClientId] = useState<string>('');

  // Client Modal Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Notifications
  const [importNotification, setImportNotification] = useState<{ text: string; isError: boolean } | null>(null);

  // Auth subscription
  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged(firebaseUser => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return unsubAuth;
  }, []);

  // Sync databases in real-time
  useEffect(() => {
    if (!user) {
      setDbLoading(false);
      return;
    }

    setDbLoading(true);

    const unsubClients = onSnapshot(collection(db, 'clients'), (snapshot) => {
      const data: Client[] = [];
      snapshot.forEach(docSnap => {
        data.push({ id: docSnap.id, ...docSnap.data() } as Client);
      });
      data.sort((a, b) => a.name.localeCompare(b.name));
      setClients(data);
      if (data.length > 0) {
        setSelectedClientId(prev => {
          if (prev && data.some(d => d.id === prev)) return prev;
          return data[0].id;
        });
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'clients');
    });

    const unsubDepts = onSnapshot(collection(db, 'departments'), (snapshot) => {
      const data: Department[] = [];
      snapshot.forEach(docSnap => {
        data.push({ id: docSnap.id, ...docSnap.data() } as Department);
      });
      setDepartments(data);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'departments');
    });

    const unsubTeams = onSnapshot(collection(db, 'teams'), (snapshot) => {
      const data: Team[] = [];
      snapshot.forEach(docSnap => {
        data.push({ id: docSnap.id, ...docSnap.data() } as Team);
      });
      setTeams(data);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'teams');
    });

    const unsubMembers = onSnapshot(collection(db, 'teamMembers'), (snapshot) => {
      const data: TeamMember[] = [];
      snapshot.forEach(docSnap => {
        data.push({ id: docSnap.id, ...docSnap.data() } as TeamMember);
      });
      setTeamMembers(data);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'teamMembers');
    });

    const unsubCols = onSnapshot(collection(db, 'customColumns'), (snapshot) => {
      const data: CustomColumn[] = [];
      snapshot.forEach(docSnap => {
        data.push({ id: docSnap.id, ...docSnap.data() } as CustomColumn);
      });
      setCustomColumns(data);
      setDbLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'customColumns');
    });

    return () => {
      unsubClients();
      unsubDepts();
      unsubTeams();
      unsubMembers();
      unsubCols();
    };
  }, [user]);

  // Seeding routine for first use or manual overwrite
  const performDatabaseSeeding = async () => {
    setIsSeeding(true);
    try {
      // Seed departments
      for (const dept of INITIAL_DEPARTMENTS) {
        await setDoc(doc(db, 'departments', dept.id), dept);
      }
      // Seed custom columns
      for (const col of INITIAL_CUSTOM_COLUMNS) {
        await setDoc(doc(db, 'customColumns', col.id), col);
      }
      // Seed teams
      for (const team of INITIAL_TEAMS) {
        await setDoc(doc(db, 'teams', team.id), team);
      }
      // Seed members
      for (const member of INITIAL_TEAM_MEMBERS) {
        await setDoc(doc(db, 'teamMembers', member.id), member);
      }
      // Seed clients
      for (const client of INITIAL_CLIENTS) {
        await setDoc(doc(db, 'clients', client.id), client);
      }
      showImportNotice('Seed de demonstração Firebase concluído com sucesso!', false);
    } catch (err) {
      console.error('Erro ao semear o Firestore:', err);
      showImportNotice('Falha na autenticação ou regras de gravação do Firestore ao salvar.', true);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Restaurar dados iniciais da planilha de demonstração? Isso substituirá os registros atuais no Firestore.')) {
      performDatabaseSeeding();
    }
  };

  // Google Login Function
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Erro no fluxo do Google Login:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  };

  // 3. Client Creation and Updates
  const handleSaveClient = async (clientData: Omit<Client, 'id' | 'createdAt'> & { id?: string }) => {
    try {
      if (clientData.id) {
        const existingClient = clients.find(c => c.id === clientData.id);
        const updatedDoc = {
          ...existingClient,
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
          operandLink: clientData.operandLink || '',
          scope: clientData.scope || existingClient?.scope || {},
          notes: clientData.notes,
          satisfactionRating: clientData.satisfactionRating,
          customFields: clientData.customFields || {},
        };
        await setDoc(doc(db, 'clients', clientData.id), updatedDoc);
      } else {
        const newId = 'client_' + Date.now().toString() + '_' + Math.random().toString(36).substring(2, 7);
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
          operandLink: clientData.operandLink || '',
          scope: clientData.scope || {},
          notes: clientData.notes,
          createdAt: new Date().toISOString(),
          satisfactionRating: clientData.satisfactionRating || 5,
          customFields: clientData.customFields || {},
        };
        await setDoc(doc(db, 'clients', newId), newClient);
      }
      setEditingClient(null);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'clients');
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;
    try {
      await deleteDoc(doc(db, 'clients', clientId));
      if (editingClient?.id === clientId) {
        setEditingClient(null);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `clients/${clientId}`);
    }
  };

  const handleAddCustomColumn = async (newCol: Omit<CustomColumn, 'id'>) => {
    try {
      const colId = 'col_' + Date.now().toString() + '_' + Math.random().toString(36).substring(2, 7);
      const completedCol: CustomColumn = { ...newCol, id: colId };
      await setDoc(doc(db, 'customColumns', colId), completedCol);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'customColumns');
    }
  };

  const handleEditCustomColumn = async (updatedCol: CustomColumn) => {
    try {
      await setDoc(doc(db, 'customColumns', updatedCol.id), updatedCol);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `customColumns/${updatedCol.id}`);
    }
  };

  const handleDeleteCustomColumn = async (colId: string) => {
    try {
      await deleteDoc(doc(db, 'customColumns', colId));
      for (const client of clients) {
        if (client.customFields && colId in client.customFields) {
          const { [colId]: _, ...rest } = client.customFields;
          await updateDoc(doc(db, 'clients', client.id), { customFields: rest });
        }
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `customColumns/${colId}`);
    }
  };

  const handleUpdateSatisfaction = async (clientId: string, rating: number) => {
    try {
      await updateDoc(doc(db, 'clients', clientId), { satisfactionRating: rating });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `clients/${clientId}`);
    }
  };

  // Matrix toggle scopes
  const handleToggleScope = async (clientId: string, departmentId: string, taskId: string) => {
    try {
      const client = clients.find(c => c.id === clientId);
      if (!client) return;
      const clientScope = { ...client.scope };
      const activeTaskIds = Array.isArray(clientScope[departmentId]) 
        ? [...clientScope[departmentId]] 
        : [];

      if (activeTaskIds.includes(taskId)) {
        clientScope[departmentId] = activeTaskIds.filter(id => id !== taskId);
      } else {
        clientScope[departmentId] = [...activeTaskIds, taskId];
      }
      await updateDoc(doc(db, 'clients', clientId), { scope: clientScope });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `clients/${clientId}`);
    }
  };

  const handleBulkAssignDepartment = async (clientId: string, departmentId: string, assignAll: boolean) => {
    try {
      const targetDept = departments.find(d => d.id === departmentId);
      if (!targetDept) return;
      const client = clients.find(c => c.id === clientId);
      if (!client) return;
      const clientScope = { ...client.scope };
      if (assignAll) {
        clientScope[departmentId] = targetDept.tasks.map(t => t.id);
      } else {
        clientScope[departmentId] = [];
      }
      await updateDoc(doc(db, 'clients', clientId), { scope: clientScope });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `clients/${clientId}`);
    }
  };

  // Department Template modifications
  const handleAddDepartment = async (name: string, color: string) => {
    try {
      const safeId = 'dept_' + name.toLowerCase().replace(/[^a-z0-9]+/g, '_') + '_' + Math.random().toString(36).substring(2, 6);
      const newDepartment: Department = {
        id: safeId,
        name,
        color,
        tasks: []
      };
      await setDoc(doc(db, 'departments', safeId), newDepartment);
      
      // Update clients scopes
      for (const client of clients) {
        const clientScope = { ...client.scope };
        if (!clientScope[safeId]) {
          clientScope[safeId] = [];
          await updateDoc(doc(db, 'clients', client.id), { scope: clientScope });
        }
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'departments');
    }
  };

  const handleDeleteDepartment = async (departmentId: string) => {
    if (!window.confirm('Excluir este setor apagará seu modelo e todos os mapeamentos nos clientes. Deseja prosseguir?')) return;
    try {
      await deleteDoc(doc(db, 'departments', departmentId));
      for (const client of clients) {
        const clientScope = { ...client.scope };
        delete clientScope[departmentId];
        await updateDoc(doc(db, 'clients', client.id), { scope: clientScope });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `departments/${departmentId}`);
    }
  };

  const handleAddTaskToDepartment = async (departmentId: string, name: string, description: string) => {
    try {
      const safeTaskId = 'task_' + Date.now().toString() + '_' + Math.random().toString(36).substring(2, 5);
      const dept = departments.find(d => d.id === departmentId);
      if (!dept) return;
      const newTask: Task = {
        id: safeTaskId,
        name,
        description
      };
      await updateDoc(doc(db, 'departments', departmentId), { tasks: [...dept.tasks, newTask] });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `departments/${departmentId}`);
    }
  };

  const handleDeleteTaskFromDepartment = async (departmentId: string, taskId: string) => {
    try {
      const dept = departments.find(d => d.id === departmentId);
      if (!dept) return;
      await updateDoc(doc(db, 'departments', departmentId), {
        tasks: dept.tasks.filter(t => t.id !== taskId)
      });

      for (const client of clients) {
        const clientScope = { ...client.scope };
        if (Array.isArray(clientScope[departmentId])) {
          clientScope[departmentId] = clientScope[departmentId].filter(id => id !== taskId);
          await updateDoc(doc(db, 'clients', client.id), { scope: clientScope });
        }
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `departments/${departmentId}`);
    }
  };

  // Team & Coordinators updates
  const handleAddTeam = async (teamData: Omit<Team, 'id'>) => {
    try {
      const newTeamId = 'team_' + Date.now().toString() + '_' + Math.random().toString(36).substring(2, 7);
      const newTeam: Team = {
        id: newTeamId,
        ...teamData
      };
      await setDoc(doc(db, 'teams', newTeamId), newTeam);
      if (teamData.coordinatorId) {
        await updateDoc(doc(db, 'teamMembers', teamData.coordinatorId), { isCoordinator: true });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'teams');
    }
  };

  const handleEditTeam = async (updatedTeam: Team) => {
    try {
      await setDoc(doc(db, 'teams', updatedTeam.id), updatedTeam);
      if (updatedTeam.coordinatorId) {
        await updateDoc(doc(db, 'teamMembers', updatedTeam.coordinatorId), { isCoordinator: true });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `teams/${updatedTeam.id}`);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      await deleteDoc(doc(db, 'teams', teamId));
      for (const member of teamMembers) {
        if (member.teamId === teamId) {
          await updateDoc(doc(db, 'teamMembers', member.id), { teamId: '' });
        }
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `teams/${teamId}`);
    }
  };

  const handleAddTeamMember = async (memberData: Omit<TeamMember, 'id'>, coordinatedTeamId?: string) => {
    try {
      const newMemberId = 'member_' + Date.now().toString() + '_' + Math.random().toString(36).substring(2, 7);
      const newMember: TeamMember = {
        id: newMemberId,
        ...memberData
      };
      await setDoc(doc(db, 'teamMembers', newMemberId), newMember);
      if (coordinatedTeamId) {
        await updateDoc(doc(db, 'teams', coordinatedTeamId), { coordinatorId: newMemberId });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'teamMembers');
    }
  };

  const handleEditTeamMember = async (updatedMember: TeamMember, coordinatedTeamId?: string) => {
    try {
      await setDoc(doc(db, 'teamMembers', updatedMember.id), updatedMember);
      if (!updatedMember.isCoordinator) {
        for (const team of teams) {
          if (team.coordinatorId === updatedMember.id) {
            await updateDoc(doc(db, 'teams', team.id), { coordinatorId: '' });
          }
        }
      } else if (coordinatedTeamId !== undefined) {
        for (const team of teams) {
          if (team.coordinatorId === updatedMember.id && team.id !== coordinatedTeamId) {
            await updateDoc(doc(db, 'teams', team.id), { coordinatorId: '' });
          }
          if (team.id === coordinatedTeamId) {
            await updateDoc(doc(db, 'teams', team.id), { coordinatorId: updatedMember.id });
          }
        }
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `teamMembers/${updatedMember.id}`);
    }
  };

  const handleDeleteTeamMember = async (memberId: string) => {
    try {
      await deleteDoc(doc(db, 'teamMembers', memberId));
      for (const team of teams) {
        if (team.coordinatorId === memberId) {
          await updateDoc(doc(db, 'teams', team.id), { coordinatorId: '' });
        }
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `teamMembers/${memberId}`);
    }
  };

  // Seeding backup and exports
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
    downloadAnchor.setAttribute("download", `byb_ag_dashboard_escopo_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = async event => {
      try {
        const targetResult = event.target?.result;
        if (typeof targetResult !== 'string') throw new Error('Falha na leitura');
        
        const parsed = JSON.parse(targetResult);
        if (Array.isArray(parsed.clients) && Array.isArray(parsed.departments)) {
          // Import to Firebase
          for (const dept of parsed.departments) {
            await setDoc(doc(db, 'departments', dept.id), dept);
          }
          const t = Array.isArray(parsed.teams) ? parsed.teams : INITIAL_TEAMS;
          for (const team of t) {
            await setDoc(doc(db, 'teams', team.id), team);
          }
          const tm = Array.isArray(parsed.teamMembers) ? parsed.teamMembers : INITIAL_TEAM_MEMBERS;
          for (const member of tm) {
            await setDoc(doc(db, 'teamMembers', member.id), member);
          }
          for (const client of parsed.clients) {
            await setDoc(doc(db, 'clients', client.id), client);
          }
          showImportNotice('Base de dados restaurada com sucesso no Firestore via arquivo JSON!', false);
        } else {
          showImportNotice('Formato de arquivo inválido. "clients" e "departments" precisam estar contidos.', true);
        }
      } catch (err) {
        showImportNotice('Erro ao ler ou gravar dados. Certifique-se de que é um documento JSON válido e que você possui permissão de escrita.', true);
      }
    };
  };

  const showImportNotice = (text: string, isError: boolean) => {
    setImportNotification({ text, isError });
    setTimeout(() => {
      setImportNotification(null);
    }, 5000);
  };

  const handleOpenCreateModal = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  // Loading Screen for Authentication checking
  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 font-sans text-center">
        <div className="space-y-4">
          <div className="w-8 h-8 border-3 border-zinc-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-zinc-500 font-medium text-sm">Autenticando sessão...</p>
        </div>
      </div>
    );
  }

  // Welcome / Login screen if not connected
  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full border border-zinc-200/80 shadow-2xl text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-zinc-900 text-white rounded-2xl shadow-md">
              <FileSpreadsheet size={32} />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="font-display font-extrabold text-2xl text-zinc-900 tracking-tight">byb.ag - Painel de Escopos</h1>
            <p className="text-sm text-zinc-500 leading-relaxed justify-center">
              Acesso exclusivo para colaboradores da agência. Conecte-se com sua Conta do Google para sincronizar e gerenciar o escopo de clientes no Firestore em tempo real.
            </p>
          </div>
          
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-850 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <svg className="w-4 h-4 text-white fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.529-8 7.859-8c2.46 0 4.103 1.025 5.04 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.74-.08-1.3-.176-1.859H12.24z" />
            </svg>
            Entrar com o Google
          </button>
        </div>
      </div>
    );
  }

  // Seeding progress screen
  if (isSeeding) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 font-sans text-center">
        <div className="space-y-4">
          <div className="w-8 h-8 border-3 border-zinc-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-zinc-500 font-medium text-sm">Populando dados de demonstração no Firebase Firestore...</p>
        </div>
      </div>
    );
  }

  // Database initial load screen
  if (dbLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 font-sans text-center">
        <div className="space-y-4">
          <div className="w-8 h-8 border-3 border-zinc-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-zinc-500 font-medium text-sm">Baixando registros do Firestore...</p>
        </div>
      </div>
    );
  }

  // Calculations
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
                    byb.ag - Dashboard de Escopo
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold bg-zinc-100 border border-zinc-200 text-zinc-700 uppercase">
                    Bento Collab
                  </span>
                </div>
                <p className="text-xs text-zinc-500 font-medium">
                  Diretório de Clientes & Planilha de Planejamento de Entregas por Setores
                </p>
              </div>
            </div>

            {/* Operator Session Data & DB Controls */}
            <div className="flex flex-wrap items-center gap-2 text-zinc-500 text-xs">
              
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
                <span className="text-zinc-400 font-bold hidden sm:inline">Conectado como:</span>
                <span className="font-extrabold text-zinc-700">{user.email}</span>
                <button 
                  onClick={handleSignOut}
                  className="p-1 hover:bg-zinc-200 rounded text-rose-600 transition-colors cursor-pointer"
                  title="Sair da Conta"
                >
                  <LogOut size={13} />
                </button>
              </div>

              {/* Database Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleExportData}
                  className="px-2.5 py-1.5 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 rounded-lg font-bold text-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Exportar dados para um arquivo JSON local"
                >
                  <Download size={13} className="text-zinc-400" />
                  <span className="text-[10px] uppercase">Backup JSON</span>
                </button>
                
                <label 
                  className="px-2.5 py-1.5 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 rounded-lg font-bold text-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Importar planilha de registros do JSON para o Firestore"
                >
                  <Upload size={13} className="text-zinc-400" />
                  <span className="text-[10px] uppercase">Importar JSON</span>
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
                  className="px-2 py-1.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded text-[10px] font-bold text-zinc-600 transition-colors cursor-pointer"
                  title="Popular/Restaurar os dados de demonstração no Firebase Firestore"
                >
                  Semeador Demo
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

        {clients.length === 0 && departments.length === 0 && (
          <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="font-bold text-amber-900 text-base">Banco de Dados Vazio no Firestore</h2>
              <p className="text-xs text-amber-700">Seu projeto Firebase foi provisionado com regramentos corretos de segurança, mas as coleções estão vazias. Clique ao lado para semear todos os 30+ clientes e estruturas de exemplo do byb.ag!</p>
            </div>
            <button
              onClick={performDatabaseSeeding}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
            >
              Popular Firebase de Demonstração
            </button>
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
              Foco Bento (Visual)
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
              Diretório de Clientes ({clients.length})
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
              Mapeamento de Escopo ({clients.length} × {totalTasksCount})
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
              Setores & Modelos ({departments.length})
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

          <div className="text-[11px] text-zinc-500 flex items-center gap-1" style={{ width: '180px' }}>
            <TrendingUp size={13} className="text-emerald-500 shrink-0" />
            <span>Sincronizado em tempo real com o Firestore do Firebase.</span>
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

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-4 select-none shrink-0 text-center">
        <div className="max-w-7xl mx-auto px-4 text-[10px] font-semibold text-slate-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div>
            Registro de Clientes & Matriz de Escopo • Desenvolvido para Barbara (byb.ag)
          </div>
          <div className="flex items-center justify-center gap-3">
            <span>Serviço FireStore Conectado</span>
            <span>•</span>
            <span>2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
