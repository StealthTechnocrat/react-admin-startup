import { ImageUploadToMMGBackend } from "./imageUploadToMMGBackend";
import { UploadImageUseCase } from "./uploadImageUseCase";

const uploadImageUseCase = new UploadImageUseCase();

const imageUploadToMMGBackend = new ImageUploadToMMGBackend();

export { uploadImageUseCase, imageUploadToMMGBackend };
