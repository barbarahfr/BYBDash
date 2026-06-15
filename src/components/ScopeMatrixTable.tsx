/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Client, Department, Task } from '../types';
import { 
  CheckSquare, 
  Square, 
  Search, 
  HelpCircle, 
  Layers, 
  Info, 
  Clock 
} from 'lucide-react';

interface ScopeMatrixTableProps {
  clients: Client[];
  departments: Department[];
  onToggleScope: (clientId: string, departmentId: string, taskId: string) => void;
  onBulkAssignDepartment: (clientId: string, departmentId: string, assignAll: boolean) => void;
}

export default function ScopeMatrixTable({ 
  clients, 
  departments, 
  onToggleScope,
  onBulkAssignDepartment
}: ScopeMatrixTableProps) {
  // Filtros
  const [clientSearch, setClientSearch] = useState('');
  const [activeTabSector, setActiveTabSector] = useState<string>('All'); // 'All' ou ID do departamento específico
  const [approachFilter, setApproachFilter] = useState<string>('All');
  const [rankingFilter, setRankingFilter] = useState<string>('All');
  
  // Detalhe da tarefa ao passar o mouse
  const [hoveredTask, setHoveredTask] = useState<Task | null>(null);

  // Lista de clientes filtrados
  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(clientSearch.toLowerCase());
      const matchApproach = approachFilter === 'All' || c.marketApproach === approachFilter;
      const matchRank = rankingFilter === 'All' || c.ranking === rankingFilter;
      return matchSearch && matchApproach && matchRank;
    });
  }, [clients, clientSearch, approachFilter, rankingFilter]);

  // Departamentos ativos para exibição
  const activeDepartments = useMemo(() => {
    if (activeTabSector === 'All') {
      return departments;
    }
    return departments.filter(d => d.id === activeTabSector);
  }, [departments, activeTabSector]);

  // Contagem de tarefas
  const totalTasks = useMemo(() => {
    return departments.reduce((acc, current) => acc + current.tasks.length, 0);
  }, [departments]);

  // Cores CSS
  const getDeptColorPalette = (color: string) => {
    switch (color) {
      case 'emerald': return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', check: 'text-emerald-600' };
      case 'purple': return { bg: 'bg-purple-50 text-purple-800 border-purple-200', check: 'text-purple-600' };
      case 'blue': return { bg: 'bg-blue-50 text-blue-800 border-blue-200', check: 'text-blue-600' };
      case 'amber': return { bg: 'bg-amber-50 text-amber-800 border-amber-200', check: 'text-amber-600' };
      case 'rose': return { bg: 'bg-rose-50 text-rose-800 border-rose-200', check: 'text-rose-600' };
      default: return { bg: 'bg-indigo-50 text-indigo-800 border-indigo-200', check: 'text-indigo-600' };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden flex flex-col">
      {/* Matriz de Escopo */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="text-left">
            <h3 className="font-display font-semibold text-base text-slate-800 flex items-center gap-2">
              <Layers size={18} className="text-indigo-600" />
              Metas de Entregas & Matriz de Escopo Ativo
            </h3>
            <p className="text-xs text-slate-500">
              Gerencie exatamente quais atividades pertencem ao contrato recorrente de cada empresa. Os checkboxes atualizam os acessos e dashboards na hora.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mr-1.5">Visualização:</span>
            <button
              onClick={() => setActiveTabSector('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                activeTabSector === 'All' 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-extrabold' 
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Todos os Setores ({departments.length})
            </button>
            {departments.map(dept => {
              return (
                <button
                  key={dept.id}
                  onClick={() => setActiveTabSector(dept.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    activeTabSector === dept.id 
                      ? `border-indigo-600 bg-indigo-50 text-indigo-750 font-extrabold` 
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {dept.name} ({dept.tasks.length})
                </button>
              );
            })}
          </div>
        </div>

        {/* Controles de Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-405">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Buscar clientes por nome..."
              value={clientSearch}
              onChange={e => setClientSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-800"
            />
          </div>

          <select
            value={rankingFilter}
            onChange={e => setRankingFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700"
          >
            <option value="All">Todas as Categorias (A, B, C, D)</option>
            <option value="A">Apenas Categoria A</option>
            <option value="B">Apenas Categoria B</option>
            <option value="C">Apenas Categoria C</option>
            <option value="D">Apenas Categoria D</option>
          </select>

          <select
            value={approachFilter}
            onChange={e => setApproachFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700"
          >
            <option value="All">Todas as abordagens corporativas (B2B/B2C)</option>
            <option value="B2B">Clientes B2B</option>
            <option value="B2C">Clientes B2C</option>
          </select>
        </div>
      </div>

      {/* Grid de Dados */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse select-none">
          <thead>
            {/* Cabeçalho dos Setores */}
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="py-2.5 px-3 min-w-[200px] border-r border-slate-100 align-middle text-slate-400 text-[10px] font-bold uppercase tracking-wider text-center bg-slate-50">
                Clientes Ordenados ({filteredClients.length})
              </th>
              {activeDepartments.map(dept => {
                const palette = getDeptColorPalette(dept.color);
                return (
                  <th 
                    key={dept.id} 
                    colSpan={dept.tasks.length} 
                    className={`py-2 px-3 border-r border-slate-200 font-sans text-[11px] font-bold tracking-tight text-center ${palette.bg}`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="truncate">{dept.name}</span>
                      <div className="flex shrink-0 gap-1 ml-1.5">
                        <button
                          onClick={() => {
                            if (window.confirm(`Vincular TODAS as tarefas de ${dept.name} para todos os clientes visíveis no momento?`)) {
                              filteredClients.forEach(c => onBulkAssignDepartment(c.id, dept.id, true));
                            }
                          }}
                          className="px-1.5 py-0.5 rounded text-[9px] bg-white border border-slate-200 hover:bg-slate-100 text-indigo-700 font-bold transition-all cursor-pointer"
                          title="Habilitar todas as tarefas em massa"
                        >
                          Tudo
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Remover TODAS as tarefas de ${dept.name} para todos os clientes visíveis no momento?`)) {
                              filteredClients.forEach(c => onBulkAssignDepartment(c.id, dept.id, false));
                            }
                          }}
                          className="px-1.5 py-0.5 rounded text-[9px] bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 transition-all cursor-pointer"
                          title="Limpar todas as tarefas do escopo"
                        >
                          Limpar
                        </button>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>

            {/* Cabeçalho das Tarefas */}
            <tr className="border-b border-slate-105 bg-slate-50 text-slate-500 font-sans text-[10px] font-bold uppercase tracking-wider">
              <th className="py-2 px-3 min-w-[200px] border-r border-slate-100 align-middle">
                Cliente / Foco de Negócio
              </th>

              {activeDepartments.map(dept => 
                dept.tasks.map(task => (
                  <th 
                    key={task.id} 
                    className="py-3 px-2 border-r border-slate-100 text-center font-medium min-w-[124px] max-w-[160px] cursor-help hover:bg-slate-100/70 transition-colors"
                    onMouseEnter={() => setHoveredTask(task)}
                    onMouseLeave={() => setHoveredTask(null)}
                  >
                    <div className="flex flex-col items-center justify-center gap-0.5 text-center">
                      <span className="break-words text-[10px] font-bold text-slate-700 leading-tight text-center hyphens-auto">
                        {task.name}
                      </span>
                      <span className="text-[8px] font-sans font-normal text-slate-400 inline-flex items-center gap-0.5 mt-0.5 leading-none">
                        Info <HelpCircle size={9} />
                      </span>
                    </div>
                  </th>
                ))
              )}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-100 text-xs text-left">
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={totalTasks + 1} className="py-12 text-center text-slate-400">
                  <div className="max-w-md mx-auto space-y-2">
                    <p className="font-semibold text-slate-650">Nenhum cliente atende aos filtros definidos.</p>
                    <p className="text-xs">Ajuste os seletores ou remova o texto de busca para voltar a gerenciar os escopos.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => {
                return (
                  <tr key={client.id} className="hover:bg-slate-50/60 transition-all border-b border-slate-100">
                    <td className="py-3 px-3 bg-white/50 border-r border-slate-100 font-semibold text-slate-800">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="truncate">
                          <div className="font-bold text-slate-800 leading-tight">{client.name}</div>
                          <div className="text-[10px] text-slate-430 flex items-center gap-1.5 mt-0.5 font-medium">
                            <span className="font-bold uppercase bg-slate-100 text-slate-600 px-1 rounded-sm">{client.ranking}</span>
                            <span className="truncate max-w-[120px] font-mono text-slate-400">{client.segment || 'Sem segmento'}</span>
                          </div>
                        </div>
                        <div className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded shrink-0">
                          {Object.values(client.scope).reduce<number>((acc, current) => acc + ((current as string[])?.length || 0), 0)} ativas
                        </div>
                      </div>
                    </td>

                    {/* Checkboxes de ativação */}
                    {activeDepartments.map(dept => {
                      const palette = getDeptColorPalette(dept.color);
                      const activeTaskIds = client.scope[dept.id] || [];

                      return dept.tasks.map(task => {
                        const isChecked = activeTaskIds.includes(task.id);

                        return (
                          <td 
                            key={task.id} 
                            onClick={() => onToggleScope(client.id, dept.id, task.id)}
                            className={`p-2.5 text-center border-r border-slate-100 align-middle transition-colors cursor-pointer select-none ${
                              isChecked ? 'bg-indigo-50/15' : 'hover:bg-slate-100/50'
                            }`}
                          >
                            <div className="flex items-center justify-center">
                              {isChecked ? (
                                <span className={`transition-all transform scale-110 ${palette.check}`} title="Escopo Ativo">
                                  <CheckSquare size={17} className="fill-current bg-white" />
                                </span>
                              ) : (
                                <span className="text-slate-300 hover:text-slate-400 transition-all" title="Adicionar ao Escopo">
                                  <Square size={17} />
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      });
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Rodapé e Tooltip informativo */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/80 text-xs text-slate-600 flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
        {hoveredTask ? (
          <div className="flex items-start gap-2 max-w-2xl text-left bg-indigo-50/60 border border-indigo-110 rounded-lg p-2 md:py-1.5 animate-pulse">
            <Info size={14} className="text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">Objetivo de Sucesso de ({hoveredTask.name}): </span>
              <span className="text-[11px] text-slate-600 font-semibold">{hoveredTask.description}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Clock size={13} />
            <span>Passe o ponteiro do mouse por cima do título de qualquer coluna de entregáveis para visualizar seu escopo de sucesso.</span>
          </div>
        )}
        <div className="text-[10px] font-semibold text-slate-400">
          *Todas as alterações de checklist atualizam e salvam no Firebase instantaneamente
        </div>
      </div>
    </div>
  );
}
