/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Team, TeamMember, Department, Client } from '../types';
import { 
  Users, 
  User, 
  Trash2, 
  Edit2, 
  Plus, 
  Shield, 
  Mail, 
  Briefcase, 
  Check, 
  Layers, 
  AlertCircle,
  X,
  UserCheck,
  CheckSquare,
  Square,
  BarChart2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface TeamManagerProps {
  teams: Team[];
  teamMembers: TeamMember[];
  departments: Department[];
  clients: Client[];
  onAddTeam: (team: Omit<Team, 'id'>) => void;
  onEditTeam: (team: Team) => void;
  onDeleteTeam: (id: string) => void;
  onAddTeamMember: (member: Omit<TeamMember, 'id'>, coordinatedTeamId?: string) => void;
  onEditTeamMember: (member: TeamMember, coordinatedTeamId?: string) => void;
  onDeleteTeamMember: (id: string) => void;
  onViewCollaboratorByName?: (name: string) => void;
  initialMemberToEdit?: TeamMember | null;
  onClearInitialMemberToEdit?: () => void;
}

export default function TeamManager({
  teams,
  teamMembers,
  departments,
  clients = [],
  onAddTeam,
  onEditTeam,
  onDeleteTeam,
  onAddTeamMember,
  onEditTeamMember,
  onDeleteTeamMember,
  onViewCollaboratorByName,
  initialMemberToEdit = null,
  onClearInitialMemberToEdit
}: TeamManagerProps) {
  // Tabs within Equipe page: "Membros" / "Times / Coordenadores"
  const [activeSubTab, setActiveSubTab] = useState<'members' | 'teams'>('members');
  const [selectedMemberWorkloadId, setSelectedMemberWorkloadId] = useState<string | null>(null);

  // Form states - Member
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  
  const [memberCoordinatedTeamId, setMemberCoordinatedTeamId] = useState('');

  // Auto-open edit modal if requested from outside
  useEffect(() => {
    if (initialMemberToEdit) {
      openMemberEditModal(initialMemberToEdit);
      onClearInitialMemberToEdit?.();
    }
  }, [initialMemberToEdit]);
  
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberTeamId, setMemberTeamId] = useState('');
  const [memberIsCoordinator, setMemberIsCoordinator] = useState(false);
  const [memberSupervisedDepts, setMemberSupervisedDepts] = useState<string[]>([]);

  // Form states - Team
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [teamName, setTeamName] = useState('');
  const [teamCoordinatorId, setTeamCoordinatorId] = useState('');

  // -------------------------
  // Member Form Handlers
  // -------------------------
  const openMemberCreateModal = () => {
    setEditingMember(null);
    setMemberName('');
    setMemberEmail('');
    setMemberRole('');
    setMemberTeamId(teams[0]?.id || '');
    setMemberIsCoordinator(false);
    setMemberSupervisedDepts([]);
    setMemberCoordinatedTeamId('');
    setIsMemberModalOpen(true);
  };

  const openMemberEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setMemberName(member.name);
    setMemberEmail(member.email);
    setMemberRole(member.role);
    setMemberTeamId(member.teamId);
    setMemberIsCoordinator(member.isCoordinator);
    setMemberSupervisedDepts(member.supervisedDepartmentIds || []);
    
    // Find if coordinator of any team
    const coordTeam = teams.find(t => t.coordinatorId === member.id);
    setMemberCoordinatedTeamId(coordTeam ? coordTeam.id : '');
    
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberEmail.trim()) return;

    const data = {
      name: memberName,
      email: memberEmail,
      role: memberRole,
      teamId: memberTeamId,
      isCoordinator: memberIsCoordinator,
      supervisedDepartmentIds: memberIsCoordinator ? memberSupervisedDepts : []
    };

    if (editingMember) {
      onEditTeamMember({
        ...editingMember,
        ...data
      }, memberCoordinatedTeamId);
    } else {
      onAddTeamMember(data, memberCoordinatedTeamId);
    }
    setIsMemberModalOpen(false);
  };

  const handleToggleDeptSupervision = (deptId: string) => {
    setMemberSupervisedDepts(prev => 
      prev.includes(deptId) 
        ? prev.filter(id => id !== deptId) 
        : [...prev, deptId]
    );
  };

  // -------------------------
  // Team Form Handlers
  // -------------------------
  const openTeamCreateModal = () => {
    setEditingTeam(null);
    setTeamName('');
    // Select first potential coordinator
    const coordinators = teamMembers.filter(m => m.isCoordinator);
    setTeamCoordinatorId(coordinators[0]?.id || '');
    setIsTeamModalOpen(true);
  };

  const openTeamEditModal = (team: Team) => {
    setEditingTeam(team);
    setTeamName(team.name);
    setTeamCoordinatorId(team.coordinatorId);
    setIsTeamModalOpen(true);
  };

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    const data = {
      name: teamName,
      coordinatorId: teamCoordinatorId
    };

    if (editingTeam) {
      onEditTeam({
        ...editingTeam,
        ...data
      });
    } else {
      onAddTeam(data);
    }
    setIsTeamModalOpen(false);
  };

  // Helper matching
  const getTeamName = (id: string) => {
    return teams.find(t => t.id === id)?.name || 'Sem Time / Outro';
  };

  const getCoordinatorName = (id: string) => {
    if (!id) return 'Sem Coordenador';
    const member = teamMembers.find(m => m.id === id);
    return member ? `${member.name} (${member.role})` : 'Membro não encontrado';
  };

  // Workload analysis logic
  const getWorkloadData = (member: TeamMember) => {
    const nameLower = member.name.toLowerCase().trim();
    
    // Find all clients where this member is assigned
    const assignedClients = clients.filter(c => {
      const rs = c.responsibles;
      if (!rs) return false;
      const sys = (rs.serviceLiaison || '').toLowerCase().trim();
      const wr = (rs.writer || '').toLowerCase().trim();
      const ds = (rs.designer || '').toLowerCase().trim();
      const pt = (rs.paidTrafficHandler || '').toLowerCase().trim();
      const sm = (rs.socialMedia || '').toLowerCase().trim();
      
      return sys === nameLower || sys.startsWith(nameLower) || nameLower.startsWith(sys) ||
             wr === nameLower || wr.startsWith(nameLower) || nameLower.startsWith(wr) ||
             ds === nameLower || ds.startsWith(nameLower) || nameLower.startsWith(ds) ||
             pt === nameLower || pt.startsWith(nameLower) || nameLower.startsWith(pt) ||
             sm === nameLower || sm.startsWith(nameLower) || nameLower.startsWith(sm);
    });

    const counts = {
      liaison: 0,
      writer: 0,
      designer: 0,
      traffic: 0,
      social: 0,
    };

    assignedClients.forEach(c => {
      const rs = c.responsibles;
      const sys = (rs.serviceLiaison || '').toLowerCase().trim();
      const wr = (rs.writer || '').toLowerCase().trim();
      const ds = (rs.designer || '').toLowerCase().trim();
      const pt = (rs.paidTrafficHandler || '').toLowerCase().trim();
      const sm = (rs.socialMedia || '').toLowerCase().trim();

      if (sys === nameLower || sys.startsWith(nameLower) || nameLower.startsWith(sys)) counts.liaison++;
      if (wr === nameLower || wr.startsWith(nameLower) || nameLower.startsWith(wr)) counts.writer++;
      if (ds === nameLower || ds.startsWith(nameLower) || nameLower.startsWith(ds)) counts.designer++;
      if (pt === nameLower || pt.startsWith(nameLower) || nameLower.startsWith(pt)) counts.traffic++;
      if (sm === nameLower || sm.startsWith(nameLower) || nameLower.startsWith(sm)) counts.social++;
    });

    return {
      clients: assignedClients,
      counts,
      totalCount: assignedClients.length // unique clients
    };
  };

  const getWorkloadBadge = (count: number) => {
    if (count === 0) {
      return {
        label: 'Disponível / Sem Carga',
        color: 'bg-zinc-50 text-zinc-500 border-zinc-200',
        barColor: 'bg-zinc-200'
      };
    }
    if (count <= 2) {
      return {
        label: 'Carga Leve',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        barColor: 'bg-emerald-500'
      };
    }
    if (count <= 4) {
      return {
        label: 'Carga Balanceada',
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        barColor: 'bg-indigo-500'
      };
    }
    return {
      label: 'Demanda Alta / Limite',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      barColor: 'bg-amber-500'
    };
  };

  return (
    <div className="space-y-6 text-left">
      {/* Visual Header card */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <Users className="text-zinc-600" size={20} />
            Gestão de Equipe &amp; Coordenação
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Cadastre membros da equipe de marketing, design e atendimento. Organize times e defina coordenadores sob múltiplos setores.
          </p>
        </div>
        
        {/* Sub tabs switches */}
        <div className="flex bg-zinc-100 rounded-lg p-1 text-xs font-bold gap-1 self-stretch sm:self-auto select-none">
          <button
            onClick={() => setActiveSubTab('members')}
            className={`px-3.5 py-1.5 rounded-md transition-all cursor-pointer ${
              activeSubTab === 'members' 
                ? 'bg-white text-zinc-900 shadow-2xs border border-zinc-200/50' 
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Membros ({teamMembers.length})
          </button>
          <button
            onClick={() => setActiveSubTab('teams')}
            className={`px-3.5 py-1.5 rounded-md transition-all cursor-pointer ${
              activeSubTab === 'teams' 
                ? 'bg-white text-zinc-900 shadow-2xs border border-zinc-200/50' 
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Times e Coordenadores ({teams.length})
          </button>
        </div>
      </div>

      {/* Primary content area based on Subtab */}
      {activeSubTab === 'members' ? (
        <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden flex flex-col">
          {/* Action Toolbar */}
          <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-left">
            <div>
              <h3 className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider">Membros Ativos da Agência</h3>
              <p className="text-[10px] text-zinc-400 mt-0.5">Clique para cadastrar ou remover membros com responsabilidade nos escopos</p>
            </div>
            
            <button
              onClick={openMemberCreateModal}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-850 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer inline-flex"
            >
              <Plus size={14} />
              Cadastrar Novo Membro
            </button>
          </div>

          {/* Members Grid Grid */}
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.length === 0 ? (
              <div className="col-span-full py-12 text-center text-zinc-400 font-medium">
                <AlertCircle className="mx-auto text-zinc-300 mb-2" size={32} />
                <p className="text-sm">Nenhum membro cadastrado até o momento.</p>
                <button
                  onClick={openMemberCreateModal}
                  className="mt-3 text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  Cadastrar primeiro membro →
                </button>
              </div>
            ) : (
              teamMembers.map(member => {
                const initials = member.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
                const belongsToTeam = getTeamName(member.teamId);
                const workload = getWorkloadData(member);
                
                return (
                  <div 
                    key={member.id} 
                    className="border border-zinc-200 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-300 transition-all bg-white text-left relative overflow-hidden group"
                  >
                    {/* Coordinator Indicator Ribbon */}
                    {member.isCoordinator && (
                      <div className="absolute top-0 right-0 bg-zinc-900 text-white text-[8px] font-bold tracking-widest uppercase px-3 py-1 rounded-bl-lg flex items-center gap-1 shadow-sm">
                        <Shield size={9} /> Coordenador
                      </div>
                    )}

                    <div>
                      {/* Avatar & Core Metadata row */}
                      <div className="flex items-center gap-3 mb-3.5">
                        <div 
                          onClick={() => onViewCollaboratorByName?.(member.name)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm font-display cursor-pointer hover:opacity-80 transition-all ${
                            member.isCoordinator ? 'bg-zinc-900 text-zinc-100' : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                          }`}
                          title="Ver perfil completo do colaborador"
                        >
                          {initials}
                        </div>
                        <div className="truncate max-w-[170px]">
                          <h4 
                            onClick={() => onViewCollaboratorByName?.(member.name)}
                            className="font-bold text-sm text-zinc-800 tracking-tight truncate cursor-pointer hover:text-indigo-600 transition-colors"
                            title="Ver perfil completo do colaborador"
                          >
                            {member.name}
                          </h4>
                          <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400 font-medium truncate">
                            <Briefcase size={10} /> {member.role || 'Geral'}
                          </span>
                        </div>
                      </div>

                      {/* Info lines */}
                      <div className="space-y-1.5 text-[11px] text-zinc-600 bg-zinc-50 border border-zinc-150 p-2.5 rounded-lg mb-4">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-zinc-400 font-semibold">Email:</span>
                          <span className="text-zinc-700 truncate max-w-[180px] font-medium" title={member.email}>
                            {member.email}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400 font-semibold">Time:</span>
                          <span className="font-bold text-zinc-800">{belongsToTeam}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-zinc-200/50 pt-1.5 mt-1.5">
                          <span className="text-zinc-400 font-semibold">Clientes:</span>
                          <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{workload.totalCount} {workload.totalCount === 1 ? 'cliente' : 'clientes'}</span>
                        </div>
                      </div>

                      {/* Coordinator sector permissions */}
                      {member.isCoordinator && (
                        <div className="mb-4">
                          <p className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                            <Layers size={10} className="text-zinc-400" />
                            Sectores Sob Responsabilidade
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {member.supervisedDepartmentIds && member.supervisedDepartmentIds.length > 0 ? (
                              member.supervisedDepartmentIds.map(deptId => {
                                const deptObj = departments.find(d => d.id === deptId);
                                if (!deptObj) return null;
                                return (
                                  <span 
                                    key={deptId} 
                                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                                      deptObj.color === 'emerald' ? 'bg-emerald-50 text-emerald-800 border-emerald-150' :
                                      deptObj.color === 'purple' ? 'bg-purple-50 text-purple-800 border-purple-150' :
                                      deptObj.color === 'blue' ? 'bg-blue-50 text-blue-800 border-blue-150' :
                                      deptObj.color === 'amber' ? 'bg-amber-50 text-amber-800 border-amber-150' :
                                      'bg-zinc-50 text-zinc-700 border-zinc-150'
                                    }`}
                                  >
                                    {deptObj.name.replace(' Department', '').replace(' Team', '')}
                                  </span>
                                );
                              })
                            ) : (
                              <span className="text-[10px] text-zinc-400 italic">Nenhum setor adicionado</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action controls row */}
                    <div className="flex items-center justify-between border-t border-zinc-100 pt-3 mt-1 text-xs shrink-0 select-none">
                      <button
                        onClick={() => openMemberEditModal(member)}
                        className="text-zinc-500 hover:text-indigo-600 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Edit2 size={12} /> Editar Membro
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Tem certeza absoluta que deseja remover e remover o cadastro de "${member.name}" de forma definitiva?`)) {
                            onDeleteTeamMember(member.id);
                          }
                        }}
                        className="text-zinc-400 hover:text-rose-600 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Deletar membro"
                      >
                        <Trash2 size={12} /> Excluir
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Times / Teams view */
        <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden flex flex-col">
          {/* Action Toolbar */}
          <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-left">
            <div>
              <h3 className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider font-mono">Times Operacionais</h3>
              <p className="text-[10px] text-zinc-400 mt-0.5">Cada time congrega profissionais sob a mentoria de um coordenador dedicado</p>
            </div>
            
            <button
              onClick={openTeamCreateModal}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-850 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer inline-flex"
            >
              <Plus size={14} />
              Criar Novo Time
            </button>
          </div>

          {/* Teams list layout */}
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            {teams.length === 0 ? (
              <div className="col-span-full py-12 text-center text-zinc-400 font-medium">
                <AlertCircle className="mx-auto text-zinc-300 mb-2" size={32} />
                <p className="text-sm">Nenhum time operacional estruturado.</p>
                <button
                  onClick={openTeamCreateModal}
                  className="mt-2 text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  Criar primeiro time →
                </button>
              </div>
            ) : (
              teams.map(team => {
                const membersInTeam = teamMembers.filter(m => m.teamId === team.id);
                const coordinatorObj = teamMembers.find(m => m.id === team.coordinatorId);
                
                return (
                  <div key={team.id} className="border border-zinc-200 rounded-xl p-5 bg-white flex flex-col justify-between hover:border-zinc-300 transition-all text-left">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-base text-zinc-800 tracking-tight">{team.name}</h4>
                        <span className="px-2 py-0.5 text-[10px] font-extrabold bg-zinc-100 text-zinc-600 rounded">
                          {membersInTeam.length} {membersInTeam.length === 1 ? 'membro' : 'membros'}
                        </span>
                      </div>

                      {/* Coordinator showcase card */}
                      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 mb-4 flex items-center gap-2.5">
                        <UserCheck className="text-zinc-600 shrink-0" size={16} />
                        <div className="truncate">
                          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Coordenador do Time</p>
                          <p 
                            onClick={() => coordinatorObj && onViewCollaboratorByName?.(coordinatorObj.name)}
                            className={`text-xs font-bold tracking-tight truncate ${coordinatorObj ? 'cursor-pointer hover:text-indigo-600 transition-colors' : 'text-zinc-400'}`}
                            title={coordinatorObj ? "Ver perfil completo do coordenador" : undefined}
                          >
                            {coordinatorObj ? coordinatorObj.name : 'Nenhum coordenador selecionado'}
                          </p>
                          {coordinatorObj?.supervisedDepartmentIds && coordinatorObj.supervisedDepartmentIds.length > 0 && (
                            <p className="text-[10px] text-zinc-500 mt-0.5 truncate">
                              Gere setores: <span className="font-semibold text-zinc-600">
                                {coordinatorObj.supervisedDepartmentIds.map(id => departments.find(d => d.id === id)?.name.replace(' Department', '').replace(' Team', '')).join(', ')}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Team Members roll */}
                      <div className="mb-4">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Composição do Time</p>
                        <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                          {membersInTeam.length === 0 ? (
                            <p className="text-[11px] text-zinc-400 italic">Equipe vazia. Vincule membros editando o cadastro deles.</p>
                          ) : (
                            membersInTeam.map(tm => (
                              <div key={tm.id} className="flex items-center justify-between text-xs bg-zinc-50/50 p-2 rounded-lg border border-zinc-100">
                                <div className="flex items-center gap-1.5 truncate">
                                  <div className="w-2 h-2 rounded-full bg-zinc-400 shrink-0" />
                                  <span 
                                    onClick={() => onViewCollaboratorByName?.(tm.name)}
                                    className="font-bold text-zinc-700 truncate cursor-pointer hover:text-indigo-600 transition-colors bg-transparent border-0 p-0 text-left"
                                    title="Ver perfil completo do colaborador"
                                  >
                                    {tm.name}
                                  </span>
                                </div>
                                <span className="text-[10px] text-zinc-500 ml-2 font-medium shrink-0">{tm.role}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between border-t border-zinc-150 pt-3 mt-2 text-xs">
                      <button
                        onClick={() => openTeamEditModal(team)}
                        className="text-zinc-500 hover:text-indigo-600 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Edit2 size={12} /> Configurar Time
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Tem certeza que deseja deletar o time "${team.name}"? Os membros vinculados a ele passarão a constar sem time.`)) {
                            onDeleteTeam(team.id);
                          }
                        }}
                        className="text-zinc-400 hover:text-rose-600 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 size={12} /> Excluir Time
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------
          MODAL: CRUD MEMBER
         ------------------------------------- */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-zinc-300 shadow-xl overflow-hidden flex flex-col text-left">
            <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
              <h3 className="font-bold text-zinc-800 font-display flex items-center gap-1.5">
                <User size={18} />
                {editingMember ? 'Editar Cadastro de Membro' : 'Cadastrar Novo Membro da Equipe'}
              </h3>
              <button 
                onClick={() => setIsMemberModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Fullname */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={memberName}
                    onChange={e => setMemberName(e.target.value)}
                    placeholder="ex: João Silva"
                    className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 bg-white"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Endereço de Email</label>
                  <input
                    type="email"
                    required
                    value={memberEmail}
                    onChange={e => setMemberEmail(e.target.value)}
                    placeholder="ex: joao@byb.ag"
                    className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Agency Role */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Cargo / Função</label>
                  <input
                    type="text"
                    required
                    value={memberRole}
                    onChange={e => setMemberRole(e.target.value)}
                    placeholder="ex: Copwriter Sênior, Designer Pleno"
                    className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 bg-white"
                  />
                </div>

                {/* Assigned Team */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Designar para o Time</label>
                  <select
                    value={memberTeamId}
                    onChange={e => setMemberTeamId(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                  >
                    <option value="">Sem time vinculado / Outros</option>
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Coordinator Checkbox status Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={memberIsCoordinator}
                    onChange={e => setMemberIsCoordinator(e.target.checked)}
                    className="rounded text-zinc-900 focus:ring-zinc-900 w-4 h-4"
                  />
                  <div>
                    <p className="text-xs font-bold text-zinc-800">É um Coordenador na Agência</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Permite vinculá-lo como coordenador de times e gerenciar múltiplos escopos</p>
                  </div>
                </label>
              </div>

              {/* Coordinator's Coordinated Team linkage field */}
              {memberIsCoordinator && (
                <div className="space-y-1 mt-3">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Time que este Colaborador Coordena</label>
                  <select
                    value={memberCoordinatedTeamId}
                    onChange={e => setMemberCoordinatedTeamId(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                  >
                    <option value="">Nenhum time especificamente</option>
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Responsible sectors list for Coordinator */}
              {memberIsCoordinator && (
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2 mt-2">
                  <p className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                    <Shield size={12} className="text-zinc-600" />
                    Responsabilidade de Escopo/Setor
                  </p>
                  <p className="text-[10px] text-zinc-400 pb-1">
                    Marque os setores que este coordenador lidera e monitora ("Um coordenador pode ser responsável por mais de um tipo de Escopo/Setor"):
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-1">
                    {departments.map(dept => {
                      const isChecked = memberSupervisedDepts.includes(dept.id);
                      return (
                        <button
                          type="button"
                          key={dept.id}
                          onClick={() => handleToggleDeptSupervision(dept.id)}
                          className={`px-3 py-2 rounded-lg border text-left flex items-center justify-between text-xs font-medium cursor-pointer transition-all ${
                            isChecked 
                              ? 'bg-zinc-900 text-white border-zinc-900' 
                              : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                          }`}
                        >
                          <span className="truncate">{dept.name}</span>
                          {isChecked ? <Check size={12} className="text-white shrink-0" /> : <div className="w-2.5 h-2.5 rounded-full border border-zinc-200 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-250 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 hover:bg-zinc-50 text-xs font-bold text-zinc-700 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-2 bg-zinc-900 hover:bg-zinc-850 text-xs font-bold text-white rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  Confirmar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------
          MODAL: CRUD TEAM
         ------------------------------------- */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md border border-zinc-300 shadow-xl overflow-hidden flex flex-col text-left">
            <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
              <h3 className="font-bold text-zinc-800 font-display flex items-center gap-1.5">
                <UserCheck size={18} />
                {editingTeam ? 'Editar Configuração de Time' : 'Criar Novo Time Operacional'}
              </h3>
              <button 
                onClick={() => setIsTeamModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTeam} className="p-6 space-y-4">
              {/* Team Name */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Nome do Time</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  placeholder="ex: Time Criativo Aliança, Performance Squad"
                  className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 bg-white"
                />
              </div>

              {/* Coordinator Selection */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Designar Coordenador</label>
                <select
                  value={teamCoordinatorId}
                  onChange={e => setTeamCoordinatorId(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-zinc-200 rounded-lg bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                >
                  <option value="">Selecione um Coordenador</option>
                  {teamMembers.filter(m => m.isCoordinator).map(coord => (
                    <option key={coord.id} value={coord.id}>
                      {coord.name} ({coord.role})
                    </option>
                  ))}
                </select>
                {teamMembers.filter(m => m.isCoordinator).length === 0 && (
                  <p className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1">
                    <AlertCircle size={10} className="text-zinc-500" />
                    Nenhum membro está marcado como "Coordenador". Edite ou crie um membro e ative essa opção primeiro.
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-250 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 hover:bg-zinc-50 text-xs font-bold text-zinc-700 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-2 bg-zinc-900 hover:bg-zinc-850 text-xs font-bold text-white rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  Salvar Time
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
