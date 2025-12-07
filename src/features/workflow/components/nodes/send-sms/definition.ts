import { MessageSquare } from 'lucide-react';
import { z } from 'zod';

import type { NodeDefinition } from '../types';

import { SendSmsConfigForm } from './SendSmsConfigForm';
import { SendSmsActionNode } from './SendSmsActionNode';
import type { SendSmsConfig } from './types';

/**
 * Schema for send SMS action configuration.
 * Validates phone number and message.
 */
export const sendSmsConfigSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Please enter a phone number')
    .regex(/^\+?[0-9\s\-()]+$/, 'Please enter a valid phone number'),
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(1600, 'Message must be 1600 characters or less'),
});

/**
 * Send SMS action node definition.
 */
export const sendSmsDefinition: NodeDefinition<'send-sms', SendSmsConfig> = {
  name: 'send-sms',
  type: 'action',
  label: 'Send SMS',
  description: 'Send an SMS message to a phone number',
  icon: MessageSquare,
  schema: sendSmsConfigSchema,
  component: SendSmsActionNode,
  configForm: SendSmsConfigForm,
};
