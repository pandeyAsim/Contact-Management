declare namespace Express {
  export interface Request {
    user?: any;
    refreshTokenId?: number;
    [key: string]: any;
  }
}
