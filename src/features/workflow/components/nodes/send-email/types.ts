import type { z } from 'zod';

import type { sendEmailConfigSchema } from './definition';

/**
 * Send email action configuration.
 */
export interface SendEmailConfig {
  /** Recipient email address */
  to: string;
  /** Email subject line */
  subject: string;
  /** Email body content */
  body: string;
  /** Sender display name (optional) */
  fromName?: string;
}

export type SendEmailConfigInput = z.input<typeof sendEmailConfigSchema>;
export type SendEmailConfigOutput = z.output<typeof sendEmailConfigSchema>;
