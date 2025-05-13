import { createDefaultSuperAdmin } from "./workers";

function DefaultWorker() {
  createDefaultSuperAdmin.execute();
}

DefaultWorker();
