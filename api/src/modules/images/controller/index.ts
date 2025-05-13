import { imageRepo } from "../repo";
import { GetAllImagesController } from "./getAllImagesController";
import { ImageUploaderController } from "./imageUploadController";

const imageUploaderController = new ImageUploaderController(imageRepo);

const getAllImagesController = new GetAllImagesController(imageRepo);

export { imageUploaderController, getAllImagesController };
