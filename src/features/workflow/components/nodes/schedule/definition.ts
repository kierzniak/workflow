import { Calendar } from 'lucide-react';
import { z } from 'zod';

import type { NodeDefinition } from '../types';

import { ScheduleConfigForm } from './ScheduleConfigForm';
import { ScheduleTriggerNode } from './ScheduleTriggerNode';
import type { ScheduleConfig } from './types';

/**
 * Schema for schedule trigger configuration.
 * Validates frequency, time, timezone, and optional day of week.
 */
export const scheduleConfigSchema = z
  .object({
    frequency: z.enum(['hourly', 'daily', 'weekly', 'monthly'], {
      error: 'Please select a valid frequency',
    }),
    timeOfDay: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:mm format (e.g., 09:00)'),
    timezone: z.string().min(1, 'Please select a timezone'),
    dayOfWeek: z
      .number()
      .int()
      .min(1, 'Day must be between 1 (Monday) and 7 (Sunday)')
      .max(7, 'Day must be between 1 (Monday) and 7 (Sunday)')
      .optional(),
  })
  .refine(
    (data) => {
      // dayOfWeek is required when frequency is weekly
      if (data.frequency === 'weekly') {
        return data.dayOfWeek !== undefined;
      }
      return true;
    },
    {
      message: 'Day of week is required for weekly schedules',
      path: ['dayOfWeek'],
    }
  );

/**
 * Schedule trigger node definition.
 */
export const scheduleDefinition: NodeDefinition<'schedule', ScheduleConfig> = {
  name: 'schedule',
  type: 'trigger',
  label: 'Schedule',
  description: 'Run workflow on a schedule (hourly, daily, weekly, monthly)',
  icon: Calendar,
  schema: scheduleConfigSchema,
  component: ScheduleTriggerNode,
  configForm: ScheduleConfigForm,
};
