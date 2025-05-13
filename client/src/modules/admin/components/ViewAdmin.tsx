import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import Admin from '../model/admin';

const ViewAdmin = ({ admin }: { admin: Admin }) => {
  return (
    <Dialog>
      <DialogTrigger className="w-full text-left rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground  ">
        View Admin
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Admin</DialogHeader>
        <div className="space-y-2">
          <div>
            <span className="font-medium">Name:</span> {admin.name}
          </div>
          <div>
            <span className="font-medium">Role:</span> {admin.role}
          </div>
          <div>
            <span className="font-medium">Email:</span> {admin.email}
          </div>
          <div>
            <span className="font-medium">Referral Code:</span>{' '}
            {admin.referalCode}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAdmin;
