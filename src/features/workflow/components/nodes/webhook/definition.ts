import { Webhook } from 'lucide-react';
import { z } from 'zod';

import type { NodeDefinition } from '../types';

import { WebhookConfigForm } from './WebhookConfigForm';
import { WebhookTriggerNode } from './WebhookTriggerNode';
import type { WebhookConfig } from './types';

/**
 * Schema for webhook trigger configuration.
 * Validates HTTP method.
 */
export const webhookConfigSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE'], {
    error: 'Please select a valid HTTP method',
  }),
});

/**
 * Webhook trigger node definition.
 */
export const webhookDefinition: NodeDefinition<'webhook', WebhookConfig> = {
  name: 'webhook',
  type: 'trigger',
  label: 'Webhook',
  description: 'Run workflow when HTTP request is received',
  icon: Webhook,
  schema: webhookConfigSchema,
  component: WebhookTriggerNode,
  configForm: WebhookConfigForm,
};
