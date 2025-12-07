'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { webhookConfigSchema } from './definition';
import type { WebhookConfig, WebhookConfigInput } from './types';

const HTTP_METHODS = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'DELETE', label: 'DELETE' },
] as const;

export interface WebhookConfigFormProps {
  /** Initial values for the form */
  defaultValues?: Partial<WebhookConfig>;
  /** Called when form is submitted with valid data */
  onSubmit: (data: WebhookConfig) => void;
  /** Form ID for external submit button */
  formId?: string;
}

/**
 * Form for configuring webhook trigger settings.
 * Integrates with react-hook-form and Zod validation.
 */
export function WebhookConfigForm({
  defaultValues,
  onSubmit,
  formId = 'webhook-config-form',
}: WebhookConfigFormProps): React.ReactElement {
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WebhookConfigInput>({
    resolver: zodResolver(webhookConfigSchema),
    defaultValues: {
      method: defaultValues?.method ?? 'POST',
    },
  });

  const handleFormSubmit = (data: WebhookConfigInput): void => {
    onSubmit(data as WebhookConfig);
  };

  return (
    <form id={formId} onSubmit={handleSubmit(handleFormSubmit)}>
      <FieldGroup>
        {/* HTTP Method */}
        <Field data-invalid={!!errors.method}>
          <FieldLabel htmlFor="method" required>
            HTTP Method
          </FieldLabel>
          <FieldContent>
            <Select
              value={watch('method')}
              onValueChange={(value) => setValue('method', value as WebhookConfigInput['method'])}
            >
              <SelectTrigger id="method" className="w-full">
                <SelectValue placeholder="Select HTTP method" />
              </SelectTrigger>
              <SelectContent>
                {HTTP_METHODS.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[errors.method]} />
          </FieldContent>
        </Field>
      </FieldGroup>
    </form>
  );
}
