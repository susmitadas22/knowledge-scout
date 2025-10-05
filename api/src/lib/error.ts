import { HTTPException } from "hono/http-exception";

export class ValidationError extends HTTPException {
  field?: string;
  code: string;

  constructor(code: string, message: string, field?: string) {
    super(400, { message });
    this.code = code;
    this.field = field;
  }
}

export class ApiError extends HTTPException {
  code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(statusCode as any, { message });
    this.code = code;
  }
}
