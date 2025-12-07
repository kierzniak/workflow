import type { ComponentType } from 'react';
import type { z } from 'zod';

/**
 * Icon component type from lucide-react.
 */
export type IconComponent = ComponentType<{ className?: string }>;

/**
 * Props interface for node configuration forms.
 */
export interface ConfigFormProps<TConfig> {
  /** Initial values for the form */
  defaultValues?: Partial<TConfig>;
  /** Called when form is submitted with valid data */
  onSubmit: (data: TConfig) => void;
  /** Form ID for external submit button */
  formId?: string;
}

/**
 * Definition of a workflow node (trigger or action).
 * Contains all metadata, validation, and UI components for a node type.
 *
 * @template TName - The literal string type for node name
 * @template TConfig - The configuration shape for this node
 */
export interface NodeDefinition<TName extends string = string, TConfig = unknown> {
  /** Unique identifier for this node type */
  name: TName;
  /** Whether this is a trigger or action */
  type: 'trigger' | 'action';
  /** Display label for UI */
  label: string;
  /** Short description of what this node does */
  description: string;
  /** Icon component for visual identification */
  icon: IconComponent;
  /** Zod schema for validating configuration */
  schema: z.ZodType<TConfig>;
  /**
   * React Flow node component.
   * Uses ComponentType<any> because each node has its own props shape
   * that React Flow provides at runtime.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  /** Configuration form component */
  configForm: ComponentType<ConfigFormProps<TConfig>>;
}

/**
 * Base props for React Flow node components.
 * Each node receives data from the workflow-to-canvas transformer.
 */
export interface NodeComponentProps {
  data: {
    node: unknown;
    step?: number;
    onClick?: () => void;
    onMenuClick?: () => void;
  };
}

/**
 * Catalog entry for node selection UI.
 * Subset of NodeDefinition with only UI-relevant fields.
 */
export interface NodeCatalogEntry {
  name: string;
  type: 'trigger' | 'action';
  label: string;
  description: string;
  icon: IconComponent;
}
