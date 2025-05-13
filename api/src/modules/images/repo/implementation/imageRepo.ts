import { BaseModel } from "../../../../shared/core/baseModel";
import type { IImages } from "../../model/image";
import type IImageRepo from "../IImageRepo";

export class ImageRepo implements IImageRepo {
  private model: any;
  constructor(model: any) {
    this.model = model;
  }

  public async getAllImages(): Promise<IImages[]> {
    try {
      const result = await this.model.find();
      return result;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  public async save(image: IImages): Promise<void> {
    try {
      await this.model.create(image);
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
