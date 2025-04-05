export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateSpendingPlan = (data: {
  name: string;
  description: string;
  currency: string;
  incomeAndAllocationFrequency: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  // Name validation
  if (!data.name.trim()) {
    errors.push({
      field: 'name',
      message: 'Plan name is required'
    });
  } else if (data.name.length < 3) {
    errors.push({
      field: 'name',
      message: 'Plan name must be at least 3 characters long'
    });
  } else if (data.name.length > 100) {
    errors.push({
      field: 'name',
      message: 'Plan name must be less than 100 characters'
    });
  }

  // Description validation
  if (data.description.length > 500) {
    errors.push({
      field: 'description',
      message: 'Description must be less than 500 characters'
    });
  }

  // Currency validation
  if (!['GBP', 'EUR', 'USD'].includes(data.currency)) {
    errors.push({
      field: 'currency',
      message: 'Invalid currency selected'
    });
  }

  // Frequency validation
  if (!['monthly', 'weekly', 'daily'].includes(data.incomeAndAllocationFrequency)) {
    errors.push({
      field: 'incomeAndAllocationFrequency',
      message: 'Invalid frequency selected'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}; 