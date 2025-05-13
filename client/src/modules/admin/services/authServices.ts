import cookie from 'js-cookie'; // Add this library to handle cookies on the client side
import { JWTToken } from '../model/token';

type TokenType = 'accessToken';

export interface IAuthService {
  isAuthenticated(): boolean;
  getToken(tokenType: TokenType): JWTToken | null;
  // setToken(tokenType: TokenType, token: JWTToken): void;
  removeToken(tokenType: TokenType): void;
}

export class AuthService implements IAuthService {
  public static accessTokenName: string = 'accessToken';

  private getTokenName(): string {
    return AuthService.accessTokenName;
  }

  public getToken(): JWTToken | null {
    const tokenName = this.getTokenName();
    const token = cookie.get(tokenName); // Read token from cookies
    return token ? token : null;
  }

  // public setToken(token: JWTToken): void {
  // const tokenName = this.getTokenName();
  // const expires = new Date();
  // expires.setTime(expires.getTime() + 30 * 60 * 1000); // 30 minutes
  // cookie.set(tokenName, JSON.stringify(token), {
  //   expires, // Expiry for 30 minutes
  //   secure: false,
  //   httpOnly: false, // Set `true` for server-side; only accessible on the server
  //   sameSite: 'strict',
  // });
  // }

  public removeToken(): void {
    const tokenName = this.getTokenName();
    cookie.remove(tokenName);
  }

  public isAuthenticated(): boolean {
    return this.getToken() !== undefined;
  }
}
