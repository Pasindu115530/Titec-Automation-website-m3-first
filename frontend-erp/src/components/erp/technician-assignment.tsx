import React, { useState, useEffect } from 'react';
import { installationService } from '@/services/installationService';
import { userService } from '@/services/userService';
import { toast } from 'sonner';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const getAvatarGradient = (name: string) => {
    const gradients = [
        'from-sky-500 to-indigo-600',
        'from-purple-500 to-indigo-600',
        'from-teal-500 to-emerald-600',
        'from-amber-500 to-orange-600',
        'from-rose-500 to-pink-600',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
};

interface TechnicianAssignmentProps {
    installationId: number;
    currentTechnicians: { id: number; name: string }[];
    onAssignmentSuccess: () => void;
}

export default function TechnicianAssignment({ installationId, currentTechnicians, onAssignmentSuccess }: TechnicianAssignmentProps) {
    const [availableTechs, setAvailableTechs] = useState<{id: number; name: string}[]>([]);
    const [selectedTechs, setSelectedTechs] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoadingTechs, setIsLoadingTechs] = useState(false);

    useEffect(() => {
        const fetchTechs = async () => {
            setIsLoadingTechs(true);
            try {
                const users = await userService.getUsers();
                setAvailableTechs(users.map(u => ({ id: u.id, name: `${u.name} ${u.employee?.designation ? `(${u.employee.designation})` : ''}` })));
            } catch (error) {
                toast.error('Failed to load available technicians.');
            } finally {
                setIsLoadingTechs(false);
            }
        };
        fetchTechs();
    }, []);

    useEffect(() => {
        setSelectedTechs(currentTechnicians.map(t => t.id));
    }, [currentTechnicians]);

    const handleToggleTech = (id: number) => {
        setSelectedTechs(prev => 
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        const toastId = toast.loading('Assigning technicians...');
        try {
            await installationService.assignTechnicians(installationId, selectedTechs);
            toast.success('Technicians assigned successfully', { id: toastId });
            setIsEditing(false);
            onAssignmentSuccess();
        } catch (error: any) {
            const msg = error?.response?.data?.message || 'Failed to assign technicians';
            toast.error(msg, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isEditing) {
        return (
            <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.04)] space-y-4">
                <div className="flex justify-between items-center border-b border-neutral-200/60 pb-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-white/80 shadow-2xs">
                        <Users className="w-3.5 h-3.5 mr-1" /> Assigned Technicians
                    </span>
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#E2D6FE] hover:bg-[#d8c7fd] text-neutral-900 border border-purple-200/60 shadow-2xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                        Edit
                    </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {currentTechnicians.length > 0 ? (
                        currentTechnicians.map(tech => (
                            <span key={tech.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/90 border border-neutral-200/80 text-neutral-800 shadow-2xs">
                                <span className={cn(
                                    "w-5 h-5 rounded-full bg-gradient-to-tr text-white flex items-center justify-center text-[10px] font-bold shrink-0 leading-none shadow-2xs",
                                    getAvatarGradient(tech.name)
                                )}>
                                    {tech.name.charAt(0).toUpperCase()}
                                </span>
                                <span>{tech.name}</span>
                            </span>
                        ))
                    ) : (
                        <div className="w-full text-center py-4 text-xs font-semibold text-neutral-400 bg-white/40 rounded-2xl border border-dashed border-neutral-200">
                            No technicians assigned yet.
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-white/80 shadow-2xs">
                    <Users className="w-3.5 h-3.5 mr-1" /> Assign Technicians
                </span>
            </div>
            
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto no-scrollbar pr-1">
                {isLoadingTechs ? (
                    <div className="text-xs font-semibold text-neutral-400 py-3 text-center">Loading technicians...</div>
                ) : availableTechs.length > 0 ? (
                    availableTechs.map(tech => (
                        <label key={tech.id} className="flex items-center gap-3 p-2.5 bg-white/70 hover:bg-white rounded-2xl cursor-pointer border border-white/80 shadow-2xs transition-all">
                            <input
                                type="checkbox"
                                checked={selectedTechs.includes(tech.id)}
                                onChange={() => handleToggleTech(tech.id)}
                                className="w-4 h-4 rounded text-sky-500 border-neutral-300 focus:ring-sky-300 accent-sky-400 cursor-pointer"
                            />
                            <span className="text-xs font-bold text-neutral-800">{tech.name}</span>
                        </label>
                    ))
                ) : (
                    <div className="text-xs font-semibold text-neutral-400 py-3 text-center">No technicians available.</div>
                )}
            </div>
            
            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200/60">
                <button
                    onClick={() => {
                        setSelectedTechs(currentTechnicians.map(t => t.id));
                        setIsEditing(false);
                    }}
                    className="px-3.5 py-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 bg-white/70 hover:bg-white rounded-xl border border-white/80 shadow-2xs transition-all cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-xs font-bold bg-sky-300 hover:bg-sky-400 text-neutral-950 rounded-xl shadow-[0_4px_14px_rgba(125,211,252,0.35)] border border-sky-200 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                    {isSubmitting ? 'Saving...' : 'Save Assignments'}
                </button>
            </div>
        </div>
    );
}
