declare module 'jsonwebtoken' {
  export interface JwtPayload {
    userId: string;
    email: string;
    exp?: number;
    iat?: number;
    iss?: string;
    aud?: string | string[];
  }

  export function sign(
    payload: string | Buffer | object,
    secretOrPrivateKey: jwt.Secret,
    options?: jwt.SignOptions
  ): string;

  export function verify(
    token: string,
    secretOrPublicKey: jwt.Secret | jwt.GetPublicKeyOrSecret,
    options?: jwt.VerifyOptions & { complete?: false }
  ): JwtPayload;

  export function decode(
    token: string,
    options?: jwt.DecodeOptions & { complete: true }
  ): null | { [key: string]: any };

  export function decode(
    token: string,
    options?: jwt.DecodeOptions
  ): null | JwtPayload;
}
