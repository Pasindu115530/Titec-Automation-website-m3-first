'use client';

import React, { useState, useEffect } from 'react';
import { FolderPlus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import ProjectsTable from '@/components/admin/projects-table';
import { toast } from 'sonner';
import AddProjectModal from '@/components/admin/add-project-modal';

interface Project {
    id: number;
    title: string;
    client: string;
    description: string;
    completion_date: string;
    status: string;
    thumbnail_path?: string;
}

export default function ProjectsPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchProjects = async () => {
        setProjectsLoading(true);
        try {
            const response = await api.get('/api/projects');
            setProjects(response.data.data);
        } catch (error) {
            console.error('Failed to fetch projects', error);
            toast.error('Failed to fetch projects');
        } finally {
            setProjectsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(p => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            p.title?.toLowerCase().includes(q) ||
            p.client?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.status?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">Projects Management</h1>
                    <p className="text-neutral-500 mt-1 text-sm font-medium">Manage your portfolio of industrial automation projects.</p>
                </div>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-sky-300 hover:bg-sky-400 text-neutral-950 font-bold rounded-2xl shadow-[0_8px_20px_rgba(125,211,252,0.35)] border border-sky-200 px-5 h-11 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-2 cursor-pointer text-sm"
                >
                    <FolderPlus className="h-4 w-4 stroke-[2.5]" />
                    <span>Add New Project</span>
                </Button>
            </div>

            <AddProjectModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchProjects}
            />

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white/40 backdrop-blur-md p-2.5 sm:p-3 rounded-[32px] border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                    <div className="flex items-center gap-2 pl-3">
                        <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-white/80 shadow-2xs">
                            <FolderPlus className="w-3.5 h-3.5 mr-1.5 text-[#7C3AED]" />
                            Project Portfolio
                        </span>
                    </div>
                    <div className="relative w-full sm:w-72 flex items-center">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input
                            placeholder="Search projects..."
                            className="w-full pl-10 h-11 bg-white hover:bg-white focus:bg-white border-white focus:border-white text-neutral-900 placeholder:text-neutral-400 rounded-2xl shadow-2xs focus-visible:ring-2 focus-visible:ring-neutral-200/60 focus-visible:ring-offset-0 focus:outline-none transition-all text-sm font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <ProjectsTable projects={filteredProjects} onRefresh={fetchProjects} isLoading={projectsLoading} />
            </div>
        </div>
    );
}

