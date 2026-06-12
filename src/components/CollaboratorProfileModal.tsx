/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TeamMember, Client, Team } from '../types';
import { 
  X, 
  Mail, 
  Briefcase, 
  Users, 
  FolderHeart, 
  Smile, 
  Award, 
  Edit2,
  ThumbsUp,
  Heart,
  AlertCircle
} from 'lucide-react';

interface CollaboratorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
  teams: Team[];
  clients: Client[];
  onEditMemberClick?: (member: TeamMember) => void;
}

export default function CollaboratorProfileModal({
  isOpen,
  onClose,
  member,
  teams,
  clients,
  onEditMemberClick
}: CollaboratorProfileModalProps) {
  if (!isOpen || !member) return null;

  // Find their team name
  const teamObj = teams.find(t => t.id === member.teamId);
  const teamName = teamObj ? teamObj.name : 'Outro / Sem time';

  // Find if they are coordinators of any team
  const coordinatedTeams = teams.filter(t => t.coordinatorId === member.id);
  const isCoordinatorOfAny = coordinatedTeams.length > 0;

  // Calculate dynamic client list and count where this member is assigned
  const nameLower = member.name.toLowerCase().trim();
  const assignedClients = clients.filter(c => {
    const rs = c.responsibles;
    if (!rs) return false;
    const sys = (rs.serviceLiaison || '').toLowerCase().trim();
    const wr = (rs.writer || '').toLowerCase().trim();
    const ds = (rs.designer || '').toLowerCase().trim();
    const pt = (rs.paidTrafficHandler || '').toLowerCase().trim();
    const sm = (rs.socialMedia || '').toLowerCase().trim();
    
    return sys === nameLower || sys.startsWith(nameLower) || nameLower.startsWith(sys) ||
           wr === nameLower || wr.startsWith(nameLower) || nameLower.startsWith(wr) ||
           ds === nameLower || ds.startsWith(nameLower) || nameLower.startsWith(ds) ||
           pt === nameLower || pt.startsWith(nameLower) || nameLower.startsWith(pt) ||
           sm === nameLower || sm.startsWith(nameLower) || nameLower.startsWith(sm);
  });

  // Calculate satisfaction metrics for involved clients
  // Clients with a valid satisfaction rating
  const ratedClients = assignedClients.filter(c => c.satisfactionRating !== undefined && c.satisfactionRating > 0);
  const totalRated = ratedClients.length;
  
  // Counts of each satisfaction score (1 to 5)
  const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sumRatings = 0;
  
  ratedClients.forEach(c => {
    const rating = c.satisfactionRating as 1 | 2 | 3 | 4 | 5;
    if (ratingCounts[rating] !== undefined) {
      ratingCounts[rating]++;
      sumRatings += rating;
    }
  });

  const averageRating = totalRated > 0 ? (sumRatings / totalRated).toFixed(1) : 'N/A';
  const satisfactionPercent = totalRated > 0 ? Math.round((sumRatings / (totalRated * 5)) * 100) : 0;

  // Satisfaction Level Color and Label based on percentage
  const getSatisfactionHealth = (pct: number, count: number) => {
    if (count === 0) return { label: 'Sem Avaliações', colorText: 'text-zinc-400', progressColor: 'bg-zinc-200' };
    if (pct >= 80) return { label: 'Alta Performance', colorText: 'text-emerald-600', progressColor: 'bg-emerald-500' };
    if (pct >= 60) return { label: 'Regular / Estável', colorText: 'text-amber-500', progressColor: 'bg-amber-400' };
    return { label: 'Critico / Alerta', colorText: 'text-rose-600', progressColor: 'bg-rose-500' };
  };

  const health = getSatisfactionHealth(satisfactionPercent, totalRated);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs z-55 flex items-center justify-center p-4 transition-all">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] shadow-2xl border border-zinc-200/80 flex flex-col overflow-hidden text-left animate-slide-up">
        {/* Top Header Card Banner */}
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white px-6 py-5 shrink-0 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/10"
            id="close-profile-modal"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white text-zinc-900 font-bold font-display flex items-center justify-center text-xl shadow-md border border-white/10 shrink-0">
              {getInitials(member.name)}
            </div>
            
            <div className="truncate pr-8">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-lg leading-tight tracking-tight truncate">{member.name}</h3>
                {member.isCoordinator && (
                  <span className="bg-zinc-100 text-zinc-900 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-widest leading-none">
                    Coordenador
                  </span>
                )}
              </div>
              <p className="text-zinc-300 text-xs mt-1 font-medium flex items-center gap-1">
                <Briefcase size={12} className="text-zinc-400" /> {member.role || 'Colaborador técnico'}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Info Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                <Mail size={12} className="text-zinc-400" /> Endereço de Email
              </span>
              <p className="text-sm font-bold text-zinc-800 break-all select-all">{member.email}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                <Users size={12} className="text-zinc-400" /> Time de Atuação
              </span>
              <p className="text-sm font-bold text-zinc-800">{teamName}</p>
              {isCoordinatorOfAny && (
                <p className="text-[10px] text-indigo-600 font-semibold mt-0.5">
                  Líder de: {coordinatedTeams.map(t => t.name).join(', ')}
                </p>
              )}
            </div>
          </div>

          <hr className="border-zinc-100" />

          {/* Satisfaction Metrics Section */}
          <div className="space-y-3.5">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                <Smile size={14} className="text-indigo-500" /> Índice de Satisfação dos Clientes
              </h4>
              <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full font-bold border border-indigo-100 uppercase tracking-wider">
                Dos carteiras em que atua
              </span>
            </div>

            {totalRated === 0 ? (
              <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 text-center text-zinc-400 text-xs py-7">
                <AlertCircle className="mx-auto text-zinc-300 mb-1.5" size={24} />
                Nenhum dos clientes desse colaborador possui avaliação de termômetro.
              </div>
            ) : (
              <div className="bg-zinc-50/50 rounded-xl p-4 border border-zinc-200 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                {/* Gauge Section */}
                <div className="md:col-span-5 text-center flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-zinc-100 pb-4 md:pb-0 pr-0 md:pr-4">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    {/* Circle Background */}
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                      <path
                        className="text-zinc-200"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {/* Circle Progress filled dynamically */}
                      <path
                        className={`transition-all duration-700 ${
                          satisfactionPercent >= 80 ? 'text-emerald-500' :
                          satisfactionPercent >= 60 ? 'text-amber-500' : 'text-rose-500'
                        }`}
                        strokeWidth="3.5"
                        strokeDasharray={`${satisfactionPercent}, 100`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-display font-bold text-lg text-zinc-800 leading-none">
                        {satisfactionPercent}%
                      </span>
                      <span className="text-[8px] font-extrabold text-zinc-400 uppercase tracking-widest mt-0.5">
                        Média {averageRating}
                      </span>
                    </div>
                  </div>
                  <p className={`text-[10px] font-extrabold uppercase tracking-wider mt-2.5 ${health.colorText}`}>
                    {health.label}
                  </p>
                </div>

                {/* Rating Breakdown Graph Bars */}
                <div className="md:col-span-7 space-y-1.5 font-sans">
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Distribuição de Notas dos Clientes</p>
                  {[5, 4, 3, 2, 1].map(level => {
                    const count = ratingCounts[level as 1 | 2 | 3 | 4 | 5] || 0;
                    const percent = Math.round((count / totalRated) * 100);
                    const levelColors = 
                      level === 5 ? 'bg-indigo-600' :
                      level === 4 ? 'bg-emerald-500' :
                      level === 3 ? 'bg-amber-400' :
                      level === 2 ? 'bg-orange-500' : 'bg-red-500';

                    return (
                      <div key={level} className="flex items-center gap-2 text-xs font-semibold">
                        <span className="font-mono text-[10px] text-zinc-500 w-3 text-right">{level}</span>
                        <div className="flex-1 h-2 bg-zinc-200/60 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${levelColors}`} 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="font-mono text-[9px] text-zinc-500 w-10 text-right">
                          {count} ({percent}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <hr className="border-zinc-100" />

          {/* Involved Clients Directory List */}
          <div className="space-y-3.5">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                <FolderHeart size={14} className="text-zinc-600 shrink-0" />
                Clientes Designados ({assignedClients.length})
              </h4>
              <span className="text-[10px] text-zinc-400 font-medium">Atualizado dinamicamente</span>
            </div>

            {assignedClients.length === 0 ? (
              <div className="border border-zinc-150 rounded-xl p-5 text-center text-zinc-400 text-xs py-7 bg-zinc-50/30">
                <p>Nenhum cliente associado no momento.</p>
                <p className="text-[10px] text-zinc-400 mt-1">Este colaborador ainda não consta nas responsabilidades de escopo de nenhuma conta.</p>
              </div>
            ) : (
              <div className="border border-zinc-200 rounded-xl overflow-hidden divide-y divide-zinc-150 max-h-[180px] overflow-y-auto bg-white pr-0.5">
                {assignedClients.map(client => {
                  const rating = client.satisfactionRating || 5;
                  const getStarColor = (starRate: number) => {
                    if (starRate === 5) return 'text-indigo-600 bg-indigo-50 border-indigo-100';
                    if (starRate === 4) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
                    if (starRate === 3) return 'text-amber-500 bg-amber-50 border-amber-100';
                    if (starRate === 2) return 'text-orange-500 bg-orange-50 border-orange-100';
                    return 'text-red-500 bg-red-50 border-red-100';
                  };

                  return (
                    <div key={client.id} className="flex items-center justify-between p-2.5 text-xs hover:bg-zinc-50/50 transition-colors">
                      <div className="truncate flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <div>
                          <p className="font-bold text-zinc-800 truncate max-w-[200px]">{client.name}</p>
                          <p className="text-[9px] text-zinc-400 truncate max-w-[150px] font-medium">{client.segment}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 font-mono shrink-0">
                        {/* Rating Termômetro Badge */}
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-extrabold border uppercase tracking-wider ${getStarColor(rating)}`}>
                          Nota {rating}/5
                        </span>
                        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest px-1.5 py-0.5 bg-zinc-100 rounded text-[9px]">
                          {client.ranking}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Secondary Footer */}
        <div className="px-6 py-4 border-t border-zinc-150 bg-zinc-50 flex items-center justify-between shrink-0">
          <p className="text-[9.5px] font-semibold text-zinc-400 tracking-wider">
            Sempre atualizado com o banco de responsabilidades offline.
          </p>

          <div className="flex gap-2">
            {onEditMemberClick && (
              <button
                onClick={() => {
                  onClose();
                  onEditMemberClick(member);
                }}
                className="px-3 py-1.5 text-xs font-bold text-zinc-700 bg-white border border-zinc-250 hover:bg-zinc-50 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Edit2 size={12} /> Editar Cadastro
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-xs font-bold text-white rounded-lg cursor-pointer transition-all shadow-xs"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
