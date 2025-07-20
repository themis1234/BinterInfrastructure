import React, { useEffect, useState } from 'react';
import { Search, Filter, Edit, Trash2, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { getUsers } from '../utils/api';
interface User {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

// // Mock data for demonstration
// const mockUsers: User[] = [
//     { email: 'john.doe@example.com', firstName: 'John', lastName: 'Doe', role: 'admin' },
//     { email: 'jane.smith@example.com', firstName: 'Jane', lastName: 'Smith', role: 'user' },
//     { email: 'bob.johnson@example.com', firstName: 'Bob', lastName: 'Johnson', role: 'moderator' },
//     { email: 'alice.brown@example.com', firstName: 'Alice', lastName: 'Brown', role: 'user' },
//     { email: 'charlie.wilson@example.com', firstName: 'Charlie', lastName: 'Wilson', role: 'admin' },
//     { email: 'diana.martinez@example.com', firstName: 'Diana', lastName: 'Martinez', role: 'user' },
//     { email: 'edward.garcia@example.com', firstName: 'Edward', lastName: 'Garcia', role: 'moderator' },
//     { email: 'fiona.lee@example.com', firstName: 'Fiona', lastName: 'Lee', role: 'user' },
// ];

type SortField = keyof User;
type SortDirection = 'asc' | 'desc';

export default function UsersTableScreen() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [sortField, setSortField] = useState<SortField>('lastName');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    useEffect(() => {
    const fetchUsers = async () => {
      const result = await getUsers();
      
      if ('user' in result) {
        console.log(result.user)
        setUsers(result.user);
      } else {
        console.log("Unhandled error")
      }
    };

    fetchUsers();
  }, []);
    // Filter and sort users
    const filteredAndSortedUsers = users
        .filter(user => {
            const matchesSearch =
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRole = roleFilter === 'all' || user.role === roleFilter;

            return matchesSearch && matchesRole;
        })
        .sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (sortDirection === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'moderator': return 'bg-yellow-100 text-yellow-800';
            case 'user': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <ChevronUp className="w-4 h-4 opacity-30" />;
        return sortDirection === 'asc' ?
            <ChevronUp className="w-4 h-4 text-blue-600" /> :
            <ChevronDown className="w-4 h-4 text-blue-600" />;
    };

    return (
        <div className="flex-1 p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
                    <p className="text-gray-600">Manage user accounts and permissions</p>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Role Filter */}
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="admin">Admin</option>
                                    <option value="moderator">Moderator</option>
                                    <option value="user">User</option>
                                </select>
                            </div>
                        </div>

                        {/* Add User Button */}
                        <button className="flex items-center gap-2 bg-[#840027] text-white px-4 py-2 rounded-md hover:bg-[#6c0020] transition-colors">
                            <Plus className="w-4 h-4" />
                            Add User
                        </button>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4">
                    <p className="text-sm text-gray-600">
                        Showing {filteredAndSortedUsers.length} of {users.length} users
                    </p>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('firstName')}
                                    >
                                        <div className="flex items-center gap-1">
                                            First Name
                                            <SortIcon field="firstName" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('lastName')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Last Name
                                            <SortIcon field="lastName" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('email')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Email
                                            <SortIcon field="email" />
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('role')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Role
                                            <SortIcon field="role" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAndSortedUsers.map((user, index) => (
                                    <tr key={user.email} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {user.firstName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {user.lastName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Empty State */}
                {filteredAndSortedUsers.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <Search className="w-12 h-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
}