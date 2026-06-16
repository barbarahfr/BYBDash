/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Client, RankingType, ClientStatusType, MarketApproachType, CustomColumn } from '../types';
import { 
  Search, 
  Edit, 
  Trash2, 
  ArrowUpDown, 
  ExternalLink, 
  Plus,
  Compass,
  FileCheck2,
  Columns,
  X
} from 'lucide-react';

const GoogleDriveIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 512 512" className="w-3.5 h-3.5 shrink-0" fill="none">
    <path d="M339 345l87-150-136-235H123L36 110l136 235z" fill={active ? "#FFC107" : "#cbd5e1"}/>
    <path d="M172 345L85 495h271l87-150H172z" fill={active ? "#2196F3" : "#94a3b8"}/>
    <path d="M36 110l136 235 86-150L122 45 36 110z" fill={active ? "#4CAF50" : "#64748b"}/>
  </svg>
);

const GoogleSlidesIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="2" fill={active ? "#FFC107" : "#94a3b8"} />
    <path d="M6 7h12v7H6V7z" fill="#FFF" />
    <line x1="8" y1="17" x2="16" y2="17" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12" y1="14" x2="12" y2="17" stroke="#FFF" strokeWidth="1.5" />
    <circle cx="12" cy="10" r="1.5" fill={active ? "#FFC107" : "#94a3b8"} />
  </svg>
);

const OperandIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" strokeWidth="3.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="8" stroke={active ? "#00A3FF" : "#94a3b8"} strokeWidth="3" className="opacity-80" />
    <path d="M12 4 A 8 8 0 0 1 20 12" stroke={active ? "#0057FF" : "#64748b"} strokeWidth="3" />
  </svg>
);

interface ClientDirectoryTableProps {
  clients: Client[];
  onEditClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
  onAddClientClick: () => void;
  customColumns: CustomColumn[];
  onAddCustomColumn: (newCol: Omit<CustomColumn, 'id'>) => void;
  onEditCustomColumn: (updatedCol: CustomColumn) => void;
  onDeleteCustomColumn: (colId: string) => void;
  onViewCollaboratorByName?: (name: string) => void;
}

