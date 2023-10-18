import { HttpStatus } from '@nestjs/common';

import { BaseException } from './base.exception';

export enum EnvironmentExceptionName {
  INVALID_ENVIRONMENT_EXCEPTION = 'INVALID_ENVIRONMENT_EXCEPTION',
}

export class InvalidEnvironmentException extends BaseException {
  constructor(env: string) {
    const name = EnvironmentExceptionName.INVALID_ENVIRONMENT_EXCEPTION;
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    super(name, status, `"${env}" is not a valid envrionment!`);
  }
}
