import React, { useState, useEffect } from 'react';
import { installationService } from '@/services/installationService';
import { toast } from 'sonner';

interface TechnicianAssignmentProps {
    installationId: number;
    currentTechnicians: { id: number; name: string }[];
    onAssignmentSuccess: () => void;
}

export default function TechnicianAssignment({ installationId, currentTechnicians, onAssignmentSuccess }: TechnicianAssignmentProps) {
    // In a real app, you'd fetch available technicians from user service
    // where role = 'Technician'
    // For MVP, we'll mock a few or assume we pass them if they are fetched from an API
    const [availableTechs, setAvailableTechs] = useState<{id: number; name: string}[]>([
        { id: 2, name: 'John Doe (Tech)' },
        { id: 3, name: 'Jane Smith (Tech)' },
        { id: 4, name: 'Mike Ross (Tech)' }
    ]);
    
    const [selectedTechs, setSelectedTechs] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

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
        } catch (error) {
            toast.error('Failed to assign technicians', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isEditing) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-900">Assigned Technicians</h3>
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        Edit
                    </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {currentTechnicians.length > 0 ? (
                        currentTechnicians.map(tech => (
                            <span key={tech.id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                {tech.name}
                            </span>
                        ))
                    ) : (
                        <span className="text-sm text-gray-500 italic">No technicians assigned yet.</span>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 relative">
            <h3 className="font-semibold text-gray-900 mb-3">Assign Technicians</h3>
            
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {availableTechs.map(tech => (
                    <label key={tech.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer border border-transparent hover:border-gray-100">
                        <input
                            type="checkbox"
                            checked={selectedTechs.includes(tech.id)}
                            onChange={() => handleToggleTech(tech.id)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-800">{tech.name}</span>
                    </label>
                ))}
            </div>
            
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                    onClick={() => {
                        setSelectedTechs(currentTechnicians.map(t => t.id));
                        setIsEditing(false);
                    }}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : 'Save Assignments'}
                </button>
            </div>
        </div>
    );
}
