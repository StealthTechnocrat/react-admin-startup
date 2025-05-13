import type { IImages } from "../model/image";

export default interface IImageRepo {
  save(image: IImages): Promise<void>;
  getAllImages(): Promise<IImages[]>;
}
