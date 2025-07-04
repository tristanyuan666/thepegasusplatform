"use client";

import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateField(
  value: string,
  rules: ValidationRule,
): ValidationResult {
  // Required validation
  if (rules.required && (!value || value.trim() === "")) {
    return { isValid: false, error: "This field is required" };
  }

  // Skip other validations if field is empty and not required
  if (!value || value.trim() === "") {
    return { isValid: true };
  }

  // Min length validation
  if (rules.minLength && value.length < rules.minLength) {
    return {
      isValid: false,
      error: `Must be at least ${rules.minLength} characters`,
    };
  }

  // Max length validation
  if (rules.maxLength && value.length > rules.maxLength) {
    return {
      isValid: false,
      error: `Must be no more than ${rules.maxLength} characters`,
    };
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value)) {
    return { isValid: false, error: "Invalid format" };
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      return { isValid: false, error: customError };
    }
  }

  return { isValid: true };
}

// Common validation rules
export const validationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (!value.includes("@")) return "Please enter a valid email address";
      return null;
    },
  },
  password: {
    required: true,
    minLength: 6,
    custom: (value: string) => {
      if (value.length < 6) return "Password must be at least 6 characters";
      if (!/(?=.*[a-z])/.test(value))
        return "Password must contain at least one lowercase letter";
      if (!/(?=.*[A-Z])/.test(value))
        return "Password must contain at least one uppercase letter";
      return null;
    },
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
  },
  phone: {
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
  },
};

interface ValidatedInputProps {
  type?: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  rules: ValidationRule;
  className?: string;
  disabled?: boolean;
  autoComplete?: string;
  "aria-label"?: string;
}

export function ValidatedInput({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  rules,
  className,
  disabled,
  autoComplete,
  "aria-label": ariaLabel,
}: ValidatedInputProps) {
  const [touched, setTouched] = useState(false);
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
  });

  useEffect(() => {
    if (touched || value) {
      const result = validateField(value, rules);
      setValidation(result);
    }
  }, [value, rules, touched]);

  const handleBlur = () => {
    setTouched(true);
    onBlur?.();
  };

  const showError = touched && !validation.isValid;
  const showSuccess = touched && validation.isValid && value;

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-label={ariaLabel}
          aria-invalid={showError}
          aria-describedby={showError ? `${name}-error` : undefined}
          required={rules.required}
          className={cn(
            "w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover-target interactive-element",
            showError
              ? "border-red-300 bg-red-50 focus:ring-red-500"
              : showSuccess
                ? "border-green-300 bg-green-50 focus:ring-green-500"
                : "border-gray-300 bg-white hover:border-gray-400",
            disabled && "opacity-50 cursor-not-allowed",
            className,
          )}
          data-interactive="true"
          data-form-input="true"
          data-validation={validation.isValid ? "valid" : "invalid"}
        />

        {/* Validation icons */}
        {(showError || showSuccess) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {showError ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {showError && (
        <div
          id={`${name}-error`}
          className="text-sm text-red-600 flex items-center gap-2 animate-slide-down"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {validation.error}
        </div>
      )}

      {/* Success message */}
      {showSuccess && (
        <div className="text-sm text-green-600 flex items-center gap-2 animate-slide-down">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          Looks good!
        </div>
      )}
    </div>
  );
}

// Form validation hook
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Record<keyof T, ValidationRule>,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach((key) => {
      const field = key as keyof T;
      const value = String(values[field] || "");
      const rules = validationRules[field];
      const result = validateField(value, rules);

      if (!result.isValid) {
        newErrors[field] = result.error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const setValue = (field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));

    // Validate field on change if it's been touched
    if (touched[field]) {
      const rules = validationRules[field];
      const result = validateField(String(value || ""), rules);
      setErrors((prev) => ({
        ...prev,
        [field]: result.isValid ? undefined : result.error,
      }));
    }
  };

  const setFieldTouched = (field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateForm,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
}
