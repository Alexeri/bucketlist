import { Validator } from "./validators.js";

type FieldValidation = {
  value: string;
  errorElement?: HTMLElement;
  validators: Validator[];
};

type ValidationResult = {
  isValid: boolean;
  errors: Record<string, string>;
  values: Record<string, string>;
};

export function validateForm(fields: Record<string, FieldValidation>): ValidationResult {
  const errors: Record<string, string> = {};
  const values: Record<string, string> = {};
  let isValid = true;

  for (const [fieldName, { value, validators, errorElement }] of Object.entries(fields)) {
    const trimmedValue = value.trim();
    values[fieldName] = trimmedValue;

    for (const validator of validators) {
      const error = validator(trimmedValue);
      if (error) {
        errors[fieldName] = error;
        if (errorElement) {
          errorElement.textContent = error;
          errorElement.style.display = "block";
        }
        isValid = false;
        break; // Stop at first failed validator
      }
    }

    // Hide error if no issues
    if (!errors[fieldName] && errorElement) {
      errorElement.style.display = "none";
    }
  }

  return { isValid, errors, values };
}