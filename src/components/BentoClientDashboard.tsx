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

const GoogleDriveIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 512 512" className="w-6 h-6 shrink-0" fill="none">
    <path d="M339 345l87-150-136-235H123L36 110l136 235z" fill={active ? "#FFC107" : "#cbd5e1"}/>
    <path d="M172 345L85 495h271l87-150H172z" fill={active ? "#2196F3" : "#94a3b8"}/>
    <path d="M36 110l136 235 86-150L122 45 36 110z" fill={active ? "#4CAF50" : "#64748b"}/>
  </svg>
);

const GoogleSlidesIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="2" fill={active ? "#FFC107" : "#94a3b8"} />
    <path d="M6 7h12v7H6V7z" fill="#FFF" />
    <line x1="8" y1="17" x2="16" y2="17" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12" y1="14" x2="12" y2="17" stroke="#FFF" strokeWidth="1.5" />
    <circle cx="12" cy="10" r="1.5" fill={active ? "#FFC107" : "#94a3b8"} />
  </svg>
);

const OperandIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none" strokeWidth="3" strokeLinecap="round">
    <circle cx="12" cy="12" r="8.5" stroke={active ? "#00A3FF" : "#94a3b8"} strokeWidth="3" className="opacity-80" />
    <path d="M12 3.5 A 8.5 8.5 0 0 1 20.5 12" stroke={active ? "#0057FF" : "#64748b"} strokeWidth="3" />
  </svg>
);

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
  
  // Encontra o cliente atualmente selecionado
  const currentClient = clients.find(c => c.id === selectedClientId) || clients[0];

  if (!currentClient) {
    return (
      <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center text-zinc-500 my-4 shadow-xs text-left">
        <AlertCircle className="mx-auto text-zinc-400 mb-2" size={32} />
        <h4 className="font-semibold text-zinc-805">Nenhum Cliente Cadastrado</h4>
        <p className="text-xs text-zinc-500 mt-1">Por favor, cadastre uma empresa na aba de Clientes para gerar o dashboard dinâmico.</p>
      </div>
    );
  }

  // Calcula o total de tarefas ativas desse cliente
  const clientAssignedCount = Object.values(currentClient.scope).reduce<number>((acc, list) => {
    return acc + ((list as string[])?.length || 0);
  }, 0);

  // Classificação do volume de entregas contratadas
  const getVolumeLevel = (count: number) => {
    if (count === 0) return { label: 'Sem Entregas', color: 'text-zinc-500 bg-zinc-50 border-zinc-200', barColor: 'bg-zinc-200', width: 5 };
    if (count <= 3) return { label: 'Inbound Compacto', color: 'text-blue-600 bg-blue-50 border-blue-200', barColor: 'bg-blue-500', width: 33 };
    if (count <= 7) return { label: 'Inbound Standard', color: 'text-amber-600 bg-amber-50 border-amber-200', barColor: 'bg-amber-500', width: 66 };
    return { label: 'Inbound Full Performance', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', barColor: 'bg-emerald-500', width: 100 };
  };

  const volume = getVolumeLevel(clientAssignedCount);

  // Iniciais do Avatar
  const getInitials = (name: string) => {
    return name
      ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
      : '??';
  };

  // Cores CSS dos Tiers
  const getRankBadgeClass = (rank: string) => {
    switch (rank) {
      case 'A': return 'bg-zinc-900 border-zinc-800 text-white font-extrabold';
      case 'B': return 'bg-amber-50 border-amber-200 text-amber-800 font-extrabold';
      case 'C': return 'bg-blue-50 border-blue-200 text-blue-800 font-extrabold';
      default: return 'bg-zinc-100 border-zinc-200 text-zinc-650 font-extrabold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Seleção do Cliente */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-zinc-200 shadow-xs mb-2">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold font-display text-lg shadow-sm">
            B
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-zinc-800">
              Painel Spotlight Interativo
            </h3>
            <p className="text-xs text-zinc-500">Escolha qualquer cliente de sua carteira para carregar seu Bento Grid operacional automaticamente.</p>
          </div>
        </div>

        {/* Barra de Seleção de Empresa */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center bg-zinc-100 rounded-lg px-3 py-1.5 border border-zinc-200 w-full sm:w-auto">
            <span className="text-[10px] font-bold text-zinc-505 mr-2 uppercase tracking-wider shrink-0">Empresa Ativa:</span>
            <select 
              value={currentClient.id}
              onChange={e => onSelectClient(e.target.value)}
              className="bg-transparent text-xs font-bold text-zinc-800 border-none outline-hidden cursor-pointer w-full focus:ring-0"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id} className="text-zinc-800 font-medium">
                  {c.name} (Tier {c.ranking})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onEditClientClick(currentClient)}
            className="px-3.5 py-1.5 text-xs font-bold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg transition-colors cursor-pointer"
          >
            Editar Perfil
          </button>

          <button
            onClick={() => {
              if (window.confirm(`Tem certeza absoluta que deseja excluir o cliente "${currentClient.name}" de forma permanente?`)) {
                onDeleteClientClick(currentClient.id);
              }
            }}
            className="px-3.5 py-1.5 text-xs font-bold text-rose-600 bg-white border border-rose-200 hover:bg-rose-50/50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            title="Excluir cliente"
          >
            <Trash2 size={12} />
            Excluir Registro
          </button>
        </div>
      </div>

      {/* Grid Bento Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-auto">
        
        {/* 1. Visão de Escopo Básica (col-span-4) */}
        <div className="md:col-span-4 bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:border-zinc-300 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-50 rounded-full -mr-16 -mt-16 -z-0 opacity-40 group-hover:scale-110 transition-transform" />
          
          <div className="relative z-10 text-left">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-zinc-900 text-white rounded-2xl flex items-center justify-center font-bold text-xl font-display shadow-xs">
                {getInitials(currentClient.name)}
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getRankBadgeClass(currentClient.ranking)}`}>
                Tier {currentClient.ranking}
              </span>
            </div>

            <h2 className="text-xl font-bold text-zinc-900 tracking-tight leading-snug group-hover:text-indigo-650 transition-colors">
              {currentClient.name}
            </h2>
            <div className="text-zinc-400 text-xs mt-1 font-mono font-medium truncate">
              {currentClient.contactEmail || 'E-mail de contato não configurado'}
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-150 text-zinc-700 text-[11px] font-semibold">
              <span className={`inline-block w-2 h-2 rounded-full ${
                currentClient.status === 'Active' ? 'bg-emerald-500' :
                currentClient.status === 'Onboarding' ? 'bg-amber-500' :
                currentClient.status === 'Paused' ? 'bg-orange-500' : 'bg-zinc-400'
              }`} />
              <span>Status Operacional: <strong className="font-bold">{
                currentClient.status === 'Active' ? 'Ativo' :
                currentClient.status === 'Onboarding' ? 'Integração' :
                currentClient.status === 'Paused' ? 'Pausado / Standby' : currentClient.status
              }</strong></span>
            </div>
          </div>

          <div className="space-y-3 mt-6 border-t border-zinc-100 pt-4 relative z-10 text-left">
            <div className="flex justify-between text-xs pb-1">
              <span className="text-zinc-400 font-bold uppercase text-[9px] tracking-wider">Tipo de Abordagem</span>
              <span className="font-extrabold text-zinc-800">{currentClient.marketApproach}</span>
            </div>
            <div className="flex justify-between text-xs pb-1">
              <span className="text-zinc-400 font-bold uppercase text-[9px] tracking-wider">Segmento do Mercado</span>
              <span className="font-bold text-zinc-800 truncate max-w-[170px]" title={currentClient.segment}>
                {currentClient.segment || 'Outros / Gerais'}
              </span>
            </div>

            {/* Termômetro de Satisfação no Card */}
            <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 font-bold uppercase text-[9px] tracking-wider">Termômetro de Satisfação</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-650 font-bold px-1.5 py-0.5 rounded border border-indigo-100 uppercase tracking-wide">
                  Nota {currentClient.satisfactionRating || 5}/5
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
                  <span className="text-[10px] font-bold text-zinc-700 block text-right">
                    {currentClient.satisfactionRating === 1 ? 'Crítico' :
                     currentClient.satisfactionRating === 2 ? 'Insatisfeito' :
                     currentClient.satisfactionRating === 3 ? 'Estável' :
                     currentClient.satisfactionRating === 4 ? 'Satisfeito' :
                     'Encantado'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Equipe Responsável (col-span-5) */}
        <div className="md:col-span-5 bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col justify-between shadow-xs hover:border-zinc-300 transition-all">
          <div className="text-left">
            <h3 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-4 font-mono">
              Equipe Operacional Atribuída ao Escopo
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
              <div 
                onClick={() => currentClient.responsibles.serviceLiaison && currentClient.responsibles.serviceLiaison !== '—' && currentClient.responsibles.serviceLiaison !== 'Unassigned' && onViewCollaboratorByName?.(currentClient.responsibles.serviceLiaison)}
                className={`p-3 bg-zinc-50 rounded-xl border border-zinc-100 transition-all ${
                  currentClient.responsibles.serviceLiaison && currentClient.responsibles.serviceLiaison !== '—' && currentClient.responsibles.serviceLiaison !== 'Unassigned'
                    ? 'cursor-pointer hover:bg-zinc-101 hover:border-zinc-300'
                    : ''
                }`}
                title={currentClient.responsibles.serviceLiaison && currentClient.responsibles.serviceLiaison !== 'Unassigned' ? "Ver perfil do CS" : undefined}
              >
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">CS / Atendimento</p>
                <p className={`text-xs font-bold mt-1 truncate ${
                  currentClient.responsibles.serviceLiaison && currentClient.responsibles.serviceLiaison !== '—' && currentClient.responsibles.serviceLiaison !== 'Unassigned'
                    ? 'text-indigo-600 hover:underline font-extrabold'
                    : 'text-zinc-400'
                }`}>
                  {currentClient.responsibles.serviceLiaison || '—'}
                </p>
              </div>

              <div 
                onClick={() => currentClient.responsibles.writer && currentClient.responsibles.writer !== '—' && currentClient.responsibles.writer !== 'Unassigned' && onViewCollaboratorByName?.(currentClient.responsibles.writer)}
                className={`p-3 bg-zinc-50 rounded-xl border border-zinc-100 transition-all ${
                  currentClient.responsibles.writer && currentClient.responsibles.writer !== '—' && currentClient.responsibles.writer !== 'Unassigned'
                    ? 'cursor-pointer hover:bg-zinc-101 hover:border-zinc-300'
                    : ''
                }`}
                title={currentClient.responsibles.writer && currentClient.responsibles.writer !== '—' ? "Ver perfil do Copywriter" : undefined}
              >
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Redator / Copy</p>
                <p className={`text-xs font-bold mt-1 truncate ${
                  currentClient.responsibles.writer && currentClient.responsibles.writer !== '—' && currentClient.responsibles.writer !== 'Unassigned'
                    ? 'text-indigo-600 hover:underline font-extrabold'
                    : 'text-zinc-400'
                }`}>
                  {currentClient.responsibles.writer || '—'}
                </p>
              </div>

              <div 
                onClick={() => currentClient.responsibles.designer && currentClient.responsibles.designer !== '—' && currentClient.responsibles.designer !== 'Unassigned' && onViewCollaboratorByName?.(currentClient.responsibles.designer)}
                className={`p-3 bg-zinc-50 rounded-xl border border-zinc-100 transition-all ${
                  currentClient.responsibles.designer && currentClient.responsibles.designer !== '—' && currentClient.responsibles.designer !== 'Unassigned'
                    ? 'cursor-pointer hover:bg-zinc-101 hover:border-zinc-300'
                    : ''
                }`}
                title={currentClient.responsibles.designer && currentClient.responsibles.designer !== '—' ? "Ver perfil do Designer" : undefined}
              >
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Criação / Design</p>
                <p className={`text-xs font-bold mt-1 truncate ${
                  currentClient.responsibles.designer && currentClient.responsibles.designer !== '—' && currentClient.responsibles.designer !== 'Unassigned'
                    ? 'text-indigo-600 hover:underline font-extrabold'
                    : 'text-zinc-400'
                }`}>
                  {currentClient.responsibles.designer || '—'}
                </p>
              </div>

              <div 
                onClick={() => currentClient.responsibles.paidTrafficHandler && currentClient.responsibles.paidTrafficHandler !== '—' && currentClient.responsibles.paidTrafficHandler !== 'Unassigned' && onViewCollaboratorByName?.(currentClient.responsibles.paidTrafficHandler)}
                className={`p-3 bg-zinc-50 rounded-xl border border-zinc-100 transition-all ${
                  currentClient.responsibles.paidTrafficHandler && currentClient.responsibles.paidTrafficHandler !== '—' && currentClient.responsibles.paidTrafficHandler !== 'Unassigned'
                    ? 'cursor-pointer hover:bg-zinc-101 hover:border-zinc-300'
                    : ''
                }`}
                title={currentClient.responsibles.paidTrafficHandler && currentClient.responsibles.paidTrafficHandler !== '—' ? "Ver perfil do Gestor de Tráfego" : undefined}
              >
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Mídia / Tráfego</p>
                <p className={`text-xs font-bold mt-1 truncate ${
                  currentClient.responsibles.paidTrafficHandler && currentClient.responsibles.paidTrafficHandler !== '—' && currentClient.responsibles.paidTrafficHandler !== 'Unassigned'
                    ? 'text-indigo-600 hover:underline font-extrabold'
                    : 'text-zinc-400'
                }`}>
                  {currentClient.responsibles.paidTrafficHandler || '—'}
                </p>
              </div>

              <div 
                onClick={() => currentClient.responsibles.socialMedia && currentClient.responsibles.socialMedia !== '—' && currentClient.responsibles.socialMedia !== 'Unassigned' && onViewCollaboratorByName?.(currentClient.responsibles.socialMedia)}
                className={`p-3 bg-zinc-50 rounded-xl border border-zinc-100 col-span-2 lg:col-span-1 transition-all ${
                  currentClient.responsibles.socialMedia && currentClient.responsibles.socialMedia !== '—' && currentClient.responsibles.socialMedia !== 'Unassigned'
                    ? 'cursor-pointer hover:bg-zinc-101 hover:border-zinc-300'
                    : ''
                }`}
                title={currentClient.responsibles.socialMedia && currentClient.responsibles.socialMedia !== '—' ? "Ver perfil de Social Media" : undefined}
              >
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Social Media</p>
                <p className={`text-xs font-bold mt-1 truncate ${
                  currentClient.responsibles.socialMedia && currentClient.responsibles.socialMedia !== '—' && currentClient.responsibles.socialMedia !== 'Unassigned'
                    ? 'text-indigo-600 hover:underline font-extrabold'
                    : 'text-zinc-400'
                }`}>
                  {currentClient.responsibles.socialMedia || '—'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-100 text-left">
            <div className="flex justify-between items-center mb-1.5 flex-wrap gap-2">
              <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest font-mono">Volume de Escopo Contratado</p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-800">{clientAssignedCount} {clientAssignedCount === 1 ? 'tarefa ativa' : 'tarefas ativas'}</span>
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

        {/* 3. Objetivos e Dores (col-span-3) */}
        <div className="md:col-span-3 bg-zinc-900 rounded-2xl p-6 text-white shadow-md flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mb-16 -mr-16 pointer-events-none" />
          
          <div className="space-y-4 text-left">
            <h3 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Target size={12} className="text-indigo-400" />
              Dores & Objetivos do Cliente
            </h3>
            
            <div className="max-h-[160px] overflow-y-auto custom-scrollbar-slate pr-1 space-y-3 pb-2 text-xs">
              {currentClient.communicationObjectives ? (
                currentClient.communicationObjectives.split('\n').filter(Boolean).map((obj, i) => (
                  <div key={i} className="flex gap-2.5">
                    <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-455" />
                    <p className="leading-normal text-zinc-200 text-[11px] font-medium">{obj}</p>
                  </div>
                ))
              ) : (
                <div className="text-zinc-500 py-4 text-center italic text-[11px]">
                  Nenhum objetivo cadastrado para esta conta. Clique em "Editar Perfil" acima para documentar as estratégias do cliente.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400 font-mono shrink-0">
            <span>byb.ag Planejamento</span>
            <span>Est. 2026</span>
          </div>
        </div>

        {/* 4. Escopos de entregas e tarefas (col-span-9) */}
        <div className="md:col-span-9 bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col justify-between shadow-xs hover:border-zinc-300 transition-all">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-100 flex-wrap gap-2 text-left">
            <h3 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Layers size={13} className="text-zinc-500" />
              Sectores e Entregas Ativas no Contrato
            </h3>
            <button 
              onClick={onConfigureScopeClick}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-all cursor-pointer select-none"
            >
              Configurar Matriz de Escopo →
            </button>
          </div>

          {(() => {
            const activeDepartments = departments.filter(dept => {
              const assignedTaskIds = currentClient.scope[dept.id] || [];
              return assignedTaskIds.length > 0;
            });

            if (activeDepartments.length === 0) {
              return (
                <div className="text-center py-8 bg-zinc-50 rounded-xl border border-dashed border-zinc-200 text-left">
                  <p className="text-xs text-zinc-500 font-semibold">Nenhuma área contratada/ativa no escopo recorrente desta empresa.</p>
                  <button 
                    onClick={onConfigureScopeClick}
                    className="text-[11px] font-extrabold text-indigo-650 hover:text-indigo-800 mt-2 transition-all cursor-pointer underline hover:scale-101"
                  >
                    Vincular escopo contratado agora
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
                    <div key={dept.id} className="bg-zinc-50/70 rounded-xl p-4 border border-zinc-100 flex flex-col justify-between min-h-[140px]">
                      <div>
                        <p className="text-xs font-bold text-zinc-800 mb-3 flex items-center gap-2">
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
                              <span className="text-[9px] font-extrabold text-emerald-600 uppercase bg-emerald-50 px-1 py-0.5 rounded shrink-0">
                                Escopo
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

        {/* 5. Repositórios e Planejamentos (col-span-3) */}
        <div className="md:col-span-3 flex flex-col justify-between gap-3">
          
          {currentClient.driveFolderLink ? (
            <a 
              href={currentClient.driveFolderLink} 
              target="_blank" 
              referrerPolicy="no-referrer"
              rel="noopener noreferrer"
              className="flex-1 bg-white border border-emerald-200 hover:border-emerald-300 rounded-2xl p-4 flex flex-col justify-center items-center gap-2 hover:bg-emerald-50/20 transition-all shadow-xs group cursor-pointer text-center"
            >
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-3xs">
                <GoogleDriveIcon active={true} />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-zinc-850">Pasta Google Drive</p>
                <p className="text-[9px] text-zinc-450 uppercase tracking-widest font-mono mt-0.5 flex items-center justify-center gap-1">Arquivos & Criativos <ExternalLink size={8} /></p>
              </div>
            </a>
          ) : (
            <div className="flex-1 bg-zinc-50/50 border border-dashed border-zinc-200 rounded-2xl p-4 flex flex-col justify-center items-center gap-1 text-center cursor-not-allowed text-zinc-400">
              <div className="w-8 h-8 bg-zinc-100 rounded-xl flex items-center justify-center opacity-60">
                <GoogleDriveIcon active={false} />
              </div>
              <p className="text-[11px] font-bold text-zinc-500">Sem Google Drive</p>
              <p className="text-[8px] uppercase tracking-wider font-mono">Nenhum repositório de arquivos</p>
            </div>
          )}

          {currentClient.annualPlanningLink ? (
            <a 
              href={currentClient.annualPlanningLink} 
              target="_blank" 
              referrerPolicy="no-referrer"
              rel="noopener noreferrer"
              className="flex-1 bg-white border border-amber-200 hover:border-amber-300 rounded-2xl p-4 flex flex-col justify-center items-center gap-2 hover:bg-amber-50/20 transition-all shadow-xs group cursor-pointer text-center"
            >
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-3xs">
                <GoogleSlidesIcon active={true} />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-zinc-850">Planejamento Estratégico</p>
                <p className="text-[9px] text-zinc-455 uppercase tracking-widest font-mono mt-0.5 flex items-center justify-center gap-1">Apresentação Geral <ExternalLink size={8} /></p>
              </div>
            </a>
          ) : (
            <div className="flex-1 bg-zinc-50/50 border border-dashed border-zinc-200 rounded-2xl p-4 flex flex-col justify-center items-center gap-1 text-center cursor-not-allowed text-zinc-400">
              <div className="w-8 h-8 bg-zinc-100 rounded-xl flex items-center justify-center opacity-60">
                <GoogleSlidesIcon active={false} />
              </div>
              <p className="text-[11px] font-bold text-zinc-500">Sem Planejamento</p>
              <p className="text-[8px] uppercase tracking-wider font-mono">Nenhum planejamento vinculado</p>
            </div>
          )}

          {currentClient.operandLink ? (
            <a 
              href={currentClient.operandLink} 
              target="_blank" 
              referrerPolicy="no-referrer"
              rel="noopener noreferrer"
              className="flex-1 bg-white border border-blue-200 hover:border-blue-300 rounded-2xl p-4 flex flex-col justify-center items-center gap-2 hover:bg-blue-50/20 transition-all shadow-xs group cursor-pointer text-center"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-3xs">
                <OperandIcon active={true} />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-zinc-850">Operand Operacional</p>
                <p className="text-[9px] text-zinc-455 uppercase tracking-widest font-mono mt-0.5 flex items-center justify-center gap-1">Pautas & Agenda <ExternalLink size={8} /></p>
              </div>
            </a>
          ) : (
            <div className="flex-1 bg-zinc-50/50 border border-dashed border-zinc-200 rounded-2xl p-4 flex flex-col justify-center items-center gap-1 text-center cursor-not-allowed text-zinc-400">
              <div className="w-8 h-8 bg-zinc-100 rounded-xl flex items-center justify-center opacity-60">
                <OperandIcon active={false} />
              </div>
              <p className="text-[11px] font-bold text-zinc-500">Sem Operand</p>
              <p className="text-[8px] uppercase tracking-wider font-mono">Nenhum cronograma operacional</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
