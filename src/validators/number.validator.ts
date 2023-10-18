import * as validator from 'class-validator';

export function IsSeqId(validationOptions?: validator.ValidationOptions) {
  return (object: any, propertyName: string) => {
    validator.registerDecorator({
      name: 'isSeqId',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const valueAsInt = parseInt(value, 10);
          return validator.isInt(value) && valueAsInt >= 1;
        },

        defaultMessage() {
          return `${propertyName} must be a sequential integer starting from 1`;
        },
      },
    });
  };
}
