import React, { useState, useEffect } from 'react';

import { DataTable as AdminTable } from '@/shared/components/ui/Tables/DataTable';

import Loader from '@/shared/components/Loader';
import { useSearchParams } from 'react-router-dom';
import Admin from '../model/admin';
import { adminService } from '../services';
import { columns } from './admin-table/Columns';

const AdministrationListing: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Initialize query parameters state

  const [filters, setFilters] = useState({
    page: '1',
    limit: '10',
    q: '',
  });

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    setFilters({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      q: searchParams.get('q') || '',
    });
  }, [searchParams]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const result = await adminService.getAllAdmins(filters);
        if (result.isLeft()) {
          console.error('Error in fetching admins');
        } else {
          const data = result.value.getValue();
          setAdmins(data.items);

          setTotalCount(data.totalCount);
        }
      } catch (error) {
        console.error('Error fetching admins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [filters]); // Fetch admins whenever filters change

  return (
    <AdminTable
      loading={loading}
      columns={columns}
      data={admins}
      totalItems={totalCount}
    />
  );
};

export default AdministrationListing;
