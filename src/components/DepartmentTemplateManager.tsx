/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Department } from '../types';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  FolderPlus, 
  AlertTriangle 
} from 'lucide-react';

interface DepartmentTemplateManagerProps {
  departments: Department[];
  onAddDepartment: (name: string, color: string) => void;
  onDeleteDepartment: (id: string) => void;
  onAddTaskToDepartment: (departmentId: string, name: string, description: string) => void;
  onDeleteTaskFromDepartment: (departmentId: string, taskId: string) => void;
}

export default function DepartmentTemplateManager({
  departments,
  onAddDepartment,
  onDeleteDepartment,
  onAddTaskToDepartment,
  onDeleteTaskFromDepartment
}: DepartmentTemplateManagerProps) {
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptColor, setNewDeptColor] = useState('indigo');

  const [taskNames, setTaskNames] = useState<{ [deptId: string]: string }>({});
  const [taskDescs, setTaskDescs] = useState<{ [deptId: string]: string }>({});

  const COLOR_OPTIONS = [
    { label: 'Verde Esmeralda', value: 'emerald', bg: 'bg-emerald-500' },
    { label: 'Azul Real', value: 'blue', bg: 'bg-blue-500' },
    { label: 'Laranja Âmbar', value: 'amber', bg: 'bg-amber-500' },
    { label: 'Roxo Ametista', value: 'purple', bg: 'bg-purple-500' },
    { label: 'Vermelho Rosa', value: 'rose', bg: 'bg-rose-500' },
  ];

  const handleCreateDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    onAddDepartment(newDeptName.trim(), newDeptColor);
    setNewDeptName('');
  };

  const handleCreateTask = (deptId: string) => {
    const name = taskNames[deptId] || '';
    const desc = taskDescs[deptId] || '';

    if (!name.trim()) return;
    
    onAddTaskToDepartment(deptId, name.trim(), desc.trim() || 'Nenhuma descrição adicionada.');
    
    setTaskNames(prev => ({ ...prev, [deptId]: '' }));
    setTaskDescs(prev => ({ ...prev, [deptId]: '' }));
  };

  const getDeptBadgeClass = (color: string) => {
    switch (color) {
      case 'emerald': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'blue': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'amber': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'purple': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'rose': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Coluna 1: Adicionar Novo Setor */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs">
          <h3 className="font-display font-semibold text-sm text-slate-800 flex items-center gap-2 mb-1.5 text-left">
            <FolderPlus size={16} className="text-indigo-600" />
            Adicionar Novo Setor / Departamento
          </h3>
          <p className="text-xs text-slate-500 mb-4 text-left">
            Crie setores específicos (ex: SEO, Programação, Redação, Social Media) para gerar dinamicamente na planilha de escopo e no formulário de clientes.
          </p>

          <form onSubmit={handleCreateDept} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-slate-700">Nome do Setor *</label>
              <input
                type="text"
                required
                placeholder="ex: Criação Criativos, SEO Onpage"
                value={newDeptName}
                onChange={e => setNewDeptName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-800 font-medium"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-slate-700">Paleta de Cor Representativa</label>
              <div className="grid grid-cols-5 gap-2 pt-1">
                {COLOR_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    title={opt.label}
                    onClick={() => setNewDeptColor(opt.value)}
                    className={`h-8 rounded-lg border flex items-center justify-center relative transition-all cursor-pointer ${
                      newDeptColor === opt.value 
                        ? 'border-indigo-600 ring-2 ring-indigo-100' 
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${opt.bg}`} />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!newDeptName.trim()}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-xs font-bold text-white rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Plus size={13} />
              Cadastrar Novo Setor
            </button>
          </form>
        </div>

        {/* Políticas de Cascata */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-800 text-left">
          <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1">
            <div className="font-bold">Política de Cascata do Banco de Dados</div>
            <p className="text-amber-700 leading-normal">
              A exclusão de um setor ou de uma tarefa modelo neste painel removerá os respectivos escopos associados e históricos salvos em todos os clientes ativos, evitando inconsistências.
            </p>
          </div>
        </div>
      </div>

      {/* Colunas 2 & 3: Lista de Setores e suas tarefas */}
      <div className="lg:col-span-2 space-y-4">
        {departments.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-200 py-12 text-center text-slate-400">
            <p className="font-semibold text-slate-600">Nenhum departamento cadastrado até o momento.</p>
            <p className="text-xs">Use o menu à esquerda para criar seu primeiro setor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map(dept => (
              <div 
                key={dept.id} 
                id={`dept-panel-${dept.id}`}
                className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold border rounded-full ${getDeptBadgeClass(dept.color)}`}>
                        {dept.name}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm(`Você tem certeza que deseja excluir o setor "${dept.name}"? Isso apagará todas as ${dept.tasks.length} tarefas deste setor em todos os clientes cadastrados.`)) {
                          onDeleteDepartment(dept.id);
                        }
                      }}
                      className="p-1 rounded-sm text-slate-300 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Excluir Setor Inteiro"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-left">
                    Tarefas Modelos ({dept.tasks.length})
                  </h5>
                  
                  {dept.tasks.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic py-2 text-left">Nenhuma tarefa cadastrada para este setor.</p>
                  ) : (
                    <div className="space-y-2 mb-4 max-h-[160px] overflow-y-auto custom-scrollbar pr-1 text-left">
                      {dept.tasks.map(task => (
                        <div 
                          key={task.id} 
                          className="flex items-start justify-between gap-2 p-2 bg-slate-50 border border-slate-100 rounded-lg group hover:border-indigo-100 transition-all"
                        >
                          <div className="space-y-0.5">
                            <div className="font-semibold text-slate-700 text-xs flex items-center gap-1">
                              <CheckCircle2 size={11} className="text-slate-405 shrink-0" />
                              {task.name}
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-1 group-hover:line-clamp-none transition-all">
                              {task.description}
                            </p>
                          </div>
                          
                          <button
                            onClick={() => onDeleteTaskFromDepartment(dept.id, task.id)}
                            className="p-1 text-slate-300 hover:text-rose-500 rounded transition-colors shrink-0 cursor-pointer"
                            title="Excluir tarefa"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Adicionar tarefas para este setor */}
                <div className="border-t border-slate-100 pt-3 mt-2 space-y-2 text-left">
                  <h6 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 font-mono">
                    <Plus size={10} /> Adicionar Modelo De Tarefa
                  </h6>
                  
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      placeholder="ex: Criação de Identidade Visual"
                      value={taskNames[dept.id] || ''}
                      onChange={e => setTaskNames(p => ({ ...p, [dept.id]: e.target.value }))}
                      className="w-full text-[11px] px-2.5 py-1.5 border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 bg-white text-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="Breve descrição da meta / deliverable"
                      value={taskDescs[dept.id] || ''}
                      onChange={e => setTaskDescs(p => ({ ...p, [dept.id]: e.target.value }))}
                      className="w-full text-[10px] px-2.5 py-1 border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 bg-white text-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => handleCreateTask(dept.id)}
                      disabled={!(taskNames[dept.id] || '').trim()}
                      className="w-full py-1 bg-slate-800 hover:bg-slate-950 text-white disabled:opacity-40 text-[10px] font-bold rounded-md transition-all cursor-pointer"
                    >
                      Incluir Tarefa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
