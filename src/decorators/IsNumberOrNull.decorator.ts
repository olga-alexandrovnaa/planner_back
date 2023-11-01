import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsNumberOrNull(validationOptions?: ValidationOptions): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNumberOrNull',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value === null || (typeof value === 'number' && value >= 0);
        },
        defaultMessage(args: ValidationArguments) {
          return `Property '${args.property}' must be a number >= 0 or null!`;
        },
      },
    });
  };
}
