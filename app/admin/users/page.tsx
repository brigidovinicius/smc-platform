'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Shield, Ban } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  profile: {
    role: string;
  } | null;
  _count: {
    newAssets: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      
      const response = await fetch(`/api/admin/users?${params.toString()}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        // A API retorna { items, pagination }
        setUsers(result.data.items || result.data.users || []);
      } else {
        console.error('Error loading users:', result.error);
        setUsers([]);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Tem certeza que deseja alterar o role deste usuário para ${newRole}?`)) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: newRole }),
      });

      const result = await response.json();
      if (result.success) {
        loadUsers();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Failed to change role:', error);
      alert('Erro ao alterar role');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie usuários, roles e permissões
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar usuários por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Nenhum usuário encontrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold">Nome</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Assets</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const role = user.profile?.role || 'USER';
                    const isAdmin = role === 'ADMIN';
                    
                    return (
                      <tr key={user.id} className="border-b hover:bg-accent">
                        <td className="py-3 px-4">
                          {user.name || '-'}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {user.email}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={isAdmin ? 'default' : 'outline'}>
                            {role}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {user._count.newAssets}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <select
                              value={role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              className="px-2 py-1 border rounded text-sm"
                            >
                              <option value="USER">USER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <Link href={`/dashboard?impersonateUserId=${user.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

