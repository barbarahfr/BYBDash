import React, { useState, useEffect } from 'react';
import { Client, Department } from '../types';
import { X, Save, Layers, DollarSign, Database, Key, FileText, Globe, UserCheck, AlertCircle } from 'lucide-react';

interface DepartmentScopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  department: Department | null;
  onSave: (updatedClient: Client) => void;
}

const PAID_MEDIA_FIELDS = [
  // Equipe & Relacionamento
  { key: 'clientes', label: 'Clientes', category: 'Equipe & Relacionamento' },
  { key: 'relacionamento', label: 'Relacionamento', category: 'Equipe & Relacionamento' },
  { key: 'atendimento', label: 'Atendimento', category: 'Equipe & Relacionamento' },
  { key: 'responsavelMidias', label: 'Responsável Mídias', category: 'Equipe & Relacionamento' },
  { key: 'back', label: 'Back', category: 'Equipe & Relacionamento' },
  { key: 'abcd', label: 'ABCD (Curva)', category: 'Equipe & Relacionamento' },
  { key: 'peso', label: 'Peso', category: 'Equipe & Relacionamento' },
  { key: 'pesoBack', label: 'Peso (Back)', category: 'Equipe & Relacionamento' },
  { key: 'email', label: 'E-mail de contato', category: 'Equipe & Relacionamento', fullWidth: true },

  // Negócio & Estratégia
  { key: 'business', label: 'Business (B2B/B2C)', category: 'Negócio & Estratégia' },
  { key: 'setor', label: 'Setor', category: 'Negócio & Estratégia' },
  { key: 'segmento', label: 'Segmento', category: 'Negócio & Estratégia' },
  { key: 'objetivo', label: 'Objetivo', category: 'Negócio & Estratégia' },
  { key: 'ferramentaMktCrm', label: 'Ferramenta Mkt / CRM', category: 'Negócio & Estratégia' },
  { key: 'sedeCliente', label: 'Sede do Cliente', category: 'Negócio & Estratégia' },
  { key: 'onboarding', label: 'Status Onboarding', category: 'Negócio & Estratégia' },
  { key: 'nps', label: 'NPS', category: 'Negócio & Estratégia' },

  // Investimentos & Mídias
  { key: 'midias', label: 'Mídias Ativas', category: 'Investimentos & Plataformas' },
  { key: 'investTotal', label: 'Investimento Total', category: 'Investimentos & Plataformas' },
  { key: 'google', label: 'Verba Google', category: 'Investimentos & Plataformas' },
  { key: 'meta', label: 'Verba Meta', category: 'Investimentos & Plataformas' },
  { key: 'linkedin', label: 'Verba LinkedIn', category: 'Investimentos & Plataformas' },
  { key: 'tiktok', label: 'Verba TikTok', category: 'Investimentos & Plataformas' },
  { key: 'criativosAds', label: 'Criativos Ads (Responsável)', category: 'Investimentos & Plataformas' },
  { key: 'redeSocial', label: 'Rede Social', category: 'Investimentos & Plataformas' },
  { key: 'tipo', label: 'Tipo de Campanha', category: 'Investimentos & Plataformas' },

  // Links & Relatórios
  { key: 'relatorioApresentacao', label: 'Relatório / Apresentação', category: 'Links & Relatórios' },
  { key: 'linkRelatorio', label: 'Link do Relatório', category: 'Links & Relatórios' },
  { key: 'drive', label: 'Link Drive / Pasta', category: 'Links & Relatórios' },
  { key: 'planoMidias', label: 'Plano de Mídias', category: 'Links & Relatórios' },
  { key: 'leadSheet', label: 'Lead Sheet URL', category: 'Links & Relatórios', fullWidth: true },
  { key: 'conversionSheet', label: 'Conversion Sheet URL', category: 'Links & Relatórios', fullWidth: true },

  // Rastreamento & APIs (Integrações)
  { key: 'ga4', label: 'GA4 Status', category: 'Integrações & Credenciais' },
  { key: 'tintim', label: 'Tintim', category: 'Integrações & Credenciais' },
  { key: 'apiMeta', label: 'API do Meta', category: 'Integrações & Credenciais' },
  { key: 'apiGoogle', label: 'API do Google', category: 'Integrações & Credenciais' },
  { key: 'apiTiktok', label: 'API do TikTok', category: 'Integrações & Credenciais' },
  { key: 'emailApi', label: 'E-mail API', category: 'Integrações & Credenciais' },
  { key: 'numeroRecuperacao', label: 'Número de Recuperação', category: 'Integrações & Credenciais' },
  { key: 'senhaStape', label: 'Senha Stape', category: 'Integrações & Credenciais' },
  { key: 'senhaEmail', label: 'Senha E-mail', category: 'Integrações & Credenciais' },
];

