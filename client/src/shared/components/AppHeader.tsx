import { SidebarTrigger } from './ui/sidebar';
import { Separator } from './ui/separator';
import UserNav from './UserNav';

import { Breadcrumbs } from './BreadCrumbs';
import DropdownNotification from './DropdownNotification';
import SearchInput from './SearchInput';
import { ThemeToggle } from './ThemeToggle';

const AppHeader = () => {
  return (
    <header
      className=" flex  h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] 
    ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b-2"
    >
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-4 px-4">
        <UserNav />
        <ThemeToggle />
      </div>
    </header>
  );
};

export default AppHeader;
