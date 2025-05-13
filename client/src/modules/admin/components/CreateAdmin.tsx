import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import CreateAdminForm from './CreateAdminForm';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';

const CreateAdmin = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Create Admin <PlusCircle />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Admin</DialogTitle>
          <Separator />
          <DialogDescription>
            <CreateAdminForm />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdmin;
