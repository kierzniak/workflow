import type { z } from 'zod';

import type { webhookConfigSchema } from './definition';

/**
 * Webhook trigger configuration.
 */
export interface WebhookConfig {
  /** HTTP method to accept */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

export type WebhookConfigInput = z.input<typeof webhookConfigSchema>;
export type WebhookConfigOutput = z.output<typeof webhookConfigSchema>;
