import bcript from "bcrypt";
export class PasswordUtils {
  private static saltValue: number = 10;

  public static async hashPassword(plainPwd: string): Promise<string> {
    return bcript.hashSync(plainPwd, this.saltValue);
  }

  public static async verifyPassword(
    plainPwd: string,
    hashPwd: string
  ): Promise<boolean> {
    return bcript.compareSync(plainPwd, hashPwd);
  }
}
