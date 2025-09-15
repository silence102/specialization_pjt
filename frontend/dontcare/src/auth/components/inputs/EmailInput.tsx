import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import type { FieldError } from 'react-hook-form';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';

const DEFAULT_TEXTS = {
  LABEL: '이메일',
  PLACEHOLDER: 'email@example.com',
} as const;

interface EmailInputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  error?: FieldError;
  label?: string;
  placeholder?: string;
  description?: string | string[];
  persistentDescription?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  descriptionClassName?: string;
  containerClassName?: string;
  type?: 'email';
}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  (
    {
      label = DEFAULT_TEXTS.LABEL,
      placeholder = DEFAULT_TEXTS.PLACEHOLDER,
      error,
      description,
      persistentDescription,
      labelClassName,
      inputClassName,
      errorClassName,
      descriptionClassName,
      containerClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={`space-y-2 ${containerClassName || ''}`}>
        <Label htmlFor={props.id} className={`font-medium text-white ${labelClassName || ''}`}>
          {label}
        </Label>
        <Input
          ref={ref}
          {...props}
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder={placeholder}
          className={`border-white/20 bg-white/5 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20 ${inputClassName || ''}`}
        />
        <div className="space-y-1">
          {/* description - 항상 표시 (persistentDescription이 true인 경우) */}
          {description && (persistentDescription || !error) && (
            <div className={`text-sm text-white/80 ${descriptionClassName || ''}`}>
              {Array.isArray(description) ? (
                <ul className="list-inside list-disc space-y-1">
                  {description.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{description}</p>
              )}
            </div>
          )}
          {/* 에러메시지 영역 - 미리 확보 */}
          <div className="min-h-[1.25rem]">
            {error && (
              <p className={`text-sm text-red-400 ${errorClassName || ''}`}>{error.message}</p>
            )}
          </div>
        </div>
      </div>
    );
  },
);

EmailInput.displayName = 'EmailInput';
