import type { ComponentDef } from '../../types';

export const inlineFilterDef: ComponentDef = {
  id: 'inline-filter',
  name: 'Inline Filters',
  category: 'Composite',
  description: "Horizontal filter bar — three slots (search / filters / trailing). The filters slot accepts <Chip mode=\"filter\"> from the consumer; chip theming lives on the Chip atom's registry, not here. This shell is layout-only.",
  styleProperties: [
    // Layout-only. The chip-shape knobs that used to live here
    // (chipBg, chipActiveBg, chipText, chipActiveText, plus
    // borderRadius / fontSize / paddingX / paddingY) have moved to
    // the Chip atom — the shell shouldn't claim theming responsibility
    // for what its consumers slot in.
    { key: 'gap', label: 'Slot Gap', control: 'number', defaultValue: 12, min: 4, max: 32, step: 2, unit: 'px' },
  ],
  layoutVariants: [],
};
