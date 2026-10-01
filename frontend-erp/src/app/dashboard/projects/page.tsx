'use client';

import React, { useState, useEffect } from 'react';
import { Upload, Save, X, Calendar, User, FolderPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600">Projects Management</h1>
                    <p className="text-gray-500 mt-1">Manage your portfolio of industrial automation projects.</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 btn-gradient-primary border-0">
                    <FolderPlus className="h-4 w-4" />
                    <span>Add New Project</span>
                </Button>
            </div>

            <AddProjectModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchProjects}
            />

            {/* Existing Projects Table */}
            <div className="mt-8">
                <ProjectsTable projects={projects} onRefresh={fetchProjects} isLoading={projectsLoading} />
            </div>
        </div>
    );
}

