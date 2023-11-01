import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsStringOrNull(validationOptions?: ValidationOptions): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStringOrNull',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value === null || typeof value === 'string';
        },
        defaultMessage(args: ValidationArguments) {
          return `Property '${args.property}' must be a string or null!`;
        },
      },
    });
  };
}
