import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  Banner,
  DetailSection,
  ErrorPage,
  LifecycleNodeCard,
  MetaRow,
  PageHeader,
  SideFlexpane,
  StatCard,
  TimelineEntry,
  TypeOverviewCard,
} from '@/ui';

import type { ReactElement } from 'react';

/**
 * Slots typed `ReactNode` take block content. A `MetaRow` (a `<div>`) is the
 * natural thing to put in a meta or subtitle line, and a `<div>` inside a
 * `<p>` is the one nesting the HTML parser breaks apart, so React warns about
 * hydration (viax-io/uxm#209). React's dev nesting check runs in jsdom too, so
 * a slot rendered in a `<p>` fails here.
 */
const row = () => (
  <MetaRow>
    <span>Order</span>
    <span>B8D0YA1EOAUABUN</span>
  </MetaRow>
);

const cases: Array<[string, () => ReactElement]> = [
  ['PageHeader meta', () => <PageHeader title="Order" meta={row()} />],
  ['TimelineEntry meta', () => <TimelineEntry title="Created" meta={row()} />],
  ['DetailSection subtitle', () => <DetailSection title="Details" subtitle={row()} />],
  ['SideFlexpane eyebrow', () => <SideFlexpane title="Order" eyebrow={row()} />],
  ['SideFlexpane subtitle', () => <SideFlexpane title="Order" subtitle={row()} />],
  ['Banner title', () => <Banner title={row()} />],
  ['ErrorPage code', () => <ErrorPage title="Not found" code={row()} />],
  ['ErrorPage message', () => <ErrorPage title="Not found" message={row()} />],
  ['StatCard label', () => <StatCard label={row()} value="12" />],
  ['TypeOverviewCard label', () => <TypeOverviewCard label={row()} value="12" />],
  ['TypeOverviewCard value', () => <TypeOverviewCard label="Orders" value={row()} />],
  ['LifecycleNodeCard kindLabel', () => <LifecycleNodeCard kind="state" kindLabel={row()} title="In cart" />],
  ['LifecycleNodeCard title', () => <LifecycleNodeCard kind="state" title={row()} />],
];

afterEach(() => {
  vi.restoreAllMocks();
});

describe('text slots that take ReactNode', () => {
  it.each(cases)('%s takes a MetaRow without a nesting warning', (_name, ui) => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(ui());
    const nesting = error.mock.calls.filter((args) => String(args[0]).includes('cannot be a descendant of'));
    expect(nesting).toEqual([]);
    expect(container.querySelector('p .uxm-meta-row')).toBeNull();
    expect(container.querySelector('.uxm-meta-row')).not.toBeNull();
  });
});
