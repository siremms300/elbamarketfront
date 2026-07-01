'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Package } from 'lucide-react';

export default function WarehouseInventoryPage() {
  const { token, user } = useAuth();
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [warehouseName, setWarehouseName] = useState('');

  useEffect(() => {
    if (token && user) fetchInventory();
  }, [token, user]);

  const fetchInventory = async () => {
    try {
      // Get the operator's assigned warehouse from their user profile
      const warehouseId = user?.warehouseOperatorProfile?._id;

      if (!warehouseId) {
        // Fallback: fetch first active warehouse
        const whRes = await fetch('http://localhost:5000/api/warehouses?status=active&limit=1', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const whData = await whRes.json();
        if (whData.success && whData.data.length > 0) {
          setWarehouseName(whData.data[0].name);
          fetchWarehouseInventory(whData.data[0]._id);
        } else {
          setLoading(false);
        }
        return;
      }

      // Use the operator's assigned warehouse
      setWarehouseName(user?.warehouseOperatorProfile?.name || 'Warehouse');
      fetchWarehouseInventory(warehouseId);
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
    }
  };

  const fetchWarehouseInventory = async (warehouseId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/warehouses/${warehouseId}/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setInventory(data.data);
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-elba-primary">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">
            {warehouseName && `${warehouseName} · `}{inventory.length} items in storage
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : inventory.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
          <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No inventory yet</p>
          <p className="text-sm text-gray-400 mt-1">Items will appear here after receiving goods through the queue</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase">Commodity</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase">Grade</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase">Available</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase">Owner</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {inventory.map((item: any) => (
                  <tr key={item._id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-elba-surface flex items-center justify-center text-lg flex-shrink-0">
                          📦
                        </div>
                        <span className="text-sm font-semibold text-elba-primary">{item.commodityName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm">{item.grade || '—'}</td>
                    <td className="px-5 py-4 text-sm">
                      <span className="font-medium">{item.quantityAvailable?.toLocaleString()}</span>
                      <span className="text-gray-500 ml-1">{item.quantityReceived?.unit}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{item.owner?.ownerName || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        item.status === 'in_storage' ? 'bg-emerald-50 text-emerald-700' :
                        item.status === 'partially_released' ? 'bg-amber-50 text-amber-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {item.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500">
                      {new Date(item.storageStartDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}