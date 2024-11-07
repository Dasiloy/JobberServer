import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// Custom validator to check that old_password and new_password are different
@ValidatorConstraint({ name: 'isPasswordDifferent', async: false })
export class IsPasswordDifferent implements ValidatorConstraintInterface {
  validate(new_password: string, args: ValidationArguments) {
    const { object } = args;
    return new_password !== (object as any).old_password;
  }

  defaultMessage() {
    return 'New password must be different from old password';
  }
}
