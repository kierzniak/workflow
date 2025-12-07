'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { sendEmailConfigSchema } from './definition';
import type { SendEmailConfig, SendEmailConfigInput } from './types';

export interface SendEmailConfigFormProps {
  /** Initial values for the form */
  defaultValues?: Partial<SendEmailConfig>;
  /** Called when form is submitted with valid data */
  onSubmit: (data: SendEmailConfig) => void;
  /** Form ID for external submit button */
  formId?: string;
}

/**
 * Form for configuring send email action settings.
 * Integrates with react-hook-form and Zod validation.
 */
export function SendEmailConfigForm({
  defaultValues,
  onSubmit,
  formId = 'send-email-config-form',
}: SendEmailConfigFormProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendEmailConfigInput>({
    resolver: zodResolver(sendEmailConfigSchema),
    defaultValues: {
      to: defaultValues?.to ?? '',
      subject: defaultValues?.subject ?? '',
      body: defaultValues?.body ?? '',
      fromName: defaultValues?.fromName ?? '',
    },
  });

  const handleFormSubmit = (data: SendEmailConfigInput): void => {
    onSubmit(data as SendEmailConfig);
  };

  return (
    <form id={formId} onSubmit={handleSubmit(handleFormSubmit)}>
      <FieldGroup>
        {/* To Email */}
        <Field data-invalid={!!errors.to}>
          <FieldLabel htmlFor="to" required>
            To
          </FieldLabel>
          <FieldContent>
            <Input id="to" type="email" placeholder="recipient@example.com" {...register('to')} />
            <FieldError errors={[errors.to]} />
          </FieldContent>
        </Field>

        {/* Subject */}
        <Field data-invalid={!!errors.subject}>
          <FieldLabel htmlFor="subject" required>
            Subject
          </FieldLabel>
          <FieldContent>
            <Input
              id="subject"
              type="text"
              placeholder="Email subject line"
              {...register('subject')}
            />
            <FieldError errors={[errors.subject]} />
          </FieldContent>
        </Field>

        {/* Body */}
        <Field data-invalid={!!errors.body}>
          <FieldLabel htmlFor="body" required>
            Body
          </FieldLabel>
          <FieldContent>
            <Textarea
              id="body"
              placeholder="Write your message here..."
              rows={5}
              {...register('body')}
            />
            <FieldError errors={[errors.body]} />
          </FieldContent>
        </Field>

        {/* From Name (optional) */}
        <Field data-invalid={!!errors.fromName}>
          <FieldLabel htmlFor="fromName">From Name (optional)</FieldLabel>
          <FieldContent>
            <Input
              id="fromName"
              type="text"
              placeholder="Sender display name"
              {...register('fromName')}
            />
            <FieldError errors={[errors.fromName]} />
          </FieldContent>
        </Field>
      </FieldGroup>
    </form>
  );
}
