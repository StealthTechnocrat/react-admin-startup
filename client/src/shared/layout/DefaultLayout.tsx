import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '../components/ui/sidebar';
import AppSideBar from '../components/AppSideBar';
import AppHeader from '../components/AppHeader';

const DefaultLayout: React.FC = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className=" w-full flex overflow-hidden">
        {/* Sidebar Section */}
        <AppSideBar />

        {/* Content Section */}
        <div className="flex flex-col w-full">
          {/* Header Section */}
          <AppHeader />

          {/* Main Content */}
          <main className="flex-grow p-4 md:p-6 :p-10  ">
            <div className="mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DefaultLayout;
