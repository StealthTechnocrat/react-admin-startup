'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './CellAction';
import Admin from '../../model/admin';

export const columns: ColumnDef<Admin>[] = [
  {
    id: 'serialNumber', // Unique identifier for the serial column
    header: 'S.No.',
    cell: ({ row }) => row.index + 1, // Dynamically calculate serial number based on row index
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'isActive',
    header: 'Active',
  },
  {
    accessorKey: 'isBlocked',
    header: 'Blocked',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    id: 'actions',
    header: 'Operations',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
