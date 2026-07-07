
import { appDefs } from './app';
import { buttonsDefs } from './buttons';
import { compositeDefs } from './composite';
import { diagramDefs } from './diagram';
import { displayDefs } from './display';
import { feedbackDefs } from './feedback';
import { formsDefs } from './forms';
import { iconsDefs } from './icons';
import { inputsDefs } from './inputs';
import { layoutDefs } from './layout';

import type { Category, ComponentDef } from '../types';

export const categories: Category[] = ['App', 'Buttons', 'Inputs', 'Display', 'Feedback', 'Forms', 'Composite', 'Layout', 'Diagram', 'Icons'];

export const categoryColors: Record<Category, string> = {
  App: 'var(--color-text)',
  Buttons: 'var(--color-accent)',
  Inputs: 'var(--color-accent-light)',
  Display: 'var(--color-highlight-warm)',
  Feedback: 'var(--color-highlight-cool)',
  Forms: 'var(--color-accent-bold)',
  Composite: 'var(--color-category-composite)',
  Layout: 'var(--color-text-subtle)',
  Diagram: 'var(--color-category-diagram)',
  Icons: 'var(--color-text-muted)',
};

// Flat registry, assembled from the per-category files in their original order
// (so component ordering — and the sidebar that reads it — is unchanged).
export const registry: ComponentDef[] = [
  ...appDefs,
  ...buttonsDefs,
  ...inputsDefs,
  ...displayDefs,
  ...feedbackDefs,
  ...formsDefs,
  ...layoutDefs,
  ...compositeDefs,
  ...diagramDefs,
  ...iconsDefs,
];

export function getComponentDef(id: string): ComponentDef | undefined {
  return registry.find((c) => c.id === id);
}

export function getComponentsByCategory(): Record<Category, ComponentDef[]> {
  const result: Record<Category, ComponentDef[]> = {
    App: [],
    Buttons: [],
    Inputs: [],
    Display: [],
    Feedback: [],
    Forms: [],
    Composite: [],
    Layout: [],
    Diagram: [],
    Icons: [],
  };
  for (const def of registry) {
    result[def.category].push(def);
  }
  return result;
}
