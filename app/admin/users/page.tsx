'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Search,
  User,
  Mail,
  Phone,
  Shield,
  Warehouse,
  X,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { API_URL } from '@/lib/api';


interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  verificationTier: string;
  isActive: boolean;
  warehouseOperatorProfile?: any;
  farmerProfile?: any;
}

interface Warehouse {
  _id: string;
  name: string;
  code: string;
  location: { state: string };
}

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

//   useEffect(() => {
//     if (token) {
//       fetchUsers();
//       fetchWarehouses();
//     }
//   }, [token]);






useEffect(() => {
  if (token) {
    fetchUsers();
    fetchWarehouses();
  }
}, [token, roleFilter, search]);






//   const fetchUsers = async () => {
//     try {
//       const params = new URLSearchParams();
//       if (roleFilter) params.append('role', roleFilter);
//       if (search) params.append('search', search);
//       params.append('limit', '50');

//       const res = await fetch(`${API_URL}/farmers?${params.toString()}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       // Since we don't have a dedicated users endpoint, let's use the auth/me approach
//       // Actually, we need a proper admin users endpoint. For now, fetch farmers as a proxy.
//       // Let me create a proper endpoint instead.
      
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       setLoading(false);
//     }
//   };







const fetchUsers = async () => {
  setLoading(true);
  try {
    const params = new URLSearchParams();
    if (roleFilter) params.append('role', roleFilter);
    if (search) params.append('search', search);
    params.append('limit', '50');

    const res = await fetch(`${API_URL}/users?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) {
      setUsers(data.data);
    }
  } catch (err) {
    console.error('Error fetching users:', err);
  } finally {
    setLoading(false);
  }
};





  const fetchWarehouses = async () => {
    try {
      const res = await fetch('${API_URL}/warehouses?limit=100', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setWarehouses(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignWarehouse = async () => {
    if (!selectedUser || !selectedWarehouse) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/${selectedUser._id}/assign-warehouse`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ warehouseId: selectedWarehouse }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Warehouse assigned successfully');
        setShowAssignModal(false);
        fetchUsers();
      } else {
        setMessage(data.message);
      }
    } catch {
      setMessage('Network error');
    } finally {
      setActionLoading(false);
    }
  };

  const openAssignModal = (user: UserData) => {
    setSelectedUser(user);
    setSelectedWarehouse(user.warehouseOperatorProfile?._id || '');
    setShowAssignModal(true);
    setMessage('');
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, string> = {
      admin: 'bg-purple-50 text-purple-700',
      super_admin: 'bg-purple-50 text-purple-700',
      warehouse_operator: 'bg-blue-50 text-blue-700',
      farmer: 'bg-amber-50 text-amber-700',
      buyer: 'bg-emerald-50 text-emerald-700',
      logistics_partner: 'bg-cyan-50 text-cyan-700',
    };
    return badges[role] || 'bg-gray-50 text-gray-600';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-elba-primary">Users</h1>
          <p className="text-sm text-gray-500 mt-1">Manage platform users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20"
        >
          <option value="">All Roles</option>
          <option value="warehouse_operator">Warehouse Operators</option>
          <option value="farmer">Farmers</option>
          <option value="buyer">Buyers</option>
          <option value="logistics_partner">Logistics Partners</option>
        </select>
      </div>

      {message && (
        <div className={`mb-4 rounded-2xl p-4 flex items-center gap-3 text-sm ${
          message.includes('success') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
        }`}>
          {message.includes('success') ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase">User</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase">Role</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase">Contact</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase">Warehouse</th>
                <th className="text-right px-5 py-3.5 text-xs font-bold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-elba-primary text-white flex items-center justify-center text-sm font-bold">
                        {user.firstName?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-elba-primary">{user.firstName} {user.lastName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${getRoleBadge(user.role)}`}>
                      {user.role?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-xs text-gray-500">
                      <div className="flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</div>
                      {user.phone && <div className="flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" /> {user.phone}</div>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium ${user.isActive ? 'text-emerald-600' : 'text-red-500'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500">
                    {user.warehouseOperatorProfile?.name || '—'}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {user.role === 'warehouse_operator' && (
                      <button
                        onClick={() => openAssignModal(user)}
                        className="text-xs font-medium text-elba-secondary hover:text-elba-secondary-light flex items-center gap-1"
                      >
                        <Warehouse className="w-3.5 h-3.5" />
                        {user.warehouseOperatorProfile ? 'Change' : 'Assign'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Warehouse Modal */}
      {showAssignModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAssignModal(false)} />
          <div className="relative bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-elba-primary">Assign Warehouse</h3>
              <button onClick={() => setShowAssignModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Assign a warehouse to <span className="font-semibold text-elba-primary">{selectedUser.firstName} {selectedUser.lastName}</span>
            </p>
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-elba-secondary/20 mb-4"
            >
              <option value="">Select warehouse...</option>
              {warehouses.map((wh) => (
                <option key={wh._id} value={wh._id}>{wh.name} — {wh.location?.state}</option>
              ))}
            </select>
            <button
              onClick={handleAssignWarehouse}
              disabled={actionLoading || !selectedWarehouse}
              className="btn-elba-primary w-full py-3 text-sm font-semibold rounded-xl disabled:opacity-50"
            >
              {actionLoading ? 'Assigning...' : 'Assign Warehouse'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}