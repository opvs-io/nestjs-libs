import * as _ from 'lodash';

import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { InvalidInputException } from '../exceptions';

export function extractAllErrors(validationError: ValidationError, errors: string[]) {
  if (validationError.constraints) {
    const mappedErrors = _.map(validationError.constraints, (value) => value);
    errors.push(...mappedErrors);
  }

  if (!validationError.children || (validationError.children && validationError.children.length === 0)) {
    return _.flattenDeep(errors);
  }

  return _.chain(validationError.children)
    .map((child) => extractAllErrors(child, errors))
    .flattenDeep()
    .value();
}

const validationPipeConfig = {
  transform: true,
  whitelist: true,
  exceptionFactory: (validationErrors: ValidationError[]) => {
    const errors = _.chain(validationErrors)
      .map((error) => extractAllErrors(error, []))
      .flattenDeep()
      .uniq()
      .value();

    return new InvalidInputException(errors.join(','));
  },
};

export const validationPipe = new ValidationPipe(validationPipeConfig);
