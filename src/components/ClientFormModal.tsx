/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Client, RankingType, MarketApproachType, ClientStatusType, TeamMember, CustomColumn } from '../types';
import { X, Save, AlertCircle, Link2, User, Mail, Target, HelpCircle, LayoutGrid, CheckSquare, Square } from 'lucide-react';

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

      // Load custom fields values
      const fields: { [colId: string]: any } = {};
      customColumns.forEach(col => {
        fields[col.id] = clientToEdit.customFields?.[col.id] !== undefined
          ? clientToEdit.customFields[col.id]
          : (col.type === 'multiselect' ? [] : '');
      });
      setCustomFields(fields);

      // A sector is considered active if deep has items or exists with some defined tasks
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
      
      // Default empty custom fields values
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
      setErrorMsg('Client Name is a required field.');
      return;
    }
    setErrorMsg(null);
    onSave({
      ...formData,
      customFields, // Pass custom fields values back
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
    
    // Group team members: Recommended (belonging to targetTeamIds) and Others
    const recommended = teamMembers.filter(m => targetTeamIds.includes(m.teamId));
    const others = teamMembers.filter(m => !targetTeamIds.includes(m.teamId));

    // To prevent clearing old values that might have been free-text or formatted differently
    const matchedMemberExact = teamMembers.find(m => m.name === currentValue);
    // Fallback logic, checking if exact match or if current value is empty
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
              {/* Fallback entry if value exists and is not exact matched */}
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="client-form-modal-container"
        className="bg-white rounded-xl shadow-xl border border-slate-100 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col transition-all transform scale-100"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-display font-semibold text-lg text-slate-800">
              {clientToEdit ? `Edit Client: ${clientToEdit.name}` : 'Register New Client'}
            </h3>
            <p className="text-xs text-slate-500">Configure key roles, classification, objectives, and planning links.</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
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
              1. Basic Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Client / Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aura Premium Cosmetics"
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Client Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData(p => ({ ...p, status: e.target.value as ClientStatusType }))}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="Active">🟢 Active</option>
                  <option value="Onboarding">🟡 Onboarding</option>
                  <option value="Paused">🟠 Paused</option>
                  <option value="Inactive">⚫ Inactive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Market Approach</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {(['B2B', 'B2C'] as const).map(approach => (
                    <button
                      key={approach}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, marketApproach: approach }))}
                      className={`py-1.5 px-3 rounded-lg border text-xs font-medium transition-all ${
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
                  Client Ranking Category
                </label>
                <div className="grid grid-cols-4 gap-1 mt-1">
                  {(['A', 'B', 'C', 'D'] as const).map(tier => (
                    <button
                      key={tier}
                      type="button"
                      title={`Rank ${tier}`}
                      onClick={() => setFormData(p => ({ ...p, ranking: tier }))}
                      className={`py-1.5 px-1 rounded-lg border text-xs font-semibold transition-all ${
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
                <label className="block text-xs font-semibold text-slate-700">Market Segment / Niche</label>
                <input
                  type="text"
                  placeholder="e.g. Beauty, SaaS, Real Estate"
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
                  Contact Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. client.manager@company.com"
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
                      { label: 'Muito Insatisfeito', color: 'bg-red-500 text-white border-red-500 hover:bg-red-600', ring: 'focus:ring-red-500' },
                      { label: 'Insatisfeito', color: 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600', ring: 'focus:ring-orange-500' },
                      { label: 'Neutro', color: 'bg-amber-400 text-zinc-900 border-amber-400 hover:bg-amber-500', ring: 'focus:ring-amber-400' },
                      { label: 'Satisfeito', color: 'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600', ring: 'focus:ring-emerald-500' },
                      { label: 'Totalmente Satisfeito', color: 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700', ring: 'focus:ring-indigo-600' }
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
                            ? `${opt.color} scale-105 border-transparent shadow-md` 
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
              2. Escopo
            </h4>
            <p className="text-xs text-slate-500">Selecione quais os setores/escopos estão incluídos no contrato deste cliente:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SECTOR_OPTIONS.map(sector => {
                const isSelected = selectedSectors.includes(sector.id);
                return (
                  <button
                    key={sector.id}
                    type="button"
                    onClick={() => handleToggleSector(sector.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
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
              3. Equipe responsável
            </h4>
            <p className="text-xs text-slate-500">
              Selecione os responsáveis para cada departamento. As funções de setores específicos serão liberadas apenas se o setor correspondente estiver ativado acima.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Atendimento is always enabled */}
              {renderMemberSelect(
                'Atendimento',
                'serviceLiaison',
                'Selecione o profissional de Atendimento',
                ['team_paid_media', 'team_automations_crm'],
                false
              )}

              {/* Design is enabled only if sector 'design' is active */}
              {renderMemberSelect(
                'Design',
                'designer',
                'Selecione o designer responsável',
                ['team_design'],
                !selectedSectors.includes('design')
              )}

              {/* Mídias Sociais is enabled only if sector 'social_media' is active */}
              {renderMemberSelect(
                'Mídias Sociais',
                'socialMedia',
                'Selecione o profissional de Mídias Sociais',
                ['team_social_media'],
                !selectedSectors.includes('social_media')
              )}

              {/* Analista de Mídias Pagas is enabled only if sector 'paid_media' is active */}
              {renderMemberSelect(
                'Analista de Mídias Pagas',
                'paidTrafficHandler',
                'Selecione o gestor de tráfego pago',
                ['team_paid_media'],
                !selectedSectors.includes('paid_media')
              )}

              {/* Analista de Conteúdo e SEO is enabled only if sector 'content_seo' is active */}
              {renderMemberSelect(
                'Analista de Conteúdo e SEO',
                'writer',
                'Selecione o redator/coprodutor de conteúdo',
                ['team_content_seo', 'team_social_media'],
                !selectedSectors.includes('content_seo')
              )}
            </div>
          </div>

          {/* Section 4: Links & Strategic Data */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 border-b border-slate-100 pb-1.5">
              4. Planejamento Estratégico & Links
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Link2 size={13} className="text-emerald-500" />
                  Google Drive Folder Link
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={formData.driveFolderLink}
                  onChange={e => setFormData(p => ({ ...p, driveFolderLink: e.target.value }))}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white"
                />
                <span className="text-[10px] text-slate-400">Stores logos, raw images, and design templates.</span>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Link2 size={13} className="text-amber-500" />
                  Annual Strategy / Planning Link
                </label>
                <input
                  type="url"
                  placeholder="https://docs.google.com/spreadsheets/..."
                  value={formData.annualPlanningLink}
                  onChange={e => setFormData(p => ({ ...p, annualPlanningLink: e.target.value }))}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white"
                />
                <span className="text-[10px] text-slate-400">Contains annual goals and keyword calendars.</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Target size={13} className="text-slate-400" />
                Communication Objectives or Goals
              </label>
              <textarea
                rows={3}
                placeholder="List major deliverables, quarterly targets, tone constraints..."
                value={formData.communicationObjectives}
                onChange={e => setFormData(p => ({ ...p, communicationObjectives: e.target.value }))}
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white custom-scrollbar"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Internal Remarks / Notes</label>
              <textarea
                rows={2}
                placeholder="Specific preferences, billing dates, client hours constraints..."
                value={formData.notes}
                onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white custom-scrollbar"
              />
            </div>
          </div>

          {/* Section 5: Custom Fields */}
          {customColumns.length > 0 && (
            <div className="space-y-4">
              <h4 id="client-form-custom-fields-header" className="text-xs font-semibold uppercase tracking-wider text-indigo-600 border-b border-slate-100 pb-1.5">
                5. Campos Personalizados
              </h4>
              <p className="text-xs text-slate-500">Preencha as informações adicionais customizadas para este cliente:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customColumns.map(col => {
                  const val = customFields[col.id];
                  
                  return (
                    <div key={col.id} className="space-y-1 text-left">
                      <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
                        <span>{col.name}</span>
                        <span className="text-[9px] text-slate-400 capitalize bg-slate-100 px-1.5 py-0.5 rounded">
                          {col.type === 'multiselect' ? 'Múltipla Escolha' : col.type === 'dropdown' ? 'Seleção Dropdown' : col.type === 'link' ? 'Link Clicável' : 'Texto Simples'}
                        </span>
                      </label>
                      
                      {col.type === 'text' && (
                        <input
                          type="text"
                          placeholder={`Digite o conteúdo de ${col.name}`}
                          value={val || ''}
                          onChange={e => setCustomFields(prev => ({ ...prev, [col.id]: e.target.value }))}
                          className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white"
                        />
                      )}

                      {col.type === 'link' && (
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <span className="text-xs">🔗</span>
                          </span>
                          <input
                            type="url"
                            placeholder="https://..."
                            value={val || ''}
                            onChange={e => setCustomFields(prev => ({ ...prev, [col.id]: e.target.value }))}
                            className="w-full text-sm pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white"
                          />
                        </div>
                      )}

                      {col.type === 'dropdown' && (
                        <select
                          value={val || ''}
                          onChange={e => setCustomFields(prev => ({ ...prev, [col.id]: e.target.value }))}
                          className="w-full text-sm px-3 py-2 border border-slate-250 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white"
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
                                className={`px-2 py-1 rounded text-[11px] font-semibold transition-all border ${
                                  isSelected
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
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
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Save size={14} />
            {clientToEdit ? 'Accept and Save Changes' : 'Register Service Client'}
          </button>
        </div>
      </div>
    </div>
  );
}
