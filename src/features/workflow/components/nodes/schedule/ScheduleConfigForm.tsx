'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { scheduleConfigSchema } from './definition';
import type { ScheduleConfig, ScheduleConfigInput } from './types';

/** Common timezones for the dropdown */
const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
  { value: 'UTC', label: 'UTC' },
];

const FREQUENCIES = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
] as const;

const DAYS_OF_WEEK = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' },
];

export interface ScheduleConfigFormProps {
  /** Initial values for the form */
  defaultValues?: Partial<ScheduleConfig>;
  /** Called when form is submitted with valid data */
  onSubmit: (data: ScheduleConfig) => void;
  /** Form ID for external submit button */
  formId?: string;
}

/**
 * Form for configuring schedule trigger settings.
 * Integrates with react-hook-form and Zod validation.
 */
export function ScheduleConfigForm({
  defaultValues,
  onSubmit,
  formId = 'schedule-config-form',
}: ScheduleConfigFormProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ScheduleConfigInput>({
    resolver: zodResolver(scheduleConfigSchema),
    defaultValues: {
      frequency: defaultValues?.frequency ?? 'daily',
      timeOfDay: defaultValues?.timeOfDay ?? '09:00',
      timezone: defaultValues?.timezone ?? 'UTC',
      dayOfWeek: defaultValues?.dayOfWeek,
    },
  });

  const frequency = watch('frequency');
  const showDayOfWeek = frequency === 'weekly';

  const handleFormSubmit = (data: ScheduleConfigInput): void => {
    onSubmit(data as ScheduleConfig);
  };

  return (
    <form id={formId} onSubmit={handleSubmit(handleFormSubmit)}>
      <FieldGroup>
        {/* Frequency */}
        <Field data-invalid={!!errors.frequency}>
          <FieldLabel htmlFor="frequency" required>
            Frequency
          </FieldLabel>
          <FieldContent>
            <Select
              value={watch('frequency')}
              onValueChange={(value) =>
                setValue('frequency', value as ScheduleConfigInput['frequency'])
              }
            >
              <SelectTrigger id="frequency" className="w-full">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {FREQUENCIES.map((freq) => (
                  <SelectItem key={freq.value} value={freq.value}>
                    {freq.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[errors.frequency]} />
          </FieldContent>
        </Field>

        {/* Time of Day */}
        <Field data-invalid={!!errors.timeOfDay}>
          <FieldLabel htmlFor="timeOfDay" required>
            Time of Day
          </FieldLabel>
          <FieldContent>
            <Input id="timeOfDay" type="time" {...register('timeOfDay')} />
            <FieldError errors={[errors.timeOfDay]} />
          </FieldContent>
        </Field>

        {/* Timezone */}
        <Field data-invalid={!!errors.timezone}>
          <FieldLabel htmlFor="timezone" required>
            Timezone
          </FieldLabel>
          <FieldContent>
            <Select
              value={watch('timezone')}
              onValueChange={(value) => setValue('timezone', value)}
            >
              <SelectTrigger id="timezone" className="w-full">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[errors.timezone]} />
          </FieldContent>
        </Field>

        {/* Day of Week (conditional) */}
        {showDayOfWeek && (
          <Field data-invalid={!!errors.dayOfWeek}>
            <FieldLabel htmlFor="dayOfWeek">Day of Week</FieldLabel>
            <FieldContent>
              <Select
                value={watch('dayOfWeek')?.toString()}
                onValueChange={(value) => setValue('dayOfWeek', parseInt(value, 10))}
              >
                <SelectTrigger id="dayOfWeek" className="w-full">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day.value} value={day.value.toString()}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[errors.dayOfWeek]} />
            </FieldContent>
          </Field>
        )}
      </FieldGroup>
    </form>
  );
}
