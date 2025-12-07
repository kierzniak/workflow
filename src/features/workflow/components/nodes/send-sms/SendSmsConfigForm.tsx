'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { sendSmsConfigSchema } from './definition';
import type { SendSmsConfig, SendSmsConfigInput } from './types';

export interface SendSmsConfigFormProps {
  /** Initial values for the form */
  defaultValues?: Partial<SendSmsConfig>;
  /** Called when form is submitted with valid data */
  onSubmit: (data: SendSmsConfig) => void;
  /** Form ID for external submit button */
  formId?: string;
}

/**
 * Form for configuring send SMS action settings.
 * Integrates with react-hook-form and Zod validation.
 */
export function SendSmsConfigForm({
  defaultValues,
  onSubmit,
  formId = 'send-sms-config-form',
}: SendSmsConfigFormProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendSmsConfigInput>({
    resolver: zodResolver(sendSmsConfigSchema),
    defaultValues: {
      phoneNumber: defaultValues?.phoneNumber ?? '',
      message: defaultValues?.message ?? '',
    },
  });

  const handleFormSubmit = (data: SendSmsConfigInput): void => {
    onSubmit(data as SendSmsConfig);
  };

  return (
    <form id={formId} onSubmit={handleSubmit(handleFormSubmit)}>
      <FieldGroup>
        {/* Phone Number */}
        <Field data-invalid={!!errors.phoneNumber}>
          <FieldLabel htmlFor="phoneNumber" required>
            Phone Number
          </FieldLabel>
          <FieldContent>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+1 (555) 123-4567"
              {...register('phoneNumber')}
            />
            <FieldError errors={[errors.phoneNumber]} />
          </FieldContent>
        </Field>

        {/* Message */}
        <Field data-invalid={!!errors.message}>
          <FieldLabel htmlFor="message" required>
            Message
          </FieldLabel>
          <FieldContent>
            <Textarea
              id="message"
              placeholder="Enter your SMS message..."
              rows={4}
              {...register('message')}
            />
            <FieldError errors={[errors.message]} />
          </FieldContent>
        </Field>
      </FieldGroup>
    </form>
  );
}
