import { fileModel } from "../../../shared/db/models/imageModel";
import { ImageRepo } from "./implementation/imageRepo";

const imageRepo = new ImageRepo(fileModel);

export { imageRepo };
