import { HttpStatus } from '@nestjs/common';

import { BaseException } from './base.exception';

export enum AppExceptionName {
  UNKNOWN_EXCEPTION = 'UNKNOWN_EXCEPTION',
}

export class UnknownException extends BaseException {
  constructor() {
    const name = AppExceptionName.UNKNOWN_EXCEPTION;
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    super(name, status, `An unknown error has occurred!`);
  }
}
