import type { z } from 'zod';

import type { sendSmsConfigSchema } from './definition';

/**
 * Send SMS action configuration.
 */
export interface SendSmsConfig {
  /** Recipient phone number */
  phoneNumber: string;
  /** SMS message body */
  message: string;
}

export type SendSmsConfigInput = z.input<typeof sendSmsConfigSchema>;
export type SendSmsConfigOutput = z.output<typeof sendSmsConfigSchema>;
