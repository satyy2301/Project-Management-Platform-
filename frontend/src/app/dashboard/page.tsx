'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { apiCall } from '@/lib/api';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  description: string;
  projectUsers: Array<{ role: string; user_id: string }>;
}

type FilterType = 'all' | 'created' | 'assigned';

export default function Dashboard() {
  const router = useRouter();
  const { token, user, logout } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchProjects = async () => {
      try {
        const data = await apiCall('/projects', { method: 'GET' });
        // Filter projects: admins see all, members only see assigned projects
        const filteredProjects = user?.role === 'admin' 
          ? data 
          : data.filter((p: Project) => 
              p.projectUsers?.some((pu: any) => pu.user_id === user?.id)
            );
        setProjects(filteredProjects);
      } catch (err: any) {
        setError(err.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token, router, user]);

  const getFilteredProjects = () => {
    switch (filter) {
      case 'created':
        return projects.filter(p => 
          p.projectUsers?.some(pu => pu.user_id === user?.id && pu.role === 'owner')
        );
      case 'assigned':
        return projects.filter(p => 
          p.projectUsers?.some(pu => pu.user_id === user?.id && pu.role !== 'owner')
        );
      default:
        return projects;
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await apiCall('/projects', {
        method: 'POST',
        body: newProject,
      });
      setProjects([...projects, data]);
      setNewProject({ name: '', description: '' });
      setShowCreateForm(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create project. You may not have permission.');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    setError('');
    try {
      await apiCall(`/projects/${projectId}`, { method: 'DELETE' });
      setProjects(projects.filter((p) => p.id !== projectId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete project. Only project owners and admins can delete projects.');
    }
  };

  const canCreateProject = () => {
    return user?.role === 'admin' || user?.role === 'member';
  };

  const canDeleteProject = (project: Project) => {
    return user?.role === 'admin' || 
           project.projectUsers?.some(pu => pu.user_id === user?.id && pu.role === 'owner');
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg text-slate-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  const filteredProjects = getFilteredProjects();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-700 shadow-xl">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white">Projects</h1>
            <p className="text-slate-400 text-sm mt-1">Manage your team's projects</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-slate-400">Logged in as</p>
              <p className="font-medium text-white">{user?.email}</p>
            </div>
            {user?.role === 'admin' && (
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Admin
              </span>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="rounded-lg bg-red-950 border border-red-900 p-4 mb-6">
            <p className="text-red-200">{error}</p>
            <button
              onClick={() => setError('')}
              className="mt-2 text-sm text-red-300 hover:text-red-100 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Filter and Create Section */}
        <div className="flex justify-between items-center mb-8 flex-col sm:flex-row gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter('created')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'created'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Created by Me
            </button>
            <button
              onClick={() => setFilter('assigned')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'assigned'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Assigned to Me
            </button>
          </div>

          {canCreateProject() && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              + New Project
            </button>
          )}
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg mb-8 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2 font-medium">Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2 font-medium">Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project description (optional)"
                  rows={3}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Create Project
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewProject({ name: '', description: '' });
                  }}
                  className="px-6 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-slate-400 text-lg">
              {user?.role === 'admin' 
                ? 'No projects yet. Create one to get started!' 
                : filter === 'created'
                ? 'You haven\'t created any projects yet.'
                : filter === 'assigned'
                ? 'You haven\'t been assigned to any projects yet.'
                : 'No projects found. Contact an admin to be added to a project.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-slate-800 border border-slate-700 p-6 rounded-lg hover:border-blue-500 transition-all hover:shadow-2xl group">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">{project.name}</h3>
                <p className="text-slate-400 mb-4 min-h-12">{project.description || 'No description'}</p>
                <div className="mb-4 p-3 bg-slate-700 rounded-lg">
                  <p className="text-sm text-slate-300">
                    👥 <span className="font-medium">{project.projectUsers?.length || 0}</span> assigned
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex-1 px-3 py-2 text-sm text-center font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    View
                  </Link>
                  {canDeleteProject(project) && (
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="flex-1 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
