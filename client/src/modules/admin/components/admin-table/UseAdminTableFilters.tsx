import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom'; // For query params in React Router

export function useAdminTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // States for filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [categoriesFilter, setCategoriesFilter] = useState(
    searchParams.get('categories') || '',
  );
  const [page, setPage] = useState(searchParams.get('page') || '1');

  // Update search params whenever state changes
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set('q', searchQuery);
    if (categoriesFilter) params.set('categories', categoriesFilter);
    if (page) params.set('page', page);

    setSearchParams(params);
  }, [searchQuery, categoriesFilter, page, setSearchParams]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setCategoriesFilter('');
    setPage('1');
  }, []);

  // Check if any filter is active
  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!categoriesFilter;
  }, [searchQuery, categoriesFilter]);

  return {
    searchQuery,
    setSearchQuery,
    categoriesFilter,
    setCategoriesFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
  };
}
