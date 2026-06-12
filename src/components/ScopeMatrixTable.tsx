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
  Sparkles, 
  Layers, 
  Info, 
  Eye, 
  EyeOff, 
  Filter, 
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
  // Filters
  const [clientSearch, setClientSearch] = useState('');
  const [activeTabSector, setActiveTabSector] = useState<string>('All'); // 'All' or specific departmentId
  const [approachFilter, setApproachFilter] = useState<string>('All');
  const [rankingFilter, setRankingFilter] = useState<string>('All');
  
  // Hovered task detail tooltip
  const [hoveredTask, setHoveredTask] = useState<Task | null>(null);

  // Clients filtered list
  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(clientSearch.toLowerCase());
      const matchApproach = approachFilter === 'All' || c.marketApproach === approachFilter;
      const matchRank = rankingFilter === 'All' || c.ranking === rankingFilter;
      return matchSearch && matchApproach && matchRank;
    });
  }, [clients, clientSearch, approachFilter, rankingFilter]);

  // Active departments to display
  const activeDepartments = useMemo(() => {
    if (activeTabSector === 'All') {
      return departments;
    }
    return departments.filter(d => d.id === activeTabSector);
  }, [departments, activeTabSector]);

  // Quick stat count
  const totalTasks = useMemo(() => {
    return departments.reduce((acc, current) => acc + current.tasks.length, 0);
  }, [departments]);

  // Color mappings
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
      {/* Header and Matrix Settings */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-semibold text-base text-slate-800 flex items-center gap-2">
              <Layers size={18} className="text-indigo-600" />
              Service Deliverables & Scope Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Customize exactly which task is assigned to each client for every sector. Check boxes to edit active scope.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick sector toggles */}
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mr-1.5">Sector view:</span>
            <button
              onClick={() => setActiveTabSector('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                activeTabSector === 'All' 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              All Sectors ({departments.length})
            </button>
            {departments.map(dept => {
              const colors = getDeptColorPalette(dept.color);
              return (
                <button
                  key={dept.id}
                  onClick={() => setActiveTabSector(dept.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    activeTabSector === dept.id 
                      ? `border-indigo-600 bg-indigo-50 text-indigo-700` 
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {dept.name} ({dept.tasks.length})
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Search clients by name..."
              value={clientSearch}
              onChange={e => setClientSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            />
          </div>

          {/* Ranking select */}
          <select
            value={rankingFilter}
            onChange={e => setRankingFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
          >
            <option value="All">All Tiers (Ranking A, B, C, D)</option>
            <option value="A">Tier A only</option>
            <option value="B">Tier B only</option>
            <option value="C">Tier C only</option>
            <option value="D">Tier D only</option>
          </select>

          {/* Market Approach */}
          <select
            value={approachFilter}
            onChange={e => setApproachFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
          >
            <option value="All">All market approaches (B2B/B2C)</option>
            <option value="B2B">B2B clients</option>
            <option value="B2C">B2C clients</option>
          </select>
        </div>
      </div>

      {/* Grid Layout Container */}
      <div className="overflow-x-auto w-full">
        {/* Table representation */}
        <table className="w-full text-left border-collapse select-none">
          <thead>
            {/* Primary Sector Headers Row */}
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="py-2.5 px-3 min-w-[200px] border-r border-slate-100 align-middle text-slate-400 text-[10px] font-bold uppercase tracking-wider text-center bg-slate-50">
                Registered Clients ({filteredClients.length})
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
                      <div className="flex shrink-0 gap-1.5 ml-1.5">
                        <button
                          onClick={() => {
                            if (window.confirm(`Assign ALL tasks under ${dept.name} to all currently visible clients?`)) {
                              filteredClients.forEach(c => onBulkAssignDepartment(c.id, dept.id, true));
                            }
                          }}
                          className="px-1.5 py-0.5 rounded text-[9px] bg-white border border-slate-200 hover:bg-slate-50 transition-colors uppercase cursor-pointer"
                          title="Assign all tasks in this department bulk"
                        >
                          All
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Eraser ALL task assignments under ${dept.name} for all currently visible clients?`)) {
                              filteredClients.forEach(c => onBulkAssignDepartment(c.id, dept.id, false));
                            }
                          }}
                          className="px-1.5 py-0.5 rounded text-[9px] bg-white border border-slate-200 hover:bg-slate-50 transition-colors uppercase cursor-pointer"
                          title="Erase all tasks in this department bulk"
                        >
                          None
                        </button>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>

            {/* Individual Task Headers Row */}
            <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-sans text-[10px] font-bold uppercase tracking-wider">
              {/* Client Identifier Header */}
              <th className="py-2 px-3 min-w-[200px] border-r border-slate-100 align-middle">
                Client Name & Objective View
              </th>

              {/* Dynamic Task Headers */}
              {activeDepartments.map(dept => 
                dept.tasks.map(task => (
                  <th 
                    key={task.id} 
                    className="py-3 px-2 border-r border-slate-100 text-center font-medium min-w-[124px] max-w-[160px] cursor-help hover:bg-slate-100/70 transition-colors"
                    onMouseEnter={() => setHoveredTask(task)}
                    onMouseLeave={() => setHoveredTask(null)}
                  >
                    <div className="flex flex-col items-center justify-center gap-0.5 text-center">
                      <span className="break-words text-[10px] font-semibold text-slate-700 leading-tight text-center hyphens-auto">
                        {task.name}
                      </span>
                      <span className="text-[8px] font-sans font-normal text-slate-400 inline-flex items-center gap-0.5 mt-0.5 leading-none">
                        Hover for info <HelpCircle size={9} />
                      </span>
                    </div>
                  </th>
                ))
              )}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={totalTasks + 1} className="py-12 text-center text-slate-400">
                  <div className="max-w-md mx-auto space-y-2">
                    <p className="font-semibold text-slate-600">No client scope data matches the active key queries.</p>
                    <p className="text-xs">Adjust the filters above or clear search text to customize scope checkboxes.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredClients.map((client, cIndex) => {
                const rankColor = 
                  client.ranking === 'A' ? 'text-rose-600' :
                  client.ranking === 'B' ? 'text-amber-500' :
                  client.ranking === 'C' ? 'text-blue-500' : 'text-slate-400';

                return (
                  <tr key={client.id} className="hover:bg-slate-50/60 transition-all border-b border-slate-100">
                    {/* Client cell with static left lock */}
                    <td className="py-3 px-3 bg-white/50 border-r border-slate-100 font-medium text-slate-800">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="truncate">
                          <div className="font-bold text-slate-800">{client.name}</div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium">
                            <span className="font-extrabold uppercase shrink-0">Rank {client.ranking}</span>
                            <span className="truncate max-w-[120px]">{client.segment}</span>
                          </div>
                        </div>
                        {/* Summary of assigned tasks of this client in this matrix */}
                        <div className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded shrink-0">
                          {Object.values(client.scope).reduce<number>((acc, current) => acc + ((current as string[])?.length || 0), 0)} tasks
                        </div>
                      </div>
                    </td>

                    {/* Checkboxes cells */}
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
                                <span className={`transition-all transform scale-110 ${palette.check}`} title="Assigned / Active Scope">
                                  <CheckSquare size={17} className="fill-current bg-white" />
                                </span>
                              ) : (
                                <span className="text-slate-300 hover:text-slate-400 transition-all" title="Click to Assign to Scope">
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

      {/* Floating Info Tooltip Helper */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/80 text-xs text-slate-600 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {hoveredTask ? (
          <div className="flex items-start gap-2 max-w-2xl text-left bg-indigo-50/60 border border-indigo-100 rounded-lg p-2 md:py-1.5 animate-pulse">
            <Info size={14} className="text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">{hoveredTask.name} Target Objective: </span>
              <span className="text-[11px] text-slate-600 font-medium">{hoveredTask.description}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Clock size={13} />
            <span>Hover on any top task column header to immediately inspect its core operational guideline.</span>
          </div>
        )}
        <div className="text-[10px] font-semibold text-slate-400">
          *All checkbox updates instantly auto-save on change
        </div>
      </div>
    </div>
  );
}
