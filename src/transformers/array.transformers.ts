import { Transform } from 'class-transformer';

const transformWrapper = (value: any, callback: (value: Array<any>) => any) => {
  if (typeof value === 'object') {
    return callback(value);
  }
  return value;
};

export function AllToNumber(): PropertyDecorator {
  return Transform(({ value }: { value: Array<any> }) =>
    transformWrapper(value, (value) => value.map((item) => +item)),
  );
}
