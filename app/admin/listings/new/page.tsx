'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ListingForm from '@/components/listings/ListingForm';

export default function AdminNewListingPage() {
  const { user, token, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/login');
    }
  }, [loading, isAdmin, router]);

  useEffect(() => {
    if (token && isAdmin) {
      fetch('http://localhost:5000/api/warehouses?status=active&limit=100', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) setWarehouses(data.data);
        })
        .catch(console.error);
    }
  }, [token, isAdmin]);

  if (loading || !isAdmin) return null;

  return (
    <ListingForm
      userRole={user?.role || 'admin'}
      token={token || ''}
      backUrl="/admin/listings"
      successUrl="/admin/listings"
      warehouses={warehouses}
    />
  );
}