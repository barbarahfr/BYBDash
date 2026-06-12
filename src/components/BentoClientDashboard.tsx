/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Client, Department } from '../types';
import { 
  FolderGit, 
  Layers, 
  ExternalLink, 
  Target, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  X, 
  AlertCircle,
  Clock,
  Compass,
  FileCheck2,
  Mail,
  User,
  Info,
  Trash2
} from 'lucide-react';

interface BentoClientDashboardProps {
  clients: Client[];
  departments: Department[];
  selectedClientId: string;
  onSelectClient: (id: string) => void;
  onEditClientClick: (client: Client) => void;
  onConfigureScopeClick: () => void;
  onDeleteClientClick: (id: string) => void;
  onUpdateSatisfaction?: (id: string, rating: number) => void;
  onViewCollaboratorByName?: (name: string) => void;
}

export default function BentoClientDashboard({
  clients,
  departments,
  selectedClientId,
  onSelectClient,
  onEditClientClick,
  onConfigureScopeClick,
  onDeleteClientClick,
  onUpdateSatisfaction,
  onViewCollaboratorByName
}: BentoClientDashboardProps) {
  
  // Find currently selected client
  const currentClient = clients.find(c => c.id === selectedClientId) || clients[0];

  if (!currentClient) {
    return (
      <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center text-zinc-500 my-4 shadow-xs">
        <AlertCircle className="mx-auto text-zinc-400 mb-2" size={32} />
        <h4 className="font-semibold text-zinc-800">No Clients Registered</h4>
        <p className="text-xs text-zinc-500 mt-1">Please register a client profile first to generate the Bento Scope Matrix.</p>
      </div>
    );
  }

  // Calculate high-fidelity metrics
  // Tasks currently assigned to this active client
  const clientAssignedCount = Object.values(currentClient.scope).reduce<number>((acc, list) => {
    return acc + ((list as string[])?.length || 0);
  }, 0);

  // Volume Classification helper based on tasks assigned
  const getVolumeLevel = (count: number) => {
    if (count === 0) return { label: 'Sem Tarefas', color: 'text-zinc-500 bg-zinc-50 border-zinc-200', barColor: 'bg-zinc-200', width: 5 };
    if (count <= 3) return { label: 'Volume Baixo', color: 'text-blue-600 bg-blue-50 border-blue-200', barColor: 'bg-blue-500', width: 33 };
    if (count <= 7) return { label: 'Volume Médio', color: 'text-amber-600 bg-amber-50 border-amber-200', barColor: 'bg-amber-500', width: 66 };
    return { label: 'Volume Alto', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', barColor: 'bg-emerald-500', width: 100 };
  };

  const volume = getVolumeLevel(clientAssignedCount);

  // Formatting helper for avatar bubble
  const getInitials = (name: string) => {
    return name
      ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
      : '??';
  };

  // Ranking indicator class
  const getRankBadgeClass = (rank: string) => {
    switch (rank) {
      case 'A': return 'bg-zinc-900 border-zinc-800 text-white';
      case 'B': return 'bg-amber-100 border-amber-200 text-amber-800';
      case 'C': return 'bg-blue-100 border-blue-200 text-blue-800';
      default: return 'bg-zinc-100 border-zinc-200 text-zinc-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Selector Header inside Bento Block */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-zinc-200 shadow-xs mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-900 text-white rounded-lg flex items-center justify-center font-bold font-display text-lg shadow-sm">
            B
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm text-zinc-800">
              Interactive Live Spotlight
            </h3>
            <p className="text-xs text-zinc-500">Pick any client to instantly populate the high-fidelity Bento Grid below.</p>
          </div>
        </div>

        {/* Client Picker Selector bar */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center bg-zinc-100 rounded-lg px-3 py-1.5 border border-zinc-200 w-full sm:w-auto">
            <span className="text-[10px] font-bold text-zinc-500 mr-2 uppercase tracking-wider shrink-0">Bento Target:</span>
            <select 
              value={currentClient.id}
              onChange={e => onSelectClient(e.target.value)}
              className="bg-transparent text-xs font-bold text-zinc-800 outline-hidden border-none cursor-pointer w-full focus:ring-0"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id} className="text-zinc-800 font-medium">
                  {c.name} ({c.ranking})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onEditClientClick(currentClient)}
            className="px-3.5 py-1.5 text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg transition-colors cursor-pointer"
          >
            Edit Profile
          </button>

          <button
            onClick={() => {
              if (window.confirm(`Tem certeza absoluta que deseja excluir o cliente "${currentClient.name}" de forma permanente?`)) {
                onDeleteClientClick(currentClient.id);
              }
            }}
            className="px-3.5 py-1.5 text-xs font-semibold text-rose-600 bg-white border border-rose-200 hover:bg-rose-50/50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            title="Excluir cliente"
          >
            <Trash2 size={12} />
            Excluir Registro
          </button>
        </div>
      </div>

      {/* Grid container layout mirroring Bento HTML */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-auto">
        
        {/* 1. Client Identity Card (col-span-4) */}
        <div className="md:col-span-4 bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-zinc-300 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-50 rounded-full -mr-16 -mt-16 -z-0 opacity-40 group-hover:scale-110 transition-transform" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-zinc-900 text-white rounded-2xl flex items-center justify-center font-bold text-xl font-display shadow-xs">
                {getInitials(currentClient.name)}
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getRankBadgeClass(currentClient.ranking)}`}>
                {currentClient.ranking}
              </span>
            </div>

            <h2 className="text-xl font-bold text-zinc-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">
              {currentClient.name}
            </h2>
            <div className="text-zinc-400 text-xs mt-1 font-mono font-medium truncate">
              {currentClient.contactEmail || 'No contact mail'}
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-50 border border-zinc-100 text-zinc-700 text-[11px] font-medium">
              <span className={`inline-block w-2 h-2 rounded-full ${
                currentClient.status === 'Active' ? 'bg-emerald-500' :
                currentClient.status === 'Onboarding' ? 'bg-amber-500' :
                currentClient.status === 'Paused' ? 'bg-orange-500' : 'bg-zinc-400'
              }`} />
              <span>Status: <strong className="font-semibold">{currentClient.status}</strong></span>
            </div>
          </div>

          <div className="space-y-3 mt-6 border-t border-zinc-100 pt-4 relative z-10 text-left">
            <div className="flex justify-between text-xs pb-1">
              <span className="text-zinc-400 font-bold uppercase text-[9px] tracking-wider">Approach Type</span>
              <span className="font-extrabold text-zinc-800">{currentClient.marketApproach} approach</span>
            </div>
            <div className="flex justify-between text-xs pb-1">
              <span className="text-zinc-400 font-bold uppercase text-[9px] tracking-wider">Market Segment</span>
              <span className="font-bold text-zinc-800 truncate max-w-[170px]" title={currentClient.segment}>
                {currentClient.segment || 'Other / Generic'}
              </span>
            </div>

            {/* Satisfaction Thermometer inside Client Card */}
            <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 font-bold uppercase text-[9px] tracking-wider">Termômetro de Satisfação</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0.5 rounded border border-indigo-100 uppercase tracking-wide">
                  {currentClient.satisfactionRating === 1 ? '1/5' :
                   currentClient.satisfactionRating === 2 ? '2/5' :
                   currentClient.satisfactionRating === 3 ? '3/5' :
                   currentClient.satisfactionRating === 4 ? '4/5' :
                   '5/5'}
                </span>
              </div>
              <div className="flex items-center justify-between bg-zinc-50/70 hover:bg-zinc-50 rounded-xl p-2.5 border border-zinc-100 transition-colors">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((level) => {
                    const ratings = [
                      { emoji: '🔴', activeBg: 'bg-red-500 text-white border-red-500 scale-105 shadow-xs', hover: 'hover:bg-red-50' },
                      { emoji: '🟠', activeBg: 'bg-orange-500 text-white border-orange-500 scale-105 shadow-xs', hover: 'hover:bg-orange-50' },
                      { emoji: '🟡', activeBg: 'bg-amber-400 text-zinc-900 border-amber-400 scale-105 shadow-xs', hover: 'hover:bg-amber-50' },
                      { emoji: '🟢', activeBg: 'bg-emerald-500 text-white border-emerald-500 scale-105 shadow-xs', hover: 'hover:bg-emerald-50' },
                      { emoji: '🔵', activeBg: 'bg-indigo-600 text-white border-indigo-600 scale-105 shadow-xs', hover: 'hover:bg-indigo-50' }
                    ];
                    const cfg = ratings[level - 1];
                    const rating = currentClient.satisfactionRating || 5;
                    const isSelected = rating === level;

                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => onUpdateSatisfaction?.(currentClient.id, level)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10.5px] border select-none cursor-pointer transition-all ${
                          isSelected 
                            ? `${cfg.activeBg} font-extrabold` 
                            : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300'
                        }`}
                        title={
                          level === 1 ? '🔴 Muito Insatisfeito' :
                          level === 2 ? '🟠 Insatisfeito' :
                          level === 3 ? '🟡 Neutro' :
                          level === 4 ? '🟢 Satisfeito' :
                          '🔵 Totalmente Satisfeito'
                        }
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
                <div className="text-right pl-2">
                  <span className="text-[10px] font-bold text-zinc-700 block">
                    {currentClient.satisfactionRating === 1 ? 'Muito Insatisfeito' :
                     currentClient.satisfactionRating === 2 ? 'Insatisfeito' :
                     currentClient.satisfactionRating === 3 ? 'Neutro' :
                     currentClient.satisfactionRating === 4 ? 'Satisfeito' :
                     'Totalmente Satisfeito'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Assigned Team (col-span-5) */}
        <div className="md:col-span-5 bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col justify-between shadow-xs hover:border-zinc-300 transition-all">
          <div className="text-left">
            <h3 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-4">
              Staff &amp; Sector Assignments
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
              <div 
                onClick={() => currentClient.responsibles.serviceLiaison && currentClient.responsibles.serviceLiaison !== '—' && currentClient.responsibles.serviceLiaison !== 'Unassigned' && onViewCollaboratorByName?.(currentClient.responsibles.serviceLiaison)}
                className={`p-3 bg-zinc-50 rounded-xl border border-zinc-100 transition-all ${
                  currentClient.responsibles.serviceLiaison && currentClient.responsibles.serviceLiaison !== '—' && currentClient.responsibles.serviceLiaison !== 'Unassigned'
                    ? 'cursor-pointer hover:bg-zinc-100 hover:border-zinc-300'
                    : ''
                }`}
                title={currentClient.responsibles.serviceLiaison && currentClient.responsibles.serviceLiaison !== 'Unassigned' ? "Ver perfil detalhado do Account Manager" : undefined}
              >
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Account Manager</p>
                <p className={`text-xs font-bold mt-1 truncate ${
                  currentClient.responsibles.serviceLiaison && currentClient.responsibles.serviceLiaison !== '—' && currentClient.responsibles.serviceLiaison !== 'Unassigned'
                    ? 'text-indigo-600 hover:underline'
                    : 'text-zinc-400'
                }`}>
                  {currentClient.responsibles.serviceLiaison || '—'}
                </p>
              </div>

              <div 
                onClick={() => currentClient.responsibles.writer && currentClient.responsibles.writer !== '—' && currentClient.responsibles.writer !== 'Unassigned' && onViewCollaboratorByName?.(currentClient.responsibles.writer)}
                className={`p-3 bg-zinc-50 rounded-xl border border-zinc-100 transition-all ${
                  currentClient.responsibles.writer && currentClient.responsibles.writer !== '—' && currentClient.responsibles.writer !== 'Unassigned'
                    ? 'cursor-pointer hover:bg-zinc-100 hover:border-zinc-300'
                    : ''
                }`}
                title={currentClient.responsibles.writer && currentClient.responsibles.writer !== '—' ? "Ver perfil detalhado do Copywriter" : undefined}
              >
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Department Copy</p>
                <p className={`text-xs font-bold mt-1 truncate ${
                  currentClient.responsibles.writer && currentClient.responsibles.writer !== '—' && currentClient.responsibles.writer !== 'Unassigned'
                    ? 'text-indigo-600 hover:underline'
                    : 'text-zinc-400'
                }`}>
                  {currentClient.responsibles.writer || '—'}
                </p>
              </div>

              <div 
                onClick={() => currentClient.responsibles.designer && currentClient.responsibles.designer !== '—' && currentClient.responsibles.designer !== 'Unassigned' && onViewCollaboratorByName?.(currentClient.responsibles.designer)}
                className={`p-3 bg-zinc-50 rounded-xl border border-zinc-100 transition-all ${
                  currentClient.responsibles.designer && currentClient.responsibles.designer !== '—' && currentClient.responsibles.designer !== 'Unassigned'
                    ? 'cursor-pointer hover:bg-zinc-100 hover:border-zinc-300'
                    : ''
                }`}
                title={currentClient.responsibles.designer && currentClient.responsibles.designer !== '—' ? "Ver perfil detalhado do Designer" : undefined}
              >
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Creative Designer</p>
                <p className={`text-xs font-bold mt-1 truncate ${
                  currentClient.responsibles.designer && currentClient.responsibles.designer !== '—' && currentClient.responsibles.designer !== 'Unassigned'
                    ? 'text-indigo-600 hover:underline'
                    : 'text-zinc-400'
                }`}>
                  {currentClient.responsibles.designer || '—'}
                </p>
              </div>

              <div 
                onClick={() => currentClient.responsibles.paidTrafficHandler && currentClient.responsibles.paidTrafficHandler !== '—' && currentClient.responsibles.paidTrafficHandler !== 'Unassigned' && onViewCollaboratorByName?.(currentClient.responsibles.paidTrafficHandler)}
                className={`p-3 bg-zinc-50 rounded-xl border border-zinc-100 transition-all ${
                  currentClient.responsibles.paidTrafficHandler && currentClient.responsibles.paidTrafficHandler !== '—' && currentClient.responsibles.paidTrafficHandler !== 'Unassigned'
                    ? 'cursor-pointer hover:bg-zinc-100 hover:border-zinc-300'
                    : ''
                }`}
                title={currentClient.responsibles.paidTrafficHandler && currentClient.responsibles.paidTrafficHandler !== '—' ? "Ver perfil detalhado do Gestor de Tráfego" : undefined}
              >
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Paid Traffic Specialist</p>
                <p className={`text-xs font-bold mt-1 truncate ${
                  currentClient.responsibles.paidTrafficHandler && currentClient.responsibles.paidTrafficHandler !== '—' && currentClient.responsibles.paidTrafficHandler !== 'Unassigned'
                    ? 'text-indigo-600 hover:underline'
                    : 'text-zinc-400'
                }`}>
                  {currentClient.responsibles.paidTrafficHandler || '—'}
                </p>
              </div>

              <div 
                onClick={() => currentClient.responsibles.socialMedia && currentClient.responsibles.socialMedia !== '—' && currentClient.responsibles.socialMedia !== 'Unassigned' && onViewCollaboratorByName?.(currentClient.responsibles.socialMedia)}
                className={`p-3 bg-zinc-50 rounded-xl border border-zinc-100 col-span-2 lg:col-span-1 transition-all ${
                  currentClient.responsibles.socialMedia && currentClient.responsibles.socialMedia !== '—' && currentClient.responsibles.socialMedia !== 'Unassigned'
                    ? 'cursor-pointer hover:bg-zinc-100 hover:border-zinc-300'
                    : ''
                }`}
                title={currentClient.responsibles.socialMedia && currentClient.responsibles.socialMedia !== '—' ? "Ver perfil detalhado do Social Media" : undefined}
              >
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Social Media Specialist</p>
                <p className={`text-xs font-bold mt-1 truncate ${
                  currentClient.responsibles.socialMedia && currentClient.responsibles.socialMedia !== '—' && currentClient.responsibles.socialMedia !== 'Unassigned'
                    ? 'text-indigo-600 hover:underline'
                    : 'text-zinc-400'
                }`}>
                  {currentClient.responsibles.socialMedia || '—'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-100 text-left">
            <div className="flex justify-between items-center mb-1.5 flex-wrap gap-2">
              <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Active Scope Workload</p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-800">{clientAssignedCount} {clientAssignedCount === 1 ? 'tarefa' : 'tarefas'}</span>
                <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${volume.color}`}>
                  {volume.label}
                </span>
              </div>
            </div>
            <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${volume.barColor}`} 
                style={{ width: `${volume.width}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. Communication Objectives (col-span-3) */}
        <div className="md:col-span-3 bg-zinc-900 rounded-2xl p-6 text-white shadow-md flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mb-16 -mr-16 pointer-events-none" />
          
          <div className="space-y-4 text-left">
            <h3 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Target size={12} className="text-indigo-400" />
              Strategic Goals
            </h3>
            
            <div className="max-h-[160px] overflow-y-auto custom-scrollbar-slate pr-1 space-y-3 pb-2 text-xs">
              {currentClient.communicationObjectives ? (
                currentClient.communicationObjectives.split('\n').filter(Boolean).map((obj, i) => (
                  <div key={i} className="flex gap-2.5">
                    <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <p className="leading-normal text-zinc-200 text-[11px]">{obj}</p>
                  </div>
                ))
              ) : (
                <div className="text-zinc-500 py-4 text-center italic text-[11px]">
                  No communication objectives registered for this client. Pick "Edit Profile" above to append objectives.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400 font-mono shrink-0">
            <span>byb.ag Plan</span>
            <span>Est 2026</span>
          </div>
        </div>

        {/* 4. Sector & Task Matrix (col-span-9) */}
        <div className="md:col-span-9 bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col justify-between shadow-xs hover:border-zinc-300 transition-all">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-100">
            <h3 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Layers size={13} className="text-zinc-500" />
              Dynamic Scope matrix & Department List
            </h3>
            <button 
              onClick={onConfigureScopeClick}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-all cursor-pointer select-none"
            >
              Configure Scope Map →
            </button>
          </div>

          {(() => {
            const activeDepartments = departments.filter(dept => {
              const assignedTaskIds = currentClient.scope[dept.id] || [];
              return assignedTaskIds.length > 0;
            });

            if (activeDepartments.length === 0) {
              return (
                <div className="text-center py-8 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                  <p className="text-xs text-zinc-500 font-medium">Nenhum setor ou tarefa ativa no escopo deste cliente.</p>
                  <button 
                    onClick={onConfigureScopeClick}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 transition-all cursor-pointer underline"
                  >
                    Configurar agora
                  </button>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                {activeDepartments.map(dept => {
                  const assignedTaskIds = currentClient.scope[dept.id] || [];
                  const activeTasks = dept.tasks.filter(task => assignedTaskIds.includes(task.id));

                  return (
                    <div key={dept.id} className="bg-zinc-50 rounded-xl p-4 border border-zinc-100 flex flex-col justify-between min-h-[140px]">
                      <div>
                        <p className="text-xs font-semibold text-zinc-800 mb-3 flex items-center gap-2">
                          <span className={`w-2 h-4 rounded-sm ${
                            dept.color === 'emerald' ? 'bg-emerald-500' :
                            dept.color === 'purple' ? 'bg-purple-500' :
                            dept.color === 'blue' ? 'bg-blue-500' :
                            dept.color === 'amber' ? 'bg-amber-500' : 'bg-rose-500'
                          }`} /> 
                          {dept.name}
                        </p>
                        
                        <div className="space-y-1.5 max-h-[150px] overflow-y-auto custom-scrollbar pr-0.5">
                          {activeTasks.map(task => (
                            <div 
                              key={task.id} 
                              className="text-[11px] bg-white p-1.5 border border-zinc-200 rounded-md flex justify-between items-center transition-all hover:bg-zinc-50/50"
                            >
                              <span className="font-semibold text-zinc-700 truncate max-w-[130px] pr-2" title={task.name}>
                                {task.name}
                              </span>
                              <span className="text-[9px] font-bold text-emerald-600 uppercase bg-emerald-50 px-1 py-0.5 rounded shrink-0">
                                Ativo
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* 5. Resources & Documentation (col-span-3) */}
        <div className="md:col-span-3 flex flex-col justify-between gap-4">
          
          {currentClient.driveFolderLink ? (
            <a 
              href={currentClient.driveFolderLink} 
              target="_blank" 
              referrerPolicy="no-referrer"
              rel="noopener noreferrer"
              className="flex-1 bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col justify-center items-center gap-3 hover:bg-zinc-50 transition-all shadow-xs group cursor-pointer text-center"
            >
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform font-display shadow-2xs">
                D
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-800">Google Drive Folder</p>
                <p className="text-[9px] text-zinc-400 uppercase tracking-widest font-mono mt-0.5">Asset Repository <ExternalLink size={8} className="inline ml-0.5" /></p>
              </div>
            </a>
          ) : (
            <div className="flex-1 bg-white/70 border border-dashed border-zinc-200 rounded-2xl p-6 flex flex-col justify-center items-center gap-1.5 text-center cursor-not-allowed text-zinc-400">
              <div className="w-10 h-10 bg-zinc-100 text-zinc-300 rounded-xl flex items-center justify-center font-bold font-display">
                D
              </div>
              <p className="text-xs font-semibold">Drive Link Missing</p>
              <p className="text-[9px] uppercase font-mono">No active storage URL</p>
            </div>
          )}

          {currentClient.annualPlanningLink ? (
            <a 
              href={currentClient.annualPlanningLink} 
              target="_blank" 
              referrerPolicy="no-referrer"
              rel="noopener noreferrer"
              className="flex-1 bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col justify-center items-center gap-3 hover:bg-zinc-50 transition-all shadow-xs group cursor-pointer text-center"
            >
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform font-display shadow-2xs">
                P
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-800">Annual Strategy Plan</p>
                <p className="text-[9px] text-zinc-400 uppercase tracking-widest font-mono mt-0.5">Goals Spreadsheet <ExternalLink size={8} className="inline ml-0.5" /></p>
              </div>
            </a>
          ) : (
            <div className="flex-1 bg-white/70 border border-dashed border-zinc-200 rounded-2xl p-6 flex flex-col justify-center items-center gap-1.5 text-center cursor-not-allowed text-zinc-400">
              <div className="w-10 h-10 bg-zinc-100 text-zinc-300 rounded-xl flex items-center justify-center font-bold font-display">
                P
              </div>
              <p className="text-xs font-semibold">Planning Sheet Missing</p>
              <p className="text-[9px] uppercase font-mono">No active strategy URL</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
