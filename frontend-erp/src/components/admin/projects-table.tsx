
import React, { useState } from 'react';
import { Edit2, Trash2, Calendar, CheckCircle, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import EditProjectModal from './edit-project-modal';
import DeleteConfirmationModal from './delete-confirmation-modal';
import Loader from '@/components/loader';
import { getImageUrl } from '@/utils/image-utils';
import { toast } from 'sonner';

interface Project {
    id: number;
    title: string;
    client: string;
    description: string;
    completion_date: string;
    status: string;
    thumbnail_path?: string;
}

interface ProjectsTableProps {
    projects: Project[];
    onRefresh: () => void;
    isLoading?: boolean;
}

export default function ProjectsTable({ projects, onRefresh, isLoading }: ProjectsTableProps) {
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

    const openDeleteModal = (project: Project) => {
        setProjectToDelete(project);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!projectToDelete) return;

        try {
            setDeletingId(projectToDelete.id);
            await api.delete(`/api/projects/${projectToDelete.id}`);
            toast.success('Project deleted successfully');
            setDeleteModalOpen(false);
            onRefresh();
        } catch (error) {
            console.error('Failed to delete project', error);
            toast.error('Failed to delete project. You might not have permission.');
        } finally {
            setDeletingId(null);
            setProjectToDelete(null);
        }
    };

    return (
        <>
            <div className="bg-white/40 backdrop-blur-md border border-white/80 rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)]">
                <div className="p-4 sm:px-6 border-b border-neutral-200/70 bg-white/40">
                    <h3 className="font-bold text-neutral-800 text-sm">Existing Projects</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="border-b border-neutral-200/70 bg-white/30">
                            <tr className="hover:bg-transparent">
                                <th className="px-6 py-3">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
                                        Project
                                    </span>
                                </th>
                                <th className="px-6 py-3">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-white/80 shadow-2xs">
                                        Client
                                    </span>
                                </th>
                                <th className="px-6 py-3">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FFF4E8] text-[#E0781E] border border-white/80 shadow-2xs">
                                        Status
                                    </span>
                                </th>
                                <th className="px-6 py-3">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F6FFD3] text-[#4D6300] border border-[#E9FF7A]/80 shadow-2xs">
                                        Date
                                    </span>
                                </th>
                                <th className="px-6 py-3 text-right">
                                    <div className="flex justify-end">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 border border-neutral-200/80 shadow-2xs">
                                            Actions
                                        </span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100/80">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <Loader variant="inline" size={80} text="Loading projects..." />
                                    </td>
                                </tr>
                            ) : projects.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center text-neutral-500 font-medium">
                                        No projects found. Add one above.
                                    </td>
                                </tr>
                            ) : (
                                projects.map((project) => (
                                    <tr key={project.id} className="hover:bg-white/50 transition-colors border-b border-neutral-100/70">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-11 w-11 rounded-xl bg-white border border-white/80 shadow-2xs overflow-hidden shrink-0 flex items-center justify-center">
                                                    {project.thumbnail_path ? (
                                                        <img
                                                            src={getImageUrl(project.thumbnail_path, '')}
                                                            alt={project.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <Folder className="h-5 w-5 text-neutral-400" />
                                                    )}
                                                </div>
                                                <span className="font-bold text-neutral-900 text-sm">{project.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-700 font-medium">
                                            {project.client || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold shadow-2xs border ${
                                                (project.status || '').toLowerCase() === 'completed'
                                                    ? 'bg-[#DCFCE7] text-[#15803D] border-green-200/80'
                                                    : (project.status || '').toLowerCase() === 'in progress'
                                                    ? 'bg-[#E0F2FE] text-[#0284C7] border-sky-200/80'
                                                    : (project.status || '').toLowerCase() === 'maintenance'
                                                    ? 'bg-[#FFF4E8] text-[#E0781E] border-amber-200/80'
                                                    : 'bg-neutral-100 text-neutral-700 border-neutral-200/80'
                                            }`}>
                                                {(project.status || '').toLowerCase() === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-600 font-medium text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                                                {project.completion_date || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 rounded-xl bg-white/80 hover:bg-white text-neutral-700 hover:text-neutral-950 border border-neutral-200/70 shadow-2xs transition-all cursor-pointer hover:scale-[1.05] active:scale-[0.95]"
                                                    onClick={() => setEditingProject(project)}
                                                >
                                                    <Edit2 className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 rounded-xl bg-white/80 hover:bg-rose-50 text-neutral-400 hover:text-rose-600 border border-neutral-200/70 shadow-2xs transition-all cursor-pointer hover:scale-[1.05] active:scale-[0.95]"
                                                    onClick={() => openDeleteModal(project)}
                                                    disabled={deletingId === project.id}
                                                >
                                                    {deletingId === project.id ? (
                                                        <div className="w-3 h-3 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    )}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <EditProjectModal
                isOpen={!!editingProject}
                onClose={() => setEditingProject(null)}
                project={editingProject}
                onSuccess={onRefresh}
            />

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                itemName={projectToDelete?.title || ''}
                itemType="Project"
                isDeleting={!!deletingId}
            />
        </>
    );
}
