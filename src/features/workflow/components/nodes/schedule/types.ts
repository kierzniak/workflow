import type { z } from 'zod';

import type { scheduleConfigSchema } from './definition';

/**
 * Schedule trigger configuration.
 */
export interface ScheduleConfig {
  /** How often the trigger fires */
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  /** Time of day in HH:mm format (24-hour) */
  timeOfDay: string;
  /** IANA timezone identifier (e.g., "America/New_York") */
  timezone: string;
  /** Day of week for weekly frequency (1=Monday, 7=Sunday, ISO 8601) */
  dayOfWeek?: number;
}

export type ScheduleConfigInput = z.input<typeof scheduleConfigSchema>;
export type ScheduleConfigOutput = z.output<typeof scheduleConfigSchema>;
