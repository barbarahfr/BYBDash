/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Client, RankingType, MarketApproachType, ClientStatusType, TeamMember, CustomColumn } from '../types';
import { X, Save, AlertCircle, Link2, User, Mail, Target, LayoutGrid, CheckSquare, Square } from 'lucide-react';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: Omit<Client, 'id' | 'createdAt'> & { id?: string }) => void;
  clientToEdit?: Client | null;
  teamMembers: TeamMember[];
  customColumns: CustomColumn[];
}

const INITIAL_FORM_STATE = {
  name: '',
  status: 'Active' as ClientStatusType,
  ranking: 'B' as RankingType,
  responsibles: {
    serviceLiaison: '',
    writer: '',
    designer: '',
    paidTrafficHandler: '',
    socialMedia: '',
  },
  contactEmail: '',
  marketApproach: 'B2C' as MarketApproachType,
  segment: '',
  communicationObjectives: '',
  driveFolderLink: '',
  annualPlanningLink: '',
  notes: '',
  scope: {} as { [deptId: string]: string[] },
  satisfactionRating: 5,
};

const SECTOR_OPTIONS = [
  { id: 'design', name: 'Design', label: 'Design' },
  { id: 'paid_media', name: 'Mídias Pagas', label: 'Mídias Pagas' },
  { id: 'content_seo', name: 'Conteúdo e SEO', label: 'Conteúdo e SEO' },
  { id: 'social_media', name: 'Mídias Sociais', label: 'Mídias Sociais' },
];