export default function DepartmentScopeModal({
  isOpen,
  onClose,
  client,
  department,
  onSave
}: DepartmentScopeModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<string>('Equipe & Relacionamento');

  useEffect(() => {
    if (client && department) {
      const existingDetails = client.scopeDetails?.[department.id] || {};
      const initial: Record<string, string> = { ...existingDetails };
      
      // Garante que o nome do cliente venha preenchido por padrão no campo "clientes"
      if (!initial.clientes) {
        initial.clientes = client.name;
      }
      if (!initial.relacionamento) {
        initial.relacionamento = client.responsibles?.serviceLiaison || '';
      }
      if (!initial.responsavelMidias && department.id === 'paid_media') {
        initial.responsavelMidias = client.responsibles?.paidTrafficHandler || '';
      }

      setFormData(initial);
    }
  }, [client, department, isOpen]);

  if (!isOpen || !client || !department) return null;

  const categories = Array.from(new Set(PAID_MEDIA_FIELDS.map(f => f.category)));

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFormSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedDetails = {
      ...(client.scopeDetails || {}),
      [department.id]: formData
    };

    const updatedClient: Client = {
      ...client,
      scopeDetails: updatedDetails
    };

    onSave(updatedClient);
    onClose();
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Equipe & Relacionamento': return <UserCheck size={16} />;
      case 'Negócio & Estratégia': return <Globe size={16} />;
      case 'Investimentos & Plataformas': return <DollarSign size={16} />;
      case 'Links & Relatórios': return <FileText size={16} />;
      case 'Integrações & Credenciais': return <Key size={16} />;
      default: return <Layers size={16} />;
    }
  };

  const isPaidMedia = department.id === 'paid_media';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden border border-zinc-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-zinc-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Layers size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Informações de Escopo: {department.name}
              </h3>
              <p className="text-xs text-zinc-400">
                Cliente: <span className="font-semibold text-zinc-200">{client.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        {isPaidMedia ? (
          <form onSubmit={handleFormSave} className="flex flex-col flex-1 overflow-hidden">
            
            {/* Tabs */}
            <div className="flex border-b border-zinc-200 bg-zinc-50 px-6 gap-2 pt-2 shrink-0 overflow-x-auto custom-scrollbar-slate">
              {categories.map(cat => {
                const isActive = activeTab === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveTab(cat)}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-xl shadow-2xs'
                        : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/60 rounded-t-xl'
                    }`}
                  >
                    {getCategoryIcon(cat)}
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Form Fields Container */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar-slate bg-zinc-50/30">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PAID_MEDIA_FIELDS.filter(f => f.category === activeTab).map(field => {
                  return (
                    <div
                      key={field.key}
                      className={`flex flex-col gap-1.5 ${field.fullWidth ? 'md:col-span-2 lg:col-span-3' : ''}`}
                    >
                      <label className="text-xs font-bold text-zinc-700 font-sans">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={formData[field.key] || ''}
                        onChange={e => handleInputChange(field.key, e.target.value)}
                        placeholder={`Inserir ${field.label.toLowerCase()}...`}
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 font-medium placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-2xs"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-white border-t border-zinc-200 flex items-center justify-between shrink-0">
              <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                <AlertCircle size={14} className="text-indigo-600" />
                As alterações realizadas aqui são salvas na conta ativa do cliente.
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <Save size={15} />
                  Salvar Escopo
                </button>
              </div>
            </div>

          </form>
        ) : (
          <div className="p-8 text-center flex flex-col items-center justify-center flex-1 space-y-4">
            <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400 mb-2">
              <Layers size={32} />
            </div>
            <h4 className="text-lg font-bold text-zinc-800">
              Cadastro de Escopo: {department.name}
            </h4>
            <p className="text-xs text-zinc-500 max-w-md leading-relaxed">
              Em breve teremos campos personalizados de escopo configurados especificamente para o setor de <strong>{department.name}</strong>. Por enquanto, utilize as informações gerais do cliente.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-colors"
            >
              Entendido
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
