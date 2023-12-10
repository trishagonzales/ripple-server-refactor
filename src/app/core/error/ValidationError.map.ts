import { ValidationError } from 'class-validator';

export class ValidationErrorMap {
  static toDTO(e: ValidationError) {
    let messages: string[] = [];

    for (let key in e.constraints) {
      messages.push(e.constraints[key]);
    }

    return messages;
  }
}
