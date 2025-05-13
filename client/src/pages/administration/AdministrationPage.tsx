import AdministrationListing from '@/modules/admin/components/AdministrationListing';
import CreateAdmin from '@/modules/admin/components/CreateAdmin';
import AdminTableAction from '@/modules/admin/components/admin-table/AdminTableActions';

const AdministrationPage = () => {
  return (
    <>
      {/* <Breadcrumbs /> */}

      <div className="flex justify-between items-center">
        <AdminTableAction />
        <CreateAdmin />
      </div>
      <div className="my-4" />
      <AdministrationListing />
    </>
  );
};

export default AdministrationPage;
