/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Client, Department } from '../types';
import { 
  Users, 
  Award, 
  FolderGit, 
  Activity, 
  ExternalLink,
  Smile
} from 'lucide-react';

interface DashboardStatsProps {
  clients: Client[];
  departments: Department[];
  onSelectClient: (client: Client) => void;
}

export default function DashboardStats({ clients, departments, onSelectClient }: DashboardStatsProps) {
  // Calcular métricas
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'Active').length;
  const onboardingClients = clients.filter(c => c.status === 'Onboarding').length;
  const pausedOrInactive = clients.filter(c => c.status === 'Paused' || c.status === 'Inactive').length;

  // Tarefas ativas
  let totalScopedTasks = 0;
  const departmentCounts: { [key: string]: number } = {};
  
  departments.forEach(dept => {
    departmentCounts[dept.id] = 0;
  });

  clients.forEach(client => {
    Object.entries(client.scope).forEach(([deptId, taskIds]) => {
      if (Array.isArray(taskIds)) {
        totalScopedTasks += taskIds.length;
        if (deptId in departmentCounts) {
          departmentCounts[deptId] += taskIds.length;
        } else {
          departmentCounts[deptId] = (departmentCounts[deptId] || 0) + taskIds.length;
        }
      }
    });
  });

  // Quantidade de clientes por Categoria
  const rankingCounts = {
    A: clients.filter(c => c.ranking === 'A').length,
    B: clients.filter(c => c.ranking === 'B').length,
    C: clients.filter(c => c.ranking === 'C').length,
    D: clients.filter(c => c.ranking === 'D').length,
  };

  // Métricas de Satisfação
  const clientRatings = clients.map(c => c.satisfactionRating || 5);
  const totalRated = clientRatings.length;
  const totalSum = clientRatings.reduce((sum, r) => sum + r, 0);
  const avgSatisfaction = totalRated > 0 ? (totalSum / totalRated).toFixed(1) : '0.0';

  const satisfactionCounts = {
    5: clientRatings.filter(r => r === 5).length,
    4: clientRatings.filter(r => r === 4).length,
    3: clientRatings.filter(r => r === 3).length,
    2: clientRatings.filter(r => r === 2).length,
    1: clientRatings.filter(r => r === 1).length,
  };

  const ratingSlices = [
    { level: 5, label: 'Excelente (5)', count: satisfactionCounts[5], fill: '#4f46e5', colorBg: 'bg-indigo-600' },
    { level: 4, label: 'Bom (4)', count: satisfactionCounts[4], fill: '#10b981', colorBg: 'bg-emerald-500' },
    { level: 3, label: 'Regular (3)', count: satisfactionCounts[3], fill: '#fbbf24', colorBg: 'bg-amber-400' },
    { level: 2, label: 'Ruim (2)', count: satisfactionCounts[2], fill: '#f97316', colorBg: 'bg-orange-500' },
    { level: 1, label: 'Muito Ruim (1)', count: satisfactionCounts[1], fill: '#ef4444', colorBg: 'bg-red-500' },
  ].filter(s => s.count > 0);

  const radius = 35;
  const centerX = 50;
  const centerY = 50;

  let accumulatedPercent = 0;

  const pieSlices = ratingSlices.map((slice) => {
    const percent = slice.count / totalRated;
    const startPercent = accumulatedPercent;
    const endPercent = accumulatedPercent + percent;
    accumulatedPercent = endPercent;

    const startAngle = startPercent * 2 * Math.PI - Math.PI / 2;
    const endAngle = endPercent * 2 * Math.PI - Math.PI / 2;

    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArcFlag = percent > 0.5 ? 1 : 0;

    const pathData = `
      M ${centerX} ${centerY}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `.trim();

    return {
      ...slice,
      pathData,
      percent,
    };
  });

  const resourceClients = clients.filter(c => c.driveFolderLink || c.annualPlanningLink).slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      {/* Seção de Cards KPI */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-5">
           {/* Card: Clientes Cadastrados */}
        <div id="stat-card-clients" className="h-full bg-white rounded-xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between hover:border-indigo-100 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-400">Clientes Cadastrados</span>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Users size={18} />
            </div>
          </div>
          <div>
            <div className="font-display text-3.5xl font-bold text-slate-800 tracking-tight leading-none mb-3">
              {totalClients}
            </div>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                <Activity size={10} /> {activeClients} Ativos
              </span>
              <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-semibold">
                {onboardingClients} Onboarding
              </span>
              {pausedOrInactive > 0 && (
                <span className="text-slate-505 bg-slate-50 px-1.5 py-0.5 rounded font-semibold">
                  {pausedOrInactive} Outros
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card: Gráfico de Satisfação */}
        <div id="stat-card-satisfaction" className="h-full bg-white rounded-xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between hover:border-indigo-50 transition-all">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <span className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-400">Satisfação dos Clientes</span>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Smile size={18} />
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            {/* Lado Esquerdo: SVG Donut Chart */}
            <div className="w-20 h-20 shrink-0 relative flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 text-center">
                {totalRated === 0 ? (
                  <circle cx="50" cy="50" r={radius} fill="#e2e8f0" />
                ) : ratingSlices.length === 1 ? (
                  <circle cx="50" cy="50" r={radius} fill={ratingSlices[0].fill} />
                ) : (
                  pieSlices.map((slice, idx) => (
                    <path 
                      key={idx} 
                      d={slice.pathData} 
                      fill={slice.fill} 
                      className="transition-all hover:opacity-90"
                    />
                  ))
                )}
                <circle cx="50" cy="50" r={23} fill="#ffffff" />
              </svg>
              <div className="absolute inset-x-0 flex flex-col items-center justify-center">
                <span className="font-display font-extrabold text-base text-slate-800 leading-none">
                  {avgSatisfaction}
                </span>
                <span className="text-[6.5px] font-bold text-slate-405 tracking-wider uppercase mt-0.5 text-center">
                  Média
                </span>
              </div>
            </div>

            {/* Lado Direito: Legenda */}
            <div className="flex-1 min-w-0 flex flex-col gap-0.5 justify-center">
              {[
                { level: 5, label: 'Excelente', colorBg: 'bg-indigo-650' },
                { level: 4, label: 'Bom', colorBg: 'bg-emerald-500' },
                { level: 3, label: 'Regular', colorBg: 'bg-amber-400' },
                { level: 2, label: 'Ruim', colorBg: 'bg-orange-500' },
                { level: 1, label: 'Critico', colorBg: 'bg-red-500' },
              ].map(item => {
                const count = satisfactionCounts[item.level as 5 | 4 | 3 | 2 | 1] || 0;
                const percent = totalRated > 0 ? Math.round((count / totalRated) * 100) : 0;
                const isActive = count > 0;

                return (
                  <div 
                    key={item.level} 
                    className={`flex items-center justify-between text-[10px] font-semibold tracking-tight transition-all ${
                      isActive ? 'text-slate-700' : 'text-slate-300 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${item.colorBg}`} />
                      <span>{item.label}</span>
                    </div>
                    <span className="font-mono font-bold shrink-0 ml-1">
                      {count} ({percent}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card: Categorias / Rankings */}
        <div id="stat-card-rankings" className="h-full bg-white rounded-xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between hover:border-amber-100 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-405">Carteira de Clientes (Tier)</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Award size={18} />
            </div>
          </div>
          <div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {(['A', 'B', 'C', 'D'] as const).map(rank => (
                <div key={rank} className="bg-slate-50/70 p-1.5 rounded-lg border border-slate-100/50">
                  <div className={`font-semibold text-sm ${
                    rank === 'A' ? 'text-rose-600' :
                    rank === 'B' ? 'text-amber-600' :
                    rank === 'C' ? 'text-blue-600' : 'text-slate-500'
                  }`}>{rank}</div>
                  <div className="text-xs font-bold text-slate-700">{rankingCounts[rank]}</div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center">A classificação A representa as contas de maior faturamento ou foco</p>
          </div>
        </div>
      </div>

      {/* Acesso Rápido a links externos */}
      <div id="quick-links-panel" className="bg-slate-900 text-slate-200 rounded-xl p-5 shadow-xs border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center gap-1.5 mb-3 border-b border-slate-800 pb-2">
          <FolderGit size={16} className="text-indigo-400" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Arquivos e Links</h4>
        </div>
        
        {resourceClients.length === 0 ? (
          <p className="text-xs text-slate-500 py-3 text-center font-medium">Nenhum link estratégico cadastrado ainda.</p>
        ) : (
          <div className="space-y-2 max-h-[110px] overflow-y-auto custom-scrollbar-slate pr-1">
            {resourceClients.map(client => (
              <div key={client.id} className="flex items-center justify-between text-xs group text-slate-300 hover:text-white transition-colors">
                <button 
                  onClick={() => onSelectClient(client)}
                  className="font-semibold text-left truncate max-w-[120px] hover:underline cursor-pointer"
                  title="Ver detalhes de metas desse cliente"
                >
                  {client.name}
                </button>
                <div className="flex items-center gap-2 shrink-0">
                  {client.driveFolderLink && (
                    <a 
                      href={client.driveFolderLink} 
                      target="_blank" 
                      referrerPolicy="no-referrer"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-slate-800 text-indigo-300 hover:text-indigo-200 rounded transition-colors cursor-pointer"
                      title="Abrir pasta do Google Drive"
                    >
                      <ExternalLink size={11} />
                    </a>
                  )}
                  {client.annualPlanningLink && (
                    <a 
                      href={client.annualPlanningLink} 
                      target="_blank" 
                      referrerPolicy="no-referrer"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-slate-800 text-amber-300 hover:text-amber-200 rounded transition-colors cursor-pointer"
                      title="Abrir planilha de Planejamento Estratégico"
                    >
                      <span className="text-[9px] font-extrabold tracking-tighter uppercase mr-0.5 text-amber-400 font-mono">Plan</span>
                      <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-[10px] text-slate-500 pt-1.5 border-t border-slate-800 text-right shrink-0">
          *Abra em nova aba se houver bloqueios
        </div>
      </div>
    </div>
  );
}
