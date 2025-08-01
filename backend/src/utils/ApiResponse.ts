import { Response } from "express";

interface IApiResponse<T = any> {
  status?: number;
  message?: string;
  data?: T;
}

export default class ApiResponse<T = any> implements IApiResponse<T> {
  public status?: number;
  public message?: string;
  public data?: T;

  constructor(response: IApiResponse<T>) {
    this.status = response.status;
    this.message = response.message;
    this.data = response.data;
  }
  public send(res: Response): Response {
    return res.status(this.status || 200).json(this);
  }
}
