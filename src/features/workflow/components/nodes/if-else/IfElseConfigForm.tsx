'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

import { ifElseConfigSchema } from './definition';
import type { IfElseConfig, IfElseConfigInput } from './types';

const OPERATORS = [
  { value: 'equals', label: 'Equals' },
  { value: 'not-equals', label: 'Not Equals' },
  { value: 'greater-than', label: 'Greater Than' },
  { value: 'less-than', label: 'Less Than' },
  { value: 'contains', label: 'Contains' },
  { value: 'not-contains', label: 'Not Contains' },
] as const;

/** Combined source.field options for single dropdown */
const SOURCE_FIELD_OPTIONS = [
  { value: 'trigger-1.timestamp', label: '1. Timestamp' },
  { value: 'trigger-1.dayOfWeek', label: '1. Day of Week' },
  { value: 'action-1.status', label: '2. Status' },
  { value: 'action-1.responseCode', label: '2. Response Code' },
] as const;

export interface IfElseConfigFormProps {
  /** Initial values for the form */
  defaultValues?: Partial<IfElseConfig>;
  /** Called when form is submitted with valid data */
  onSubmit: (data: IfElseConfig) => void;
  /** Form ID for external submit button */
  formId?: string;
}

/** Parse combined source.field value */
function parseSourceField(combined: string): { sourceNodeId: string; sourceField: string } {
  const [sourceNodeId, sourceField] = combined.split('.');
  return { sourceNodeId: sourceNodeId ?? '', sourceField: sourceField ?? '' };
}

/** Combine sourceNodeId and sourceField into single value */
function combineSourceField(sourceNodeId: string, sourceField: string): string {
  if (!sourceNodeId || !sourceField) return '';
  return `${sourceNodeId}.${sourceField}`;
}

/**
 * Form for configuring if/else branching conditions.
 * One condition per path (Path A = true branch, Path B = false branch).
 * Each condition displayed on single line: [Source.Field] [Operator] [Value]
 */
export function IfElseConfigForm({
  defaultValues,
  onSubmit,
  formId = 'if-else-config-form',
}: IfElseConfigFormProps): React.ReactElement {
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<IfElseConfigInput>({
    resolver: zodResolver(ifElseConfigSchema),
    defaultValues: {
      pathACondition: {
        sourceNodeId: defaultValues?.pathACondition?.sourceNodeId ?? '',
        sourceField: defaultValues?.pathACondition?.sourceField ?? '',
        operator: defaultValues?.pathACondition?.operator ?? 'equals',
        value: defaultValues?.pathACondition?.value ?? '',
      },
      pathBCondition: {
        sourceNodeId: defaultValues?.pathBCondition?.sourceNodeId ?? '',
        sourceField: defaultValues?.pathBCondition?.sourceField ?? '',
        operator: defaultValues?.pathBCondition?.operator ?? 'equals',
        value: defaultValues?.pathBCondition?.value ?? '',
      },
    },
  });

  const handleFormSubmit = (data: IfElseConfigInput): void => {
    onSubmit(data as IfElseConfig);
  };

  // Combined values for single-line display
  const pathACombined = combineSourceField(
    watch('pathACondition.sourceNodeId'),
    watch('pathACondition.sourceField')
  );
  const pathBCombined = combineSourceField(
    watch('pathBCondition.sourceNodeId'),
    watch('pathBCondition.sourceField')
  );

  const handlePathASourceChange = (combined: string) => {
    const { sourceNodeId, sourceField } = parseSourceField(combined);
    setValue('pathACondition.sourceNodeId', sourceNodeId);
    setValue('pathACondition.sourceField', sourceField);
  };

  const handlePathBSourceChange = (combined: string) => {
    const { sourceNodeId, sourceField } = parseSourceField(combined);
    setValue('pathBCondition.sourceNodeId', sourceNodeId);
    setValue('pathBCondition.sourceField', sourceField);
  };

  return (
    <form id={formId} onSubmit={handleSubmit(handleFormSubmit)}>
      <FieldGroup>
        {/* Path A Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">
            Path A (True) <span className="text-destructive">*</span>
          </h3>
          <div className="flex gap-2">
            <Select value={pathACombined} onValueChange={handlePathASourceChange}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {SOURCE_FIELD_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={watch('pathACondition.operator')}
              onValueChange={(v) =>
                setValue(
                  'pathACondition.operator',
                  v as IfElseConfigInput['pathACondition']['operator']
                )
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                {OPERATORS.map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="w-24"
              placeholder="Value"
              value={String(watch('pathACondition.value') ?? '')}
              onChange={(e) => setValue('pathACondition.value', e.target.value)}
            />
          </div>
          <FieldError
            errors={[
              errors.pathACondition?.sourceNodeId,
              errors.pathACondition?.sourceField,
              errors.pathACondition?.operator,
              errors.pathACondition?.value,
            ]}
          />
        </div>

        <Separator className="my-2" />

        {/* Path B Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">
            Path B (False) <span className="text-destructive">*</span>
          </h3>
          <div className="flex gap-2">
            <Select value={pathBCombined} onValueChange={handlePathBSourceChange}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {SOURCE_FIELD_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={watch('pathBCondition.operator')}
              onValueChange={(v) =>
                setValue(
                  'pathBCondition.operator',
                  v as IfElseConfigInput['pathBCondition']['operator']
                )
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                {OPERATORS.map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="w-24"
              placeholder="Value"
              value={String(watch('pathBCondition.value') ?? '')}
              onChange={(e) => setValue('pathBCondition.value', e.target.value)}
            />
          </div>
          <FieldError
            errors={[
              errors.pathBCondition?.sourceNodeId,
              errors.pathBCondition?.sourceField,
              errors.pathBCondition?.operator,
              errors.pathBCondition?.value,
            ]}
          />
        </div>
      </FieldGroup>
    </form>
  );
}
