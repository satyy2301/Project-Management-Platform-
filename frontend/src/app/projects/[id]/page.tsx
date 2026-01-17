'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { apiCall } from '@/lib/api';

interface ProjectUser {
  id: string;
  user_id: string;
  role: string;
  user?: {
    email: string;
  };
}

interface Project {
  id: string;
  name: string;
  description: string;
  projectUsers: ProjectUser[];
}

export default function ProjectDetails() {
  const router = useRouter();
  const params = useParams();
  const { token, user } = useAuthStore();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('viewer');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editRole, setEditRole] = useState('');

  const projectId = params.id as string;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    fetchProject();
  }, [token, projectId, router]);

  const fetchProject = async () => {
    try {
      const projectData = await apiCall(`/projects/${projectId}`, { method: 'GET' });
      setProject(projectData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch project');
    } finally {
      setLoading(false);
    }
  };

  const canManageUsers = () => {
    if (!project || !user) return false;
    return user.role === 'admin' || 
           project.projectUsers?.some(pu => pu.user_id === user.id && pu.role === 'owner');
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail) return;
    
    setError('');
    setSuccess('');

    try {
      const userData = await apiCall(`/users/by-email/${encodeURIComponent(newUserEmail)}`, {
        method: 'GET',
      });

      await apiCall(`/projects/${projectId}/users`, {
        method: 'POST',
        body: {
          user_id: userData.id,
          role: newUserRole,
        },
      });

      setSuccess(`User ${newUserEmail} added successfully!`);
      await fetchProject();
      setShowAddUser(false);
      setNewUserEmail('');
      setNewUserRole('viewer');
    } catch (err: any) {
      setError(err.message || 'Failed to add user. Make sure the email exists.');
    }
  };

  const handleUpdateRole = async (userId: string) => {
    setError('');
    setSuccess('');
    try {
      await apiCall(`/projects/${projectId}/users/${userId}`, {
        method: 'PUT',
        body: { role: editRole },
      });

      setSuccess('Member role updated successfully!');
      await fetchProject();
      setEditingUser(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update role. Only project owners and admins can edit member roles.');
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    
    setError('');
    setSuccess('');
    try {
      await apiCall(`/projects/${projectId}/users/${userId}`, {
        method: 'DELETE',
      });

      setSuccess('Member removed successfully!');
      await fetchProject();
    } catch (err: any) {
      setError(err.message || 'Failed to remove member. Only project owners and admins can remove members.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg text-slate-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-xl text-red-400">Project not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-950 border-b border-slate-700">
        <div className="max-w-4xl mx-auto py-6 px-4">
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 text-sm font-medium mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white">{project.name}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4">
        {error && (
          <div className="bg-red-950 border border-red-900 p-4 rounded-lg mb-6">
            <p className="text-red-200">{error}</p>
            <button onClick={() => setError('')} className="mt-2 text-sm text-red-300 hover:text-red-100 underline">Dismiss</button>
          </div>
        )}

        {success && (
          <div className="bg-green-950 border border-green-900 p-4 rounded-lg mb-6">
            <p className="text-green-200">{success}</p>
            <button onClick={() => setSuccess('')} className="mt-2 text-sm text-green-300 hover:text-green-100 underline">Dismiss</button>
          </div>
        )}

        <div className="bg-slate-800 border border-slate-700 p-8 rounded-lg shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">📋 Project Details</h2>
          <p className="text-slate-300 text-lg">{project.description || 'No description provided'}</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-8 rounded-lg shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">👥 Team Members</h2>
              <p className="text-slate-400 text-sm mt-1">{project.projectUsers?.length || 0} members</p>
            </div>
            {canManageUsers() && (
              <button onClick={() => setShowAddUser(!showAddUser)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                + Add Member
              </button>
            )}
          </div>

          {!canManageUsers() && (
            <div className="bg-amber-950 border border-amber-900 p-4 rounded-lg mb-6">
              <p className="text-amber-200 text-sm">ℹ️ Only project owners and admins can manage team members.</p>
            </div>
          )}

          {showAddUser && canManageUsers() && (
            <form onSubmit={handleAddUser} className="mb-8 p-6 bg-slate-700 border border-slate-600 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-4">Add Team Member</h3>
              <div className="mb-4">
                <label className="block text-slate-300 mb-2 font-medium">User Email</label>
                <input type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} placeholder="user@example.com" className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="mb-6">
                <label className="block text-slate-300 mb-2 font-medium">Role</label>
                <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white">
                  <option value="viewer">👁️ Viewer</option>
                  <option value="developer">⚙️ Developer</option>
                  <option value="owner">👑 Owner</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Add Member</button>
                <button type="button" onClick={() => {setShowAddUser(false); setNewUserEmail('');}} className="px-6 py-2 bg-slate-600 text-slate-300 rounded-lg hover:bg-slate-500 font-medium">Cancel</button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {project.projectUsers && project.projectUsers.length > 0 ? (
              project.projectUsers.map((pu) => (
                <div key={pu.id} className="flex items-center justify-between p-4 bg-slate-700 border border-slate-600 rounded-lg hover:border-blue-500">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {(pu.user?.email || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{pu.user?.email || 'Unknown'}</p>
                        {editingUser === pu.user_id ? (
                          <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="mt-2 px-3 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm">
                            <option value="viewer">Viewer</option>
                            <option value="developer">Developer</option>
                            <option value="owner">Owner</option>
                          </select>
                        ) : (
                          <p className="text-sm text-slate-400">
                            {pu.role === 'owner' && '👑 Owner'} 
                            {pu.role === 'developer' && '⚙️ Developer'} 
                            {pu.role === 'viewer' && '👁️ Viewer'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {canManageUsers() && (
                    <div className="flex space-x-2 ml-4">
                      {editingUser === pu.user_id ? (
                        <>
                          <button onClick={() => handleUpdateRole(pu.user_id)} className="px-4 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 font-medium">Save</button>
                          <button onClick={() => setEditingUser(null)} className="px-4 py-1 bg-slate-600 text-slate-300 rounded text-sm hover:bg-slate-500 font-medium">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => {setEditingUser(pu.user_id); setEditRole(pu.role);}} className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 font-medium">Edit</button>
                          <button onClick={() => handleRemoveUser(pu.user_id)} className="px-4 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 font-medium">Remove</button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400">No members assigned yet</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
