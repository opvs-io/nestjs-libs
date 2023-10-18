import { Transform } from 'class-transformer';

const transformWrapper = (value: any, callback: (value: string) => any) => {
  if (typeof value === 'string') {
    return callback(value);
  }
  return value;
};

export function Trim(): PropertyDecorator {
  return Transform(({ value }: { value: string }) => transformWrapper(value, (value) => value.trim()));
}

export function ToUpperCase(): PropertyDecorator {
  return Transform(({ value }: { value: string }) => transformWrapper(value, (value) => value.toUpperCase()));
}

export function ToLowerCase(): PropertyDecorator {
  return Transform(({ value }: { value: string }) => transformWrapper(value, (value) => value.toLowerCase()));
}

export function ToBase64(): PropertyDecorator {
  return Transform(({ value }: { value: string }) =>
    transformWrapper(value, (value) => value.trim().replace(/(data:image\/[^;]+;base64,)/g, '')),
  );
}

export function ToNumber(): PropertyDecorator {
  return Transform(({ value }: { value: string }) => transformWrapper(value, (value) => +value));
}

export function ToBoolean(): PropertyDecorator {
  return Transform(({ value }: { value: string | boolean }) =>
    transformWrapper(value, (value: string | boolean) => value === 'true' || value === true),
  );
}

export function ToObject(): PropertyDecorator {
  return Transform(({ value }: { value: string }) =>
    transformWrapper(value, (value: string) => {
      try {
        return JSON.parse(value);
      } catch (e) {
        return null;
      }
    }),
  );
}
