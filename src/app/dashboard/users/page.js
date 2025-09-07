'use client';

import { CustomButton } from '@/components/ui/CustomButton';
import { Input } from '@/components/ui/Input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table';
import { useToast } from '@/components/ui/useToast';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function ManageUsers() {
    const { data: session } = useSession();
    const { toast } = useToast();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `/api/users?search=${encodeURIComponent(search)}`,
                { cache: 'no-store' },
            );
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast({
                title: 'Error',
                description: 'Failed to load users',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user?.role === 'admin') fetchUsers();
    }, [session, search]);

    const handleRoleChange = async (id, role) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ role }),
                },
            );
            if (!res.ok) throw new Error('Failed to update role');

            setUsers((prev) =>
                prev.map((u) => (u._id === id ? { ...u, role } : u)),
            );

            toast({ title: 'Success', description: 'Role updated' });
        } catch (error) {
            console.error('Error updating role:', error);
            toast({
                title: 'Error',
                description: 'Failed to update role',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete user');

            setUsers((prev) => prev.filter((u) => u._id !== id));

            toast({ title: 'Success', description: 'User deleted' });
        } catch (error) {
            console.error('Error deleting user:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete user',
                variant: 'destructive',
            });
        }
    };

    if (!session || session.user?.role !== 'admin') {
        return <div className="text-center p-6">Access Denied</div>;
    }

    if (loading) {
        return <div className="text-center p-6">Loading Users...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
            <div className="mb-4">
                <Input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-md"
                />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow className="text-gray-800" key={user._id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Select
                                    value={user.role}
                                    onValueChange={(value) =>
                                        handleRoleChange(user._id, value)
                                    }
                                >
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder={user.role} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">
                                            User
                                        </SelectItem>
                                        <SelectItem value="vendor">
                                            Vendor
                                        </SelectItem>
                                        <SelectItem value="admin">
                                            Admin
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <CustomButton
                                    onClick={() => handleDelete(user._id)}
                                    variant="destructive"
                                >
                                    Delete
                                </CustomButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