export default function ClientDirectoryTable({ 
  clients, 
  onEditClient, 
  onDeleteClient,
  onAddClientClick,
  customColumns = [],
  onAddCustomColumn,
  onEditCustomColumn,
  onDeleteCustomColumn,
  onViewCollaboratorByName
}: ClientDirectoryTableProps) {
  // Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [rankingFilter, setRankingFilter] = useState<string>('All');
  const [approachFilter, setApproachFilter] = useState<string>('All');
  const [segmentSearch, setSegmentSearch] = useState('');

  // Sorting States
  const [sortField, setSortField] = useState<keyof Client | 'responsibles.serviceLiaison'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Expanded client rows to see deep objectives or notes
  const [expandedClientId, setExpandedClientId] = useState<string | null>(null);

  // Custom Column builder states
  const [showColManager, setShowColManager] = useState(false);
  const [editingColumn, setEditingColumn] = useState<CustomColumn | null>(null);
  const [colName, setColName] = useState('');
  const [colType, setColType] = useState<'text' | 'link' | 'dropdown' | 'multiselect'>('text');
  const [colOptions, setColOptions] = useState('');

  const handleSaveColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colName.trim()) return;

    const parsedOptions = colOptions
      .split(',')
      .map(o => o.trim())
      .filter(o => o.length > 0);

    if (editingColumn) {
      onEditCustomColumn({
        id: editingColumn.id,
        name: colName.trim(),
        type: colType,
        options: parsedOptions.length > 0 ? parsedOptions : undefined,
      });
      setEditingColumn(null);
    } else {
      onAddCustomColumn({
        name: colName.trim(),
        type: colType,
        options: parsedOptions.length > 0 ? parsedOptions : undefined,
      });
    }

    // Reset inputs
    setColName('');
    setColType('text');
    setColOptions('');
  };

  const handleStartEditColumn = (col: CustomColumn) => {
    setEditingColumn(col);
    setColName(col.name);
    setColType(col.type);
    setColOptions(col.options ? col.options.join(', ') : '');
  };

  const handleCancelEditColumn = () => {
    setEditingColumn(null);
    setColName('');
    setColType('text');
    setColOptions('');
  };

  // Collect all unique segments for helper filtering
  const segmentsList = useMemo(() => {
    const list = new Set<string>();
    clients.forEach(c => {
      if (c.segment) list.add(c.segment.trim());
    });
    return Array.from(list);
  }, [clients]);

  // Handle Sort Toggle
  const handleSort = (field: keyof Client | 'responsibles.serviceLiaison') => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter & Sort clients list
  const processedClients = useMemo(() => {
    let result = [...clients];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.contactEmail.toLowerCase().includes(q) ||
        (c.responsibles?.serviceLiaison || '').toLowerCase().includes(q) ||
        (c.responsibles?.writer || '').toLowerCase().includes(q) ||
        (c.responsibles?.designer || '').toLowerCase().includes(q) ||
        (c.responsibles?.paidTrafficHandler || '').toLowerCase().includes(q) ||
        (c.responsibles?.socialMedia || '').toLowerCase().includes(q)
      );
    }

    // Status Filter
    if (statusFilter !== 'All') {
      result = result.filter(c => c.status === statusFilter);
    }

    // Ranking Filter
    if (rankingFilter !== 'All') {
      result = result.filter(c => c.ranking === rankingFilter);
    }

    // Approach Filter
    if (approachFilter !== 'All') {
      result = result.filter(c => c.marketApproach === approachFilter);
    }

    // Segment Filter
    if (segmentSearch.trim()) {
      const segQ = segmentSearch.toLowerCase();
      result = result.filter(c => c.segment && c.segment.toLowerCase().includes(segQ));
    }

    // Sorting
    result.sort((a, b) => {
      let valA: any;
      let valB: any;

      if (sortField === 'responsibles.serviceLiaison') {
        valA = (a.responsibles.serviceLiaison || '').toLowerCase();
        valB = (b.responsibles.serviceLiaison || '').toLowerCase();
      } else {
        valA = a[sortField];
        valB = b[sortField];
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [clients, search, statusFilter, rankingFilter, approachFilter, segmentSearch, sortField, sortDirection]);

  // Reset Filters
  const clearFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setRankingFilter('All');
    setApproachFilter('All');
    setSegmentSearch('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden flex flex-col">
      {/* Table Action Controls */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={15} />
            </span>
            <input
              type="text"
              placeholder="Buscar por clientes, e-mails ou responsáveis..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            />
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={clearFilters}
              disabled={search === '' && statusFilter === 'All' && rankingFilter === 'All' && approachFilter === 'All' && segmentSearch === ''}
              className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-indigo-600 disabled:opacity-40 disabled:text-slate-400 hover:bg-slate-100/50 rounded-lg transition-all cursor-pointer"
            >
              Limpar Filtros
            </button>

            <button
              onClick={() => setShowColManager(!showColManager)}
              className={`p-2 rounded-lg flex items-center justify-center cursor-pointer transition-all border ${
                showColManager
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
              title={`Gerenciar Colunas (${customColumns.length})`}
            >
              <Columns size={14} />
            </button>

            <button
              onClick={onAddClientClick}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
            >
              <Plus size={14} />
              Cadastrar Novo Cliente
            </button>
          </div>
        </div>

        {/* Dynamic Column Builder Panel */}
        {showColManager && (
          <div id="col-manager-panel" className="p-4 bg-white border border-indigo-100 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Columns size={15} className="text-indigo-600" />
                <h4 className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
                  Gerenciar Colunas do Diretório
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowColManager(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-1 rounded-sm transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form to Add / Edit */}
              <form onSubmit={handleSaveColumn} className="lg:col-span-1 bg-slate-50/50 p-3.5 rounded-lg border border-slate-100 space-y-3">
                <h5 className="font-bold text-[10px] uppercase text-indigo-700 tracking-wider">
                  {editingColumn ? 'Editar Coluna Ativa' : 'Criar Nova Coluna'}
                </h5>
                
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Nome da Coluna</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Telefone, Instagram, Cargo..."
                    value={colName}
                    onChange={e => setColName(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Tipo de Campo</label>
                  <select
                    value={colType}
                    onChange={e => setColType(e.target.value as any)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-hidden text-slate-700"
                  >
                    <option value="text">Texto Simples</option>
                    <option value="link">Link Clicável</option>
                    <option value="dropdown">Seleção Dropdown</option>
                    <option value="multiselect">Múltipla Escolha</option>
                  </select>
                </div>

                {(colType === 'dropdown' || colType === 'multiselect') && (
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Opções (Separadas por vírgula)</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Premium, Standard, Trial"
                      value={colOptions}
                      onChange={e => setColOptions(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
                    />
                    <span className="text-[9px] text-slate-400">Escreva as opções aceitas neste campo, separando-as por vírgula.</span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 px-3 py-1.5 text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer text-center animate-pulse"
                  >
                    {editingColumn ? 'Salvar Alterações' : 'Adicionar Coluna'}
                  </button>
                  {editingColumn && (
                    <button
                      type="button"
                      onClick={handleCancelEditColumn}
                      className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>

              {/* Columns list */}
              <div className="lg:col-span-2 space-y-2">
                <h5 className="font-bold text-[10px] uppercase text-slate-500 tracking-wider">
                  Colunas Ativas ({customColumns.length})
                </h5>
                
                {customColumns.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs italic bg-slate-50/50 rounded-lg border border-dashed border-slate-200 flex flex-col justify-center items-center gap-2">
                    <span>Nenhuma coluna cadastrada até o momento.</span>
                    <span className="text-[10px] text-slate-400 font-normal">Use o painel ao lado para criar novas colunas. Elas aparecerão na tabela e no formulário automaticamente!</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
                    {customColumns.map(col => (
                      <div key={col.id} className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-lg group transition-all">
                        <div className="space-y-0.5 min-w-0">
                          <div className="text-[11px] font-bold text-slate-800 truncate" title={col.name}>
                            {col.name}
                          </div>
                          <div className="text-[9px] font-medium text-slate-400 flex items-center gap-1.5 flex-wrap">
                            <span className="px-1 py-0.2 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 text-[8px] tracking-wider font-extrabold font-mono uppercase">
                              {col.type === 'multiselect' ? 'Multi' : col.type}
                            </span>
                            {col.options && (
                              <span className="truncate max-w-[120px]" title={col.options.join(', ')}>
                                ({col.options.length} opções)
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleStartEditColumn(col)}
                            className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-100 transition-colors cursor-pointer"
                            title="Editar Definição"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Você tem certeza que deseja excluir a coluna "${col.name}"? Isso também apagará o conteúdo preenchido desta coluna em todos os clientes.`)) {
                                onDeleteCustomColumn(col.id);
                                if (editingColumn?.id === col.id) {
                                  handleCancelEditColumn();
                                }
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-white border border-transparent hover:border-slate-100 transition-colors cursor-pointer"
                            title="Excluir Coluna"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Detailed Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Status Filter */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white focus:ring-1 focus:ring-indigo-500 text-slate-705 font-medium"
            >
              <option value="All">Todos os status</option>
              <option value="Active">Ativos</option>
              <option value="Onboarding">Integração (Onboarding)</option>
              <option value="Paused">Pausados</option>
              <option value="Inactive">Inativos</option>
            </select>
          </div>

          {/* Ranking Filter */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Categoria / Classificação</label>
            <select
              value={rankingFilter}
              onChange={e => setRankingFilter(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white focus:ring-1 focus:ring-indigo-500 text-slate-705 font-medium"
            >
              <option value="All">Todas as Categorias (A-D)</option>
              <option value="A">Categoria A (Alta Prioridade)</option>
              <option value="B">Categoria B</option>
              <option value="C">Categoria C</option>
              <option value="D">Categoria D (Baixa Prioridade)</option>
            </select>
          </div>

          {/* Market Approach */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Abordagem de Mercado</label>
            <select
              value={approachFilter}
              onChange={e => setApproachFilter(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white focus:ring-1 focus:ring-indigo-500 text-slate-705 font-medium"
            >
              <option value="All">Todas as abordagens</option>
              <option value="B2B">Essencial B2B</option>
              <option value="B2C">Varejo B2C</option>
            </select>
          </div>

          {/* Segment Filter */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nicho / Segmento</label>
            <input
              type="text"
              placeholder="ex: Cosméticos, Vestuário"
              value={segmentSearch}
              onChange={e => setSegmentSearch(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white focus:ring-1 focus:ring-indigo-500 text-slate-705 font-medium"
              list="segments-datalist"
            />
            <datalist id="segments-datalist">
              {segmentsList.map(seg => <option key={seg} value={seg} />)}
            </datalist>
          </div>
        </div>
      </div>

      {/* Spreadsheet Table Viewport */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-sans text-[10px] font-bold uppercase tracking-wider select-none">
              <th className="py-3 px-4 w-12 text-center">Nº</th>
              <th className="py-3 px-4 min-w-[180px] cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1.5">
                  Cliente & Categoria
                  <ArrowUpDown size={11} className="text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 min-w-[100px] cursor-pointer hover:bg-slate-100 transition-colors text-center" onClick={() => handleSort('status')}>
                <div className="flex items-center justify-center gap-1.5">
                  Status
                  <ArrowUpDown size={11} className="text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 min-w-[110px] text-center">
                <div className="flex items-center justify-center gap-1.5">
                  Satisfação
                </div>
              </th>
              <th className="py-3 px-3 min-w-[124px] cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('responsibles.serviceLiaison')}>
                <div className="flex items-center gap-1.5">
                  Atendimento (Liaison)
                  <ArrowUpDown size={11} className="text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 min-w-[200px]">Equipe Criativa & Tráfego Staff</th>
              <th className="py-3 px-3 min-w-[140px]" onClick={() => handleSort('segment')}>
                <div className="flex items-center gap-1.5">
                  Abordagem & Segmento
                  <ArrowUpDown size={11} className="text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 min-w-[150px]">Links & Objetivos</th>
              {customColumns.map(col => (
                <th key={col.id} className="py-3 px-3 min-w-[140px] text-left select-none text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {col.name}
                </th>
              ))}
              <th className="py-3 px-3 min-w-[90px] text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {processedClients.length === 0 ? (
              <tr>
                <td colSpan={9 + customColumns.length} className="text-center py-10 text-slate-400">
                  <div className="space-y-2">
                    <p className="font-semibold text-slate-600">Nenhum cliente atende aos filtros selecionados.</p>
                    <p className="text-xs">Tente ajustar o termo de pesquisa, limpar filtros ou cadastrar um novo cliente no diretório.</p>
                    <button 
                      onClick={clearFilters}
                      className="px-3 py-1.5 mt-2 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg cursor-pointer animate-pulse"
                    >
                      Limpar Filtros Ativos
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              processedClients.map((client, index) => {
                const isExpanded = expandedClientId === client.id;
                
                const rankColor = 
                  client.ranking === 'A' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  client.ranking === 'B' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  client.ranking === 'C' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  'bg-slate-100 text-slate-600 border-slate-300';

                const statusColor = 
                  client.status === 'Active' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                  client.status === 'Onboarding' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                  client.status === 'Paused' ? 'text-orange-700 bg-orange-50 border-orange-200' :
                  'text-slate-600 bg-slate-50 border-slate-200';

                return (
                  <React.Fragment key={client.id}>
                    {/* Primary Row */}
                    <tr 
                      className={`hover:bg-slate-50/50 transition-colors group ${isExpanded ? 'bg-indigo-50/25' : ''}`}
                    >
                      <td className="text-center py-3.5 px-3 text-slate-400 font-mono text-[11px] border-r border-slate-100">
                        {index + 1}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 text-sm">{client.name}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold border uppercase tracking-wider ${rankColor}`} title="Categoria/Prioridade do Cliente">
                            {client.ranking}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[150px]" title={client.contactEmail}>
                            {client.contactEmail || 'Sem e-mail cadastrado'}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusColor}`}>
                          {client.status === 'Active' ? 'Ativo' :
                           client.status === 'Onboarding' ? 'Onboarding' :
                           client.status === 'Paused' ? 'Pausado' : 'Inativo'}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        {(() => {
                          const rating = client.satisfactionRating || 5;
                          const ratingsMap = [
                            { emoji: '🔴', label: '1/5', style: 'text-red-700 bg-red-50 border-red-150', text: 'Muito Insatisfeito' },
                            { emoji: '🟠', label: '2/5', style: 'text-orange-700 bg-orange-50 border-orange-150', text: 'Insatisfeito' },
                            { emoji: '🟡', label: '3/5', style: 'text-amber-700 bg-amber-50 border-amber-150', text: 'Neutro' },
                            { emoji: '🟢', label: '4/5', style: 'text-emerald-700 bg-emerald-50 border-emerald-150', text: 'Satisfeito' },
                            { emoji: '🔵', label: '5/5', style: 'text-indigo-700 bg-indigo-50 border-indigo-150', text: 'Totalmente Satisfeito' },
                          ];
                          const config = ratingsMap[rating - 1] || ratingsMap[4];
                          return (
                            <div className="flex flex-col items-center justify-center gap-1 select-none">
                              <span 
                                className={`px-2 py-0.5 rounded-full text-[9px] font-bold border flex items-center gap-1 shrink-0 ${config.style}`}
                                title={`Nível de satisfação: ${rating}/5 - ${config.text}`}
                              >
                                <span>{config.emoji}</span>
                                <span>{config.label}</span>
                              </span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(dot => (
                                  <div 
                                    key={dot}
                                    className={`w-1 h-1 rounded-full ${
                                      dot <= rating 
                                        ? rating === 1 ? 'bg-red-500' :
                                          rating === 2 ? 'bg-orange-500' :
                                          rating === 3 ? 'bg-amber-400' :
                                          rating === 4 ? 'bg-emerald-500' : 'bg-indigo-600'
                                        : 'bg-slate-200'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 shrink-0 uppercase">
                            {(client.responsibles.serviceLiaison || 'S')[0]}
                          </div>
                          <span 
                            onClick={() => client.responsibles.serviceLiaison && client.responsibles.serviceLiaison !== 'Unassigned' && client.responsibles.serviceLiaison !== 'Sem designação' && onViewCollaboratorByName?.(client.responsibles.serviceLiaison)}
                            className={`font-medium truncate max-w-[124px] ${client.responsibles.serviceLiaison && client.responsibles.serviceLiaison !== 'Unassigned' && client.responsibles.serviceLiaison !== 'Sem designação' ? 'cursor-pointer hover:text-indigo-600 hover:underline transition-all text-slate-705 font-bold' : 'text-slate-400'}`} 
                            title={client.responsibles.serviceLiaison ? "Ver perfil do colaborador" : undefined}
                          >
                            {client.responsibles.serviceLiaison || 'Sem designação'}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-slate-650 space-y-1 text-[11px]">
                        {(() => {
                          const hasDesign = client.scope?.design && client.scope.design.length > 0;
                          const hasPaidMedia = client.scope?.paid_media && client.scope.paid_media.length > 0;
                          const hasContentSeo = client.scope?.content_seo && client.scope.content_seo.length > 0;
                          const hasSocialMedia = client.scope?.social_media && client.scope.social_media.length > 0;

                          if (!hasDesign && !hasPaidMedia && !hasContentSeo && !hasSocialMedia) {
                            return <span className="text-slate-400 italic text-[10px]">Sem escopo ativo</span>;
                          }

                          return (
                            <>
                              {hasContentSeo && (
                                <div className="flex items-center gap-1">
                                  <span className="w-12 text-right text-[10px] font-bold text-slate-400 uppercase">Redator:</span>
                                  <span 
                                    onClick={() => client.responsibles?.writer && client.responsibles.writer !== '—' && client.responsibles.writer !== 'Unassigned' && onViewCollaboratorByName?.(client.responsibles.writer)}
                                    className={`font-semibold truncate max-w-[124px] ${client.responsibles?.writer && client.responsibles.writer !== '—' && client.responsibles.writer !== 'Unassigned' ? 'cursor-pointer hover:text-indigo-600 hover:underline transition-all text-slate-800' : 'text-slate-450'}`}
                                    title={client.responsibles?.writer ? "Ver perfil do colaborador" : undefined}
                                  >
                                    {client.responsibles?.writer || '—'}
                                  </span>
                                </div>
                              )}
                              {hasDesign && (
                                <div className="flex items-center gap-1">
                                  <span className="w-12 text-right text-[10px] font-bold text-slate-400 uppercase">Design:</span>
                                  <span 
                                    onClick={() => client.responsibles?.designer && client.responsibles.designer !== '—' && client.responsibles.designer !== 'Unassigned' && onViewCollaboratorByName?.(client.responsibles.designer)}
                                    className={`font-semibold truncate max-w-[124px] ${client.responsibles?.designer && client.responsibles.designer !== '—' && client.responsibles.designer !== 'Unassigned' ? 'cursor-pointer hover:text-indigo-600 hover:underline transition-all text-slate-800' : 'text-slate-450'}`}
                                    title={client.responsibles?.designer ? "Ver perfil do colaborador" : undefined}
                                  >
                                    {client.responsibles?.designer || '—'}
                                  </span>
                                </div>
                              )}
                              {hasPaidMedia && (
                                <div className="flex items-center gap-1">
                                  <span className="w-12 text-right text-[10px] font-bold text-slate-400 uppercase">Tráfego:</span>
                                  <span 
                                    onClick={() => client.responsibles?.paidTrafficHandler && client.responsibles.paidTrafficHandler !== '—' && client.responsibles.paidTrafficHandler !== 'Unassigned' && onViewCollaboratorByName?.(client.responsibles.paidTrafficHandler)}
                                    className={`font-semibold truncate max-w-[124px] ${client.responsibles?.paidTrafficHandler && client.responsibles.paidTrafficHandler !== '—' && client.responsibles.paidTrafficHandler !== 'Unassigned' ? 'cursor-pointer hover:text-indigo-600 hover:underline transition-all text-slate-800' : 'text-slate-450'}`}
                                    title={client.responsibles?.paidTrafficHandler ? "Ver perfil do colaborador" : undefined}
                                  >
                                    {client.responsibles?.paidTrafficHandler || '—'}
                                  </span>
                                </div>
                              )}
                              {hasSocialMedia && (
                                <div className="flex items-center gap-1">
                                  <span className="w-12 text-right text-[10px] font-bold text-slate-400 uppercase">Social:</span>
                                  <span 
                                    onClick={() => client.responsibles?.socialMedia && client.responsibles.socialMedia !== '—' && client.responsibles.socialMedia !== 'Unassigned' && onViewCollaboratorByName?.(client.responsibles.socialMedia)}
                                    className={`font-semibold truncate max-w-[124px] ${client.responsibles?.socialMedia && client.responsibles.socialMedia !== '—' && client.responsibles.socialMedia !== 'Unassigned' ? 'cursor-pointer hover:text-indigo-600 hover:underline transition-all text-slate-800' : 'text-slate-450'}`}
                                    title={client.responsibles?.socialMedia ? "Ver perfil do colaborador" : undefined}
                                  >
                                    {client.responsibles?.socialMedia || '—'}
                                  </span>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-800 text-[12px]">{client.segment || 'Outro Segmento'}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-medium flex items-center gap-1">
                          <Compass size={11} /> Foco {client.marketApproach || 'B2C'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 space-y-2">
                        <div className="flex items-center gap-1.5">
                          {client.driveFolderLink ? (
                            <a 
                              href={client.driveFolderLink} 
                              target="_blank" 
                              referrerPolicy="no-referrer"
                              rel="noreferrer noopener"
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-center shadow-3xs hover:scale-105"
                              title="Pasta do Google Drive"
                            >
                              <GoogleDriveIcon active={true} />
                            </a>
                          ) : (
                            <span 
                              className="p-1.5 rounded-lg bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center opacity-50 cursor-not-allowed"
                              title="Sem Drive vinculado"
                            >
                              <GoogleDriveIcon active={false} />
                            </span>
                          )}

                          {client.annualPlanningLink ? (
                            <a 
                              href={client.annualPlanningLink} 
                              target="_blank" 
                              referrerPolicy="no-referrer"
                              rel="noreferrer noopener"
                              className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 transition-all cursor-pointer flex items-center justify-center shadow-3xs hover:scale-105"
                              title="Planejamento Estratégico Anual (Google Apresentações)"
                            >
                              <GoogleSlidesIcon active={true} />
                            </a>
                          ) : (
                            <span 
                              className="p-1.5 rounded-lg bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center opacity-50 cursor-not-allowed"
                              title="Sem Planejamento vinculado"
                            >
                              <GoogleSlidesIcon active={false} />
                            </span>
                          )}

                          {client.operandLink ? (
                            <a 
                              href={client.operandLink} 
                              target="_blank" 
                              referrerPolicy="no-referrer"
                              rel="noreferrer noopener"
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all cursor-pointer flex items-center justify-center shadow-3xs hover:scale-105"
                              title="Link Operacional do Operand"
                            >
                              <OperandIcon active={true} />
                            </a>
                          ) : (
                            <span 
                              className="p-1.5 rounded-lg bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center opacity-50 cursor-not-allowed"
                              title="Sem Link do Operand"
                            >
                              <OperandIcon active={false} />
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => setExpandedClientId(isExpanded ? null : client.id)}
                          className="text-[10px] text-indigo-650 hover:text-indigo-850 font-bold cursor-pointer underline flex items-center pt-0.5"
                        >
                          {isExpanded ? 'Ocultar Detalhes' : 'Ver Objetivos & Notas'}
                        </button>
                      </td>

                      {customColumns.map(col => {
                        const val = client.customFields?.[col.id];
                        
                        return (
                          <td key={col.id} className="py-3.5 px-3 max-w-[150px] truncate">
                            {(() => {
                               if (val === undefined || val === null || val === '') {
                                 return <span className="text-slate-300 italic text-[10px]">Vazio</span>;
                               }
                               
                               if (col.type === 'link') {
                                 return (
                                   <a 
                                     href={val}
                                     target="_blank"
                                     referrerPolicy="no-referrer"
                                     rel="noreferrer noopener"
                                     className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 font-bold text-[10px] transition-all truncate max-w-full cursor-pointer"
                                     title={val}
                                   >
                                     Link <ExternalLink size={9} />
                                   </a>
                                 );
                               }
                               
                               if (col.type === 'dropdown') {
                                 return (
                                   <span className="inline-block px-2 py-0.5 border border-slate-200 bg-slate-50 text-slate-700 rounded text-[10px] font-semibold">
                                     {val}
                                   </span>
                                 );
                               }
                               
                               if (col.type === 'multiselect') {
                                 const list = Array.isArray(val) ? val : [val];
                                 if (list.length === 0) return <span className="text-slate-300 italic text-[10px]">Nenhum</span>;
                                 return (
                                   <div className="flex flex-wrap gap-1 max-w-full">
                                     {list.map(item => (
                                       <span key={item} className="inline-block px-1.5 py-0.2 border border-indigo-100 bg-indigo-50/50 text-indigo-700 rounded text-[9px] font-bold">
                                         {item}
                                       </span>
                                     ))}
                                   </div>
                                 );
                               }
                               
                               return <span className="text-slate-700 font-semibold text-[11px]">{val}</span>;
                            })()}
                          </td>
                        );
                      })}

                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onEditClient(client)}
                            className="p-1.5 rounded-lg text-slate-550 hover:text-indigo-650 hover:bg-indigo-50 transition-all cursor-pointer"
                            title="Editar Dados de Cadastro"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => onDeleteClient(client.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                            title="Excluir do Diretório"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable row: Objectives and remarks */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={1} className="bg-slate-50 border-r border-slate-100"></td>
                        <td colSpan={7 + customColumns.length} className="bg-slate-50/70 p-4 border-l-2 border-indigo-500">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
                            <div className="space-y-1.5">
                              <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
                                <FileCheck2 size={13} className="text-slate-400" /> Objetivos de Comunicação
                              </h5>
                              <p className="text-slate-650 leading-relaxed bg-white border border-slate-200 p-2.5 rounded-lg text-[11px] min-h-[50px] whitespace-pre-wrap">
                                {client.communicationObjectives || 'Nenhum objetivo especificado no momento. Edite este registro para adicioná-los.'}
                              </p>
                            </div>
                            
                            <div className="space-y-1.5">
                              <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1">🗒️ Observações Internas</h5>
                              <p className="text-slate-650 leading-relaxed bg-white border border-slate-200 p-2.5 rounded-lg text-[11px] min-h-[50px] whitespace-pre-wrap">
                                {client.notes || 'Nenhuma observação ou aviso interno sobre este registro de cliente.'}
                              </p>
                              {client.createdAt && (
                                <div className="text-[10px] text-slate-400 text-right mt-1 font-mono">
                                  Cadastrado em: {new Date(client.createdAt).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Row counter info footer */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 text-slate-400 text-[10px] font-semibold flex items-center justify-between">
        <div>
          Exibindo <span className="text-slate-600">{processedClients.length}</span> de {clients.length} cadastros
        </div>
        <div>
          *Dica: Clique no nome do funcionário para ver seu cadastro unificado e rendimento.
        </div>
      </div>
    </div>
  );
}
