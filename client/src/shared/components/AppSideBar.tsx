import { NavLink, useLocation } from 'react-router-dom';

import { LayoutDashboard, Settings, ShieldCheck } from 'lucide-react';
import { Sidebar } from './ui/sidebar';

const AppSideBar = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <Sidebar>
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <div className="flex gap-2">
            {/* <img src={Logo} alt="Logo" /> */}
            <span className="text-4xl font-semibold ">Dashboard</span>
          </div>
        </NavLink>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>
          </div>

          <ul className="mb-6 flex flex-col gap-1.5">
            <li>
              <NavLink
                to="dashboard"
                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                  pathname.includes('/dashboard') &&
                  'bg-graydark dark:bg-meta-4'
                }`}
              >
                <LayoutDashboard />
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink
                to="admins"
                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                  pathname.includes('/admins') && 'bg-graydark dark:bg-meta-4'
                }`}
              >
                <ShieldCheck />
                Administration
              </NavLink>
            </li>
          </ul>
          {/* <!-- Others Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              OTHERS
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Chart --> */}
              <li>
                <NavLink
                  to="settings"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('settings') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <Settings />
                  Settings
                </NavLink>
              </li>
              {/* <!-- Menu Item Chart --> */}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </Sidebar>
  );
};

export default AppSideBar;
