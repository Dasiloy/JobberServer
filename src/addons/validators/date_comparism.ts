import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

interface IDateComparison {
  comparisonKey: string;
  comparisonType: 'greater' | 'less';
  required: boolean;
}

@ValidatorConstraint({ name: 'isDateComparisonValid', async: false })
export class IsDateComparisonValid implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const { object, constraints } = args;
    const [{ comparisonKey, comparisonType, required }] = constraints;

    // If the value is empty and the field is marked as optional, skip validation
    if (!required && (value === null || value === undefined || value === '')) {
      return true;
    }

    const comparisonValue = (object as any)[comparisonKey];

    const currentDate = new Date(value);
    if (isNaN(currentDate.getTime())) return false;

    const comparedDate = new Date(comparisonValue);
    if (isNaN(comparedDate.getTime())) return false;

    // Compare dates based on the specified comparison type
    if (comparisonType === 'greater') {
      return currentDate >= comparedDate;
    } else if (comparisonType === 'less') {
      return currentDate <= comparedDate;
    }

    return false;
  }

  defaultMessage(args: ValidationArguments): string {
    const [comparisonKey, comparisonType] = args.constraints;
    if (comparisonType === 'greater') {
      return `$property must be a date greater than ${comparisonKey}`;
    } else if (comparisonType === 'less') {
      return `$property must be a date less than ${comparisonKey}`;
    }
    return `$property must be a valid date`;
  }
}

// Decorator function
export function DateComparison(
  options: IDateComparison,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsDateComparisonValid,
    });
  };
}
