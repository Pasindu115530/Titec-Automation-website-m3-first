import React from 'react';
import { Installation } from '@/services/installationService';

interface InstallationKanbanProps {
    installations: Installation[];
    loading: boolean;
    onStatusChange: (id: number, newStatus: string) => void;
    onViewDetail: (id: number) => void;
}

export default function InstallationKanban({
    installations,
    loading,
    onStatusChange,
    onViewDetail
}: InstallationKanbanProps) {
    if (loading) {
        return <div className="text-center py-10">Loading installations...</div>;
    }

    const columns = [
        { id: 'scheduled', title: 'Scheduled', color: 'bg-blue-50 border-blue-200 text-blue-700' },
        { id: 'in_progress', title: 'In Progress', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
        { id: 'on_hold', title: 'On Hold', color: 'bg-red-50 border-red-200 text-red-700' },
        { id: 'completed', title: 'Completed', color: 'bg-green-50 border-green-200 text-green-700' },
    ];

    const getInstallationsByStatus = (status: string) => {
        return installations.filter(inst => inst.status === status);
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4">
            {columns.map(column => (
                <div key={column.id} className="flex-1 min-w-[280px] bg-gray-50 rounded-lg p-3 border border-gray-200 flex flex-col max-h-[80vh]">
                    <div className="flex justify-between items-center mb-3 px-1">
                        <h3 className="font-semibold text-gray-700">{column.title}</h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${column.color} border`}>
                            {getInstallationsByStatus(column.id).length}
                        </span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                        {getInstallationsByStatus(column.id).map(inst => (
                            <div 
                                key={inst.id} 
                                className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
                                onClick={() => onViewDetail(inst.id)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-medium text-gray-900 truncate pr-2" title={inst.title}>
                                        {inst.title}
                                    </div>
                                    <span className={`shrink-0 inline-block w-2.5 h-2.5 rounded-full mt-1.5
                                        ${inst.priority === 'urgent' ? 'bg-red-600' :
                                          inst.priority === 'high' ? 'bg-orange-500' :
                                          inst.priority === 'medium' ? 'bg-yellow-400' : 'bg-gray-300'}`}
                                        title={`Priority: ${inst.priority}`}
                                    />
                                </div>
                                
                                {inst.client && (
                                    <div className="text-sm text-gray-600 mb-2 truncate">
                                        {inst.client.company_name || inst.client.contact_name}
                                    </div>
                                )}
                                
                                <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    {inst.scheduled_date ? new Date(inst.scheduled_date).toLocaleDateString() : 'Unscheduled'}
                                </div>
                                
                                <div className="border-t border-gray-100 pt-2 flex justify-between items-center mt-2">
                                    <div className="flex -space-x-2 overflow-hidden">
                                        {inst.technicians && inst.technicians.length > 0 ? (
                                            inst.technicians.map((tech, i) => (
                                                <div 
                                                    key={tech.id} 
                                                    className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-blue-100 text-blue-800 flex items-center justify-center text-[10px] font-bold"
                                                    title={tech.name}
                                                    style={{ zIndex: 10 - i }}
                                                >
                                                    {tech.name.charAt(0).toUpperCase()}
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400">Unassigned</span>
                                        )}
                                    </div>
                                    
                                    <select
                                        className="text-xs border border-gray-200 rounded p-1 bg-gray-50 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                                        value={inst.status}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            onStatusChange(inst.id, e.target.value);
                                        }}
                                    >
                                        <option value="scheduled">Scheduled</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="on_hold">On Hold</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                        
                        {getInstallationsByStatus(column.id).length === 0 && (
                            <div className="text-center py-6 text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                                No installations
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
