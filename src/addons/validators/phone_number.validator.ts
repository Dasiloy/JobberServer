import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

// Custom validator to check if the full phone number is valid
@ValidatorConstraint({ name: 'IsValidPhoneNumber', async: false })
export class IsValidPhoneNumberConstraint
  implements ValidatorConstraintInterface
{
  validate(phone_number: string, args: ValidationArguments) {
    const { country_code } = args.object as any;
    const fullPhoneNumber = `+${country_code}${phone_number}`;

    const parsedNumber = parsePhoneNumberFromString(fullPhoneNumber);
    return parsedNumber?.isValid() ?? false;
  }

  defaultMessage() {
    return 'Phone number is invalid for the given country code';
  }
}
