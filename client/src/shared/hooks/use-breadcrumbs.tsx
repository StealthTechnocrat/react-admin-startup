import React from 'react';
import { Link, useLocation } from 'react-router-dom';

type BreadcrumbItem = {
  title: string;
  link: string;
};

const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [{ title: 'Dashboard', link: '/dashboard' }],
  '/dashboard/employee': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Employee', link: '/dashboard/employee' },
  ],
  '/dashboard/product': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Product', link: '/dashboard/product' },
  ],
};

export const useBreadcrumbs = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const breadcrumbs = React.useMemo(() => {
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path,
      };
    });
  }, [pathname]);

  return breadcrumbs;
};

export const Breadcrumbs: React.FC = () => {
  const breadcrumbs = useBreadcrumbs();

  return (
    <nav className="p-4 bg-gray-100 rounded">
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={index}>
          <Link to={breadcrumb.link} className="text-blue-500 hover:underline">
            {breadcrumb.title}
          </Link>
          {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
        </React.Fragment>
      ))}
    </nav>
  );
};
