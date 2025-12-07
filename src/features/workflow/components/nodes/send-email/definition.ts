import { Mail } from 'lucide-react';
import { z } from 'zod';

import type { NodeDefinition } from '../types';

import { SendEmailConfigForm } from './SendEmailConfigForm';
import { SendEmailActionNode } from './SendEmailActionNode';
import type { SendEmailConfig } from './types';

/**
 * Schema for send email action configuration.
 * Validates recipient, subject, body, and optional sender name.
 */
export const sendEmailConfigSchema = z.object({
  to: z
    .string()
    .min(1, 'Please enter an email address')
    .email('Please enter a valid email address'),
  subject: z
    .string()
    .min(1, 'Subject cannot be empty')
    .max(200, 'Subject must be 200 characters or less'),
  body: z.string().min(1, 'Message body cannot be empty'),
  fromName: z.string().max(100, 'From name must be 100 characters or less').optional(),
});

/**
 * Send email action node definition.
 */
export const sendEmailDefinition: NodeDefinition<'send-email', SendEmailConfig> = {
  name: 'send-email',
  type: 'action',
  label: 'Send Email',
  description: 'Send an email to a recipient',
  icon: Mail,
  schema: sendEmailConfigSchema,
  component: SendEmailActionNode,
  configForm: SendEmailConfigForm,
};
