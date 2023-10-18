import { HttpStatus } from '@nestjs/common';

import { BaseException } from './base.exception';

export enum ValidationExceptionName {
  INVALID_INPUT_EXCEPTION = 'INVALID_INPUT_EXCEPTION',
}

export class InvalidInputException extends BaseException {
  constructor(message: string) {
    const name = ValidationExceptionName.INVALID_INPUT_EXCEPTION;
    const status = HttpStatus.BAD_REQUEST;
    super(name, status, message);
  }
}
