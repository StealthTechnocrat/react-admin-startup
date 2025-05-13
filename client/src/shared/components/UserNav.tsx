import { getCurrentAdmin, logout } from '@/modules/admin/redux/adminSlice';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toast } from '../hooks/use-toast';

const UserNav = () => {
  const admin = useAppSelector(getCurrentAdmin);
  const dispatch = useAppDispatch();
  const signOut = async () => {
    const result = await dispatch(logout());
    if (result.meta.requestStatus === 'fulfilled') {
      toast({ title: 'LOGOUT SUCCESSFUL', variant: 'success' });
    }
  };

  if (admin) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              {/* <AvatarImage src={admin?.image ?? ''} alt={admin?.name ?? ''} /> */}
              <AvatarFallback>{admin?.name?.[0]}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{admin?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {admin?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
};

export default UserNav;
