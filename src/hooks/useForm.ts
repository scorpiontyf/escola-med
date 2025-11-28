import { useState, useCallback } from "react";

type ValidationRule<T> = {
  validate: (value: T[keyof T], allValues: T) => boolean;
  message: string;
};

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T>[];
};

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  onSubmit?: (values: T) => void | Promise<void>;
}

/**
 * Hook para gerenciar formulários
 *
 * @example
 * const { values, errors, handleChange, handleSubmit, isValid } = useForm({
 *   initialValues: { nome: '', email: '' },
 *   validationRules: {
 *     nome: [{ validate: (v) => v.length >= 3, message: 'Mínimo 3 caracteres' }],
 *   },
 * });
 */
export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors],
  );

  const validateField = useCallback(
    <K extends keyof T>(field: K): boolean => {
      const rules = validationRules[field];
      if (!rules) return true;

      for (const rule of rules) {
        if (!rule.validate(values[field], values)) {
          setErrors((prev) => ({ ...prev, [field]: rule.message }));
          return false;
        }
      }

      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    },
    [values, validationRules],
  );

  const handleBlur = useCallback(
    <K extends keyof T>(field: K) => {
      setTouched((prev) => ({ ...prev, [field]: true }));

      validateField(field);
    },
    [validateField],
  );

  const validateAll = useCallback((): boolean => {
    let isValid = true;
    const newErrors: Partial<Record<keyof T, string>> = {};

    for (const field of Object.keys(validationRules) as (keyof T)[]) {
      const rules = validationRules[field];
      if (!rules) continue;

      for (const rule of rules) {
        if (!rule.validate(values[field], values)) {
          newErrors[field] = rule.message;
          isValid = false;
          break;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  const handleSubmit = useCallback(async () => {
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    setTouched(allTouched);

    if (!validateAll()) return false;

    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
        return true;
      } finally {
        setIsSubmitting(false);
      }
    }

    return true;
  }, [values, validateAll, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFormValues = useCallback((newValues: Partial<T>) => {
    setValues((prev) => ({ ...prev, ...newValues }));
  }, []);

  const isValid = Object.keys(errors).length === 0;

  const hasVisibleErrors = Object.keys(errors).some(
    (key) => touched[key as keyof T],
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    hasVisibleErrors,
    handleChange,
    handleBlur,
    handleSubmit,
    validateField,
    validateAll,
    reset,
    setFormValues,
  };
}