export default function ClientFormModal({ isOpen, onClose, onSave, clientToEdit, teamMembers = [], customColumns = [] }: ClientFormModalProps) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [customFields, setCustomFields] = useState<{ [colId: string]: any }>({});

  useEffect(() => {
    if (clientToEdit) {
      const responsiblesCopy = {
        serviceLiaison: clientToEdit.responsibles?.serviceLiaison || '',
        writer: clientToEdit.responsibles?.writer || '',
        designer: clientToEdit.responsibles?.designer || '',
        paidTrafficHandler: clientToEdit.responsibles?.paidTrafficHandler || '',
        socialMedia: clientToEdit.responsibles?.socialMedia || '',
      };
      
      const scopeCopy = clientToEdit.scope ? { ...clientToEdit.scope } : {
        design: [],
        paid_media: [],
        content_seo: [],
        social_media: [],
      };

      setFormData({
        name: clientToEdit.name,
        status: clientToEdit.status,
        ranking: clientToEdit.ranking,
        responsibles: responsiblesCopy,
        contactEmail: clientToEdit.contactEmail,
        marketApproach: clientToEdit.marketApproach,
        segment: clientToEdit.segment,
        communicationObjectives: clientToEdit.communicationObjectives,
        driveFolderLink: clientToEdit.driveFolderLink || '',
        annualPlanningLink: clientToEdit.annualPlanningLink || '',
        notes: clientToEdit.notes || '',
        scope: scopeCopy,
        satisfactionRating: clientToEdit.satisfactionRating || 5,
      });

      // Carregar valores de campos personalizados
      const fields: { [colId: string]: any } = {};
      customColumns.forEach(col => {
        fields[col.id] = clientToEdit.customFields?.[col.id] !== undefined
          ? clientToEdit.customFields[col.id]
          : (col.type === 'multiselect' ? [] : '');
      });
      setCustomFields(fields);

      // Setor do escopo ativo
      const active = Object.keys(scopeCopy).filter(
        key => scopeCopy[key] && scopeCopy[key].length > 0
      );
      setSelectedSectors(active);
      setErrorMsg(null);
    } else {
      setFormData({
        name: '',
        status: 'Active' as ClientStatusType,
        ranking: 'B' as RankingType,
        responsibles: {
          serviceLiaison: '',
          writer: '',
          designer: '',
          paidTrafficHandler: '',
          socialMedia: '',
        },
        contactEmail: '',
        marketApproach: 'B2C' as MarketApproachType,
        segment: '',
        communicationObjectives: '',
        driveFolderLink: '',
        annualPlanningLink: '',
        notes: '',
        scope: {
          design: [],
          paid_media: [],
          content_seo: [],
          social_media: [],
        },
        satisfactionRating: 5,
      });
      
      // Resetar campos personalizados
      const fields: { [colId: string]: any } = {};
      customColumns.forEach(col => {
        fields[col.id] = col.type === 'multiselect' ? [] : '';
      });
      setCustomFields(fields);

      setSelectedSectors([]);
      setErrorMsg(null);
    }
  }, [clientToEdit, isOpen, customColumns]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('O nome do cliente ou da empresa é um campo obrigatório.');
      return;
    }
    setErrorMsg(null);
    onSave({
      ...formData,
      customFields,
      id: clientToEdit?.id,
    });
    onClose();
  };

  const updateResponsible = (role: keyof typeof formData.responsibles, value: string) => {
    setFormData(prev => ({
      ...prev,
      responsibles: {
        ...prev.responsibles,
        [role]: value,
      },
    }));
  };

  const handleToggleSector = (sectorId: string) => {
    setSelectedSectors(prev => {
      const isChosen = prev.includes(sectorId);
      const nextSectors = isChosen 
        ? prev.filter(id => id !== sectorId) 
        : [...prev, sectorId];

      setFormData(fd => {
        const nextScope = { ...fd.scope };
        const nextResponsibles = { ...fd.responsibles };

        if (isChosen) {
          nextScope[sectorId] = [];
          if (sectorId === 'design') nextResponsibles.designer = '';
          if (sectorId === 'paid_media') nextResponsibles.paidTrafficHandler = '';
          if (sectorId === 'content_seo') nextResponsibles.writer = '';
          if (sectorId === 'social_media') nextResponsibles.socialMedia = '';
        } else {
          if (!nextScope[sectorId]) {
            nextScope[sectorId] = [];
          }
        }

        return {
          ...fd,
          scope: nextScope,
          responsibles: nextResponsibles
        };
      });

      return nextSectors;
    });
  };

  const renderMemberSelect = (
    label: string,
    roleKey: keyof typeof formData.responsibles,
    placeholder: string,
    targetTeamIds: string[],
    disabled?: boolean
  ) => {
    const currentValue = formData.responsibles[roleKey];
    const recommended = teamMembers.filter(m => targetTeamIds.includes(m.teamId));
    const others = teamMembers.filter(m => !targetTeamIds.includes(m.teamId));
    const matchedMemberExact = teamMembers.find(m => m.name === currentValue);
    const isMatched = !currentValue || !!matchedMemberExact;

    return (
      <div className="space-y-1 text-left relative">
        <label className={`block text-xs font-semibold flex items-center gap-1.5 ${disabled ? 'text-slate-400' : 'text-slate-700'}`}>
          <User size={13} className={disabled ? 'text-slate-350' : 'text-slate-400'} />
          {label}
          {disabled && (
            <span className="text-[9px] text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded-sm border border-amber-200 ml-1.5 uppercase font-bold">
              Bloqueado (Inativo)
            </span>
          )}
        </label>
        <select
          value={disabled ? '' : currentValue}
          disabled={disabled}
          onChange={e => updateResponsible(roleKey, e.target.value)}
          className={`w-full text-sm px-3 py-2 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white ${
            disabled 
              ? 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200' 
              : 'border-slate-200'
          }`}
        >
          <option value="">{disabled ? 'Ative este escopo primeiro' : placeholder}</option>
          
          {!disabled && (
            <>
              {!isMatched && currentValue && (
                <option value={currentValue}>{currentValue} (Atual / Customizado)</option>
              )}

              {recommended.length > 0 && (
                <optgroup label="Recomendados para esta função">
                  {recommended.map(m => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </optgroup>
              )}

              {others.length > 0 && (
                <optgroup label="Outros Colaboradores">
                  {others.map(m => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </optgroup>
              )}
            </>
          )}
        </select>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        id="client-form-modal-container"
        className="bg-white rounded-xl shadow-xl border border-slate-100 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col transition-all transform scale-100"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-display font-semibold text-lg text-slate-800">
              {clientToEdit ? `Editar Cliente: ${clientToEdit.name}` : 'Cadastrar Novo Cliente'}
            </h3>
            <p className="text-xs text-slate-500">Configure os responsáveis, classificação, objetivos e links estratégicos.</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-rose-700 text-xs text-left">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Core Identification */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 border-b border-slate-100 pb-1.5">
              1. Informações Básicas
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Nome do Cliente / Empresa *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Aura Cosméticos Premium"
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Status do Cliente</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData(p => ({ ...p, status: e.target.value as ClientStatusType }))}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="Active">🟢 Ativo</option>
                  <option value="Onboarding">🟡 Onboarding</option>
                  <option value="Paused">🟠 Pausado</option>
                  <option value="Inactive">⚫ Inativo</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Abordagem de Mercado</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {(['B2B', 'B2C'] as const).map(approach => (
                    <button
                      key={approach}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, marketApproach: approach }))}
                      className={`py-1.5 px-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                        formData.marketApproach === approach
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {approach}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Categoria / Classificação
                </label>
                <div className="grid grid-cols-4 gap-1 mt-1">
                  {(['A', 'B', 'C', 'D'] as const).map(tier => (
                    <button
                      key={tier}
                      type="button"
                      title={`Categoria ${tier}`}
                      onClick={() => setFormData(p => ({ ...p, ranking: tier }))}
                      className={`py-1.5 px-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        formData.ranking === tier
                          ? tier === 'A'
                            ? 'border-rose-500 bg-rose-50 text-rose-700'
                            : tier === 'B'
                            ? 'border-amber-500 bg-amber-50 text-amber-700'
                            : tier === 'C'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-slate-400 bg-slate-100 text-slate-700'
                          : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Nicho / Segmento</label>
                <input
                  type="text"
                  placeholder="ex: Beleza, Cosméticos, SaaS"
                  value={formData.segment}
                  onChange={e => setFormData(p => ({ ...p, segment: e.target.value }))}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Mail size={13} className="text-slate-400" />
                  E-mail de Contato Principal
                </label>
                <input
                  type="email"
                  placeholder="ex: contato@empresa.com"
                  value={formData.contactEmail}
                  onChange={e => setFormData(p => ({ ...p, contactEmail: e.target.value }))}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Termômetro de Satisfação (1 a 5)
                </label>
                <div className="flex items-center gap-1.5 mt-1">
                  {[1, 2, 3, 4, 5].map((level) => {
                    const ratings = [
                      { label: 'Muito Insatisfeito', color: 'bg-red-500 text-white border-red-500 hover:bg-red-600' },
                      { label: 'Insatisfeito', color: 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600' },
                      { label: 'Neutro', color: 'bg-amber-400 text-zinc-900 border-amber-400 hover:bg-amber-505' },
                      { label: 'Satisfeito', color: 'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600' },
                      { label: 'Totalmente Satisfeito', color: 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700' }
                    ];
                    const opt = ratings[level - 1];
                    const isSelected = formData.satisfactionRating === level;

                    return (
                      <button
                        key={level}
                        type="button"
                        title={opt.label}
                        onClick={() => setFormData(p => ({ ...p, satisfactionRating: level }))}
                        className={`w-9 h-9 rounded-full border flex items-center justify-center font-bold text-sm transition-all focus:outline-hidden cursor-pointer select-none ${
                          isSelected 
                            ? `${opt.color} scale-105 border-transparent shadow-md font-extrabold` 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {level}
                      </button>
                    );
                  })}
                  <span className="text-[10px] font-bold text-slate-600 ml-1.5">
                    {formData.satisfactionRating === 1 && '🔴 1/5 (Muito Insatisfeito)'}
                    {formData.satisfactionRating === 2 && '🟠 2/5 (Insatisfeito)'}
                    {formData.satisfactionRating === 3 && '🟡 3/5 (Neutro)'}
                    {formData.satisfactionRating === 4 && '🟢 4/5 (Satisfeito)'}
                    {formData.satisfactionRating === 5 && '🔵 5/5 (Totalmente Satisfeito)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Scopes / Sectors Checkbox Matrix */}
          <div className="space-y-4">
            <h4 id="client-form-scope-header" className="text-xs font-semibold uppercase tracking-wider text-indigo-600 border-b border-slate-100 pb-1.5 flex items-center gap-2">
              <LayoutGrid size={14} />
              2. Áreas de Atuação (Escopo ativo)
            </h4>
            <p className="text-xs text-slate-500">Selecione quais os setores/escopos estão incluídos no contrato ativo deste cliente:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SECTOR_OPTIONS.map(sector => {
                const isSelected = selectedSectors.includes(sector.id);
                return (
                  <button
                    key={sector.id}
                    type="button"
                    onClick={() => handleToggleSector(sector.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare size={16} className="text-indigo-600 shrink-0" />
                    ) : (
                      <Square size={16} className="text-slate-350 shrink-0" />
                    )}
                    <span className="text-xs font-semibold select-none">{sector.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Staff & Sector Responsibles */}
          <div className="space-y-4">
            <h4 id="client-form-responsibles-header" className="text-xs font-semibold uppercase tracking-wider text-indigo-600 border-b border-slate-100 pb-1.5 flex items-center gap-2">
              <User size={14} />
              3. Atribuição de Responsáveis da Equipe
            </h4>
            <p className="text-xs text-slate-500">
              Selecione os responsáveis para cada departamento. As funções de setores específicos serão liberadas apenas se o setor correspondente estiver ativado acima.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderMemberSelect(
                'Atendimento',
                'serviceLiaison',
                'Selecione o Liaison de Atendimento',
                ['team_paid_media', 'team_automations_crm'],
                false
              )}

              {renderMemberSelect(
                'Design / Criativos',
                'designer',
                'Selecione o Designer responsável',
                ['team_design'],
                !selectedSectors.includes('design')
              )}

              {renderMemberSelect(
                'Mídias Sociais / Social Media',
                'socialMedia',
                'Selecione o profissional de Social Media',
                ['team_social_media'],
                !selectedSectors.includes('social_media')
              )}

              {renderMemberSelect(
                'Gestão de Tráfego / Mídias Pagas',
                'paidTrafficHandler',
                'Selecione o Gestor de Mídias Pagas',
                ['team_paid_media'],
                !selectedSectors.includes('paid_media')
              )}

              {renderMemberSelect(
                'Redação / Conteúdo e SEO',
                'writer',
                'Selecione o Redator/Gerente de Conteúdo',
                ['team_content_seo', 'team_social_media'],
                !selectedSectors.includes('content_seo')
              )}
            </div>
          </div>

          {/* Section 4: Links & Strategic Data */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 border-b border-slate-100 pb-1.5">
              4. Planejamento Estratégico & Links Externos
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Link2 size={13} className="text-emerald-500" />
                  Link da Pasta de Criativos (Google Drive)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={formData.driveFolderLink}
                  onChange={e => setFormData(p => ({ ...p, driveFolderLink: e.target.value }))}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white"
                />
                <span className="text-[10px] text-slate-400">Armazena logotipos, fontes, imagens e criativos brutos.</span>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Link2 size={13} className="text-amber-500" />
                  Link do Planejamento Estratégico Anual (Planilha)
                </label>
                <input
                  type="url"
                  placeholder="https://docs.google.com/spreadsheets/..."
                  value={formData.annualPlanningLink}
                  onChange={e => setFormData(p => ({ ...p, annualPlanningLink: e.target.value }))}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white"
                />
                <span className="text-[10px] text-slate-400">Contém metas corporativas anuais e editorias de palavras-chave.</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Target size={13} className="text-slate-400" />
                Objetivos e Metas Próximas de Comunicação
              </label>
              <textarea
                rows={3}
                placeholder="Descreva as metas trimestrais, deliverables principais, restrições ou tom de voz de posicionamento..."
                value={formData.communicationObjectives}
                onChange={e => setFormData(p => ({ ...p, communicationObjectives: e.target.value }))}
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white custom-scrollbar text-slate-750"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Observações Gerais / Notas Internas</label>
              <textarea
                rows={2}
                placeholder="Preferências específicas do cliente, datas importantes de faturamento ou avisos..."
                value={formData.notes}
                onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white custom-scrollbar text-slate-750"
              />
            </div>
          </div>

          {/* Section 5: Custom Fields */}
          {customColumns.length > 0 && (
            <div className="space-y-4">
              <h4 id="client-form-custom-fields-header" className="text-xs font-semibold uppercase tracking-wider text-indigo-600 border-b border-slate-100 pb-1.5">
                5. Campos Personalizados Dinâmicos
              </h4>
              <p className="text-xs text-slate-500">Adicione as informações complementares necessárias definidas para sua agência:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customColumns.map(col => {
                  const val = customFields[col.id];
                  
                  return (
                    <div key={col.id} className="space-y-1 text-left">
                      <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
                        <span>{col.name}</span>
                        <span className="text-[9px] text-slate-405 font-mono capitalize bg-slate-100 px-1.5 py-0.5 rounded">
                          {col.type === 'multiselect' ? 'Multi' : col.type === 'dropdown' ? 'Dropdown' : col.type === 'link' ? 'Link' : 'Texto'}
                        </span>
                      </label>
                      
                      {col.type === 'text' && (
                        <input
                          type="text"
                          placeholder={`Digite o conteúdo para ${col.name}`}
                          value={val || ''}
                          onChange={e => setCustomFields(prev => ({ ...prev, [col.id]: e.target.value }))}
                          className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white text-slate-800"
                        />
                      )}

                      {col.type === 'link' && (
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                            🔗
                          </span>
                          <input
                            type="url"
                            placeholder="https://..."
                            value={val || ''}
                            onChange={e => setCustomFields(prev => ({ ...prev, [col.id]: e.target.value }))}
                            className="w-full text-sm pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white text-slate-850"
                          />
                        </div>
                      )}

                      {col.type === 'dropdown' && (
                        <select
                          value={val || ''}
                          onChange={e => setCustomFields(prev => ({ ...prev, [col.id]: e.target.value }))}
                          className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white text-slate-700"
                        >
                          <option value="">Selecione uma opção...</option>
                          {(col.options || []).map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}

                      {col.type === 'multiselect' && (
                        <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg min-h-[38px]">
                          {(col.options || []).map(opt => {
                            const activeList = Array.isArray(val) ? val : [];
                            const isSelected = activeList.includes(opt);
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  const nextList = isSelected
                                    ? activeList.filter(item => item !== opt)
                                    : [...activeList, opt];
                                  setCustomFields(prev => ({ ...prev, [col.id]: nextList }));
                                }}
                                className={`px-2 py-1 rounded text-[11px] font-semibold transition-all border cursor-pointer ${
                                  isSelected
                                    ? 'bg-indigo-600 border-indigo-650 text-white shadow-xs font-bold'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                                  }`}
                              >
                                {isSelected ? '✓ ' : ''}{opt}
                              </button>
                            );
                          })}
                          {(col.options || []).length === 0 && (
                            <span className="text-[10px] text-slate-450 italic">Nenhuma opção cadastrada</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-750 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Save size={14} />
            {clientToEdit ? 'Salvar Alterações' : 'Cadastrar Cliente'}
          </button>
        </div>
      </div>
    </div>
  );
}
