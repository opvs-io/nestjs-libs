export class BaseException extends Error {
  readonly name: string;
  readonly status: number;

  constructor(name: string, status: number, message: string) {
    super();
    this.name = name;
    this.status = status;
    this.message = message;
  }
}
