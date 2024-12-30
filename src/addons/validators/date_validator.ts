import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

// Custom date validator
@ValidatorConstraint({ name: 'isValidDate', async: false })
export class IsValidDate implements ValidatorConstraintInterface {
  validate(value: any, args: any): boolean {
    const required = args.constraints[0];

    // If the value is empty and the field is marked as optional, skip validation
    if (!required && (value === null || value === undefined || value === '')) {
      return true;
    }

    // Ensure the value is a valid date
    const date = new Date(value);
    return !isNaN(date.getTime());
  }

  defaultMessage(): string {
    return '$property must be a valid date in ISO 8601 format (YYYY-MM-DD).';
  }
}

// Decorator function for the date validator
export function DateValidator(
  required: boolean,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsValidDate,
      constraints: [required], // Pass the isOptional flag
    });
  };
}
