import { Icon, IconButton } from '@/ui';

/**
 * Sample hover-revealed row actions (edit / delete) shared by the tree-row
 * previews (`SegmentRow`, `ComponentRow`), so the demo stays in one
 * place. A static element is fine to reuse across multiple rows — it's an
 * immutable element description, not shared mutable state.
 */
export const DemoRowActions = (
  <>
    <IconButton aria-label="Edit">
      <Icon glyph="pencil" size={14} />
    </IconButton>
    <IconButton aria-label="Delete">
      <Icon glyph="trash" size={14} />
    </IconButton>
  </>
);
