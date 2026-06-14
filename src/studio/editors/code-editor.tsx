import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import { Icon } from '@/ui';

import { useUxm } from '../lib/context';
import { getComponentDef } from '../lib/registry';

import type { StyleProperty } from '../lib/types';

// ── Helpers: camelCase ↔ kebab-case ──

function toKebab(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function toCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

// ── Generate CSS from resolved styles ──

function stylesToCSS(
  componentId: string,
  props: StyleProperty[],
  resolved: Record<string, string | number | boolean>,
): string {
  const lines: string[] = [];
  lines.push(`.${componentId} {`);
  for (const prop of props) {
    const val = resolved[prop.key];
    if (typeof val === 'boolean') {
      lines.push(`  ${toKebab(prop.key)}: ${val ? 'true' : 'false'};`);
    } else if (typeof val === 'number') {
      lines.push(`  ${toKebab(prop.key)}: ${val}${prop.unit ?? ''};`);
    } else {
      lines.push(`  ${toKebab(prop.key)}: ${val};`);
    }
  }
  lines.push('}');
  return lines.join('\n');
}

// ── Parse CSS back to overrides ──

const PROP_LINE_REGEX = /^\s*([\w-]+)\s*:\s*(.+?)\s*;?\s*$/;

interface ParseResult {
  /** Prop keys that parsed to a valid value, ready to apply via setOverride. */
  values: Record<string, string | number | boolean>;
  /** Prop keys for which a recognizable line exists in the code. Used by the
   *  caller to detect deletions: a key in `overrides` but not in this set was
   *  removed from the editor and should reset to its default. NB: typo'd
   *  property names (e.g. `bckground-color: red`) don't match `propMap` and
   *  therefore won't add the canonical key here — meaning a typo over an
   *  existing override will *also* trigger reset. The line-level error
   *  indicator surfaces typos so users notice before deletion fires. */
  linesByPropKey: Set<string>;
}

function parseCSS(css: string, props: StyleProperty[]): ParseResult {
  const values: Record<string, string | number | boolean> = {};
  const linesByPropKey = new Set<string>();
  const propMap = new Map(props.map((p) => [toKebab(p.key), p]));

  for (const line of css.split('\n')) {
    const m = line.match(PROP_LINE_REGEX);
    if (!m) continue;
    const [, name, rawVal] = m;
    const prop = propMap.get(name);
    if (!prop) continue;

    linesByPropKey.add(prop.key);

    if (prop.control === 'toggle') {
      values[prop.key] = rawVal === 'true';
    } else if (prop.control === 'number' || prop.control === 'slider') {
      const num = parseFloat(rawVal);
      if (!isNaN(num)) values[prop.key] = num;
    } else {
      values[prop.key] = rawVal;
    }
  }
  return { values, linesByPropKey };
}

// ── Per-line classification (used by both the highlighter and the
//    error count in the status bar) ──

type LineKind =
  | 'selector-open'      // `.component-id {`
  | 'brace-close'        // `}`
  | 'valid-prop'         // recognized prop, parseable value
  | 'unknown-prop'       // matches `name: value;` shape but name isn't in registry
  | 'invalid-value'      // recognized prop but value is wrong type (e.g. NaN for number)
  | 'decoration';        // empty line, comment, anything else (not flagged)

function classifyLine(line: string, propMap: Map<string, StyleProperty>): LineKind {
  const trimmed = line.trim();
  if (!trimmed) return 'decoration';
  if (line.match(/^(\.[a-z][\w-]*)\s*\{\s*$/)) return 'selector-open';
  if (trimmed === '}') return 'brace-close';

  const m = line.match(PROP_LINE_REGEX);
  if (!m) return 'decoration';

  const [, name, rawVal] = m;
  const prop = propMap.get(name);
  if (!prop) return 'unknown-prop';

  if (prop.control === 'number' || prop.control === 'slider') {
    if (isNaN(parseFloat(rawVal))) return 'invalid-value';
  }
  if (prop.control === 'toggle') {
    const t = rawVal.trim();
    if (t !== 'true' && t !== 'false') return 'invalid-value';
  }
  return 'valid-prop';
}

function countErrors(code: string, propMap: Map<string, StyleProperty>): number {
  let n = 0;
  for (const line of code.split('\n')) {
    const k = classifyLine(line, propMap);
    if (k === 'unknown-prop' || k === 'invalid-value') n++;
  }
  return n;
}

// ── Syntax highlighter ──

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function span(color: string, text: string): string {
  return `<span style="color:${color}">${esc(text)}</span>`;
}

function highlightLine(line: string): string {
  // Selector line: .component-name {
  const selMatch = line.match(/^(\.[a-z][\w-]*)\s*(\{)\s*$/);
  if (selMatch) {
    return span('#7dd3fc', selMatch[1]) + ' ' + span('#6b7280', selMatch[2]);
  }
  // Closing brace
  if (line.trim() === '}') {
    return span('#6b7280', '}');
  }
  // Property line:   prop-name: value;
  const propMatch = line.match(/^(\s+)([\w-]+)(\s*:\s*)(.+?)(;)\s*$/);
  if (propMatch) {
    const [, indent, prop, colon, val, semi] = propMatch;
    let coloredVal: string;
    // Hex color value
    if (/^#[0-9a-fA-F]{3,8}$/.test(val.trim())) {
      coloredVal = span('#fbbf24', val.trim());
    }
    // Number with unit
    else if (/^-?\d+(?:\.\d+)?(?:px|rem|em|%|s|ms)$/.test(val.trim())) {
      coloredVal = span('#34d399', val.trim());
    }
    // Plain number
    else if (/^-?\d+(?:\.\d+)?$/.test(val.trim())) {
      coloredVal = span('#34d399', val.trim());
    }
    // true/false
    else if (val.trim() === 'true' || val.trim() === 'false') {
      coloredVal = span('#fb923c', val.trim());
    }
    // String value
    else {
      coloredVal = span('#e5e5e5', val.trim());
    }
    return esc(indent) + span('#c084fc', prop) + esc(colon) + coloredVal + span('#6b7280', semi);
  }
  return esc(line);
}

// When a propMap is supplied, wrap unknown-prop / invalid-value lines in
// a wavy red underline so the user sees which lines won't apply. Using
// `text-decoration` rather than border-bottom so it follows wrapping
// (the textarea overlay matches char-for-char, which keeps the squiggle
// pixel-aligned with the user's actual text).
function highlightCSS(code: string, propMap?: Map<string, StyleProperty>): string {
  return code.split('\n').map((line) => {
    const colored = highlightLine(line);
    if (!propMap) return colored;
    const kind = classifyLine(line, propMap);
    if (kind === 'unknown-prop' || kind === 'invalid-value') {
      return `<span style="text-decoration: underline wavy #ef4444; text-underline-offset: 3px">${colored}</span>`;
    }
    return colored;
  }).join('\n');
}

// ── Search bar ──

function SearchBar({
  query,
  setQuery,
  matchCount,
  currentMatch,
  onNext,
  onPrev,
  onClose,
}: {
  query: string;
  setQuery: (q: string) => void;
  matchCount: number;
  currentMatch: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px',
        backgroundColor: '#2a2a2a',
        borderBottom: '1px solid #3a3a3a',
        fontSize: 12,
      }}
    >
      <Icon glyph="search" size={13} strokeWidth={1.5} style={{ color: '#d4d4d8' }} />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Find..."
        style={{
          flex: 1,
          background: '#1e1e1e',
          border: '1px solid #3a3a3a',
          borderRadius: 4,
          padding: '3px 8px',
          fontSize: 12,
          color: '#e5e5e5',
          outline: 'none',
          fontFamily: 'inherit',
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { if (e.shiftKey) onPrev(); else onNext(); }
          if (e.key === 'Escape') onClose();
        }}
      />
      {query && (
        <span style={{ color: '#d4d4d8', fontSize: 11, whiteSpace: 'nowrap' }}>
          {matchCount > 0 ? `${currentMatch + 1}/${matchCount}` : '0/0'}
        </span>
      )}
      <button onClick={onPrev} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d4d4d8', padding: 2, display: 'flex' }}>
        <Icon glyph="chevron-up" size={14} strokeWidth={2} />
      </button>
      <button onClick={onNext} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d4d4d8', padding: 2, display: 'flex' }}>
        <Icon glyph="chevron-down" size={14} strokeWidth={2} />
      </button>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d4d4d8', padding: 2, display: 'flex' }}>
        <Icon glyph="close" size={14} strokeWidth={2} />
      </button>
    </div>
  );
}

// ── Main editor ──

export function CodeEditor() {
  const { selectedId, getOverrides, setOverride, resetOverride } = useUxm();
  const def = getComponentDef(selectedId);
  const overrides = getOverrides(selectedId);

  // Memoised lookup table: kebab-cased prop name → StyleProperty.
  // Shared between parseCSS, the line classifier, and the highlighter
  // so we build it once per def change instead of per keystroke.
  const propMap = useMemo(
    () => new Map((def?.styleProperties ?? []).map((p) => [toKebab(p.key), p])),
    [def],
  );

  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMatch, setCurrentMatch] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Resolve styles
  const resolved = useMemo(() => {
    if (!def) return {};
    const styles: Record<string, string | number | boolean> = {};
    for (const prop of def.styleProperties) {
      styles[prop.key] = overrides[prop.key] ?? prop.defaultValue;
    }
    return styles;
  }, [def, overrides]);

  // Generate CSS text
  const cssText = useMemo(() => {
    if (!def) return '';
    return stylesToCSS(def.id, def.styleProperties, resolved);
  }, [def, resolved]);

  const [code, setCode] = useState(cssText);

  // Sync from visual → code when resolved styles change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional visual → code-editor text sync
    setCode(cssText);
  }, [cssText]);

  // Parse code → overrides (debounced). Also handles deletion: a
  // styleProperty currently in `overrides` whose line has disappeared
  // from the editor is reset to its default. Caveat noted on
  // `linesByPropKey` in parseCSS — typo'd property names look the
  // same to the parser as a deleted line, so editing a name into a
  // typo will *also* trigger reset. The line-error indicator
  // surfaces typos so the user notices before that happens.
  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCode(newCode);
      if (!def) return;

      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const { values, linesByPropKey } = parseCSS(newCode, def.styleProperties);

        // Apply edits
        for (const [key, value] of Object.entries(values)) {
          const current = overrides[key] ?? def.styleProperties.find((p) => p.key === key)?.defaultValue;
          if (current !== value) {
            setOverride(selectedId, key, value);
          }
        }

        // Detect deletions
        for (const prop of def.styleProperties) {
          if (prop.key in overrides && !linesByPropKey.has(prop.key)) {
            resetOverride(selectedId, prop.key);
          }
        }
      }, 300);
    },
    [def, overrides, selectedId, setOverride, resetOverride],
  );

  // Error count for the status bar — counts unknown-prop + invalid-value
  // lines so the user sees at a glance how many lines won't apply.
  const errorCount = useMemo(() => countErrors(code, propMap), [code, propMap]);

  // Sync scrolling between textarea and pre
  const handleScroll = useCallback(() => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Search match positions
  const searchMatches = useMemo(() => {
    if (!searchQuery) return [];
    const matches: number[] = [];
    const lower = code.toLowerCase();
    const q = searchQuery.toLowerCase();
    let idx = 0;
    while ((idx = lower.indexOf(q, idx)) !== -1) {
      matches.push(idx);
      idx += q.length;
    }
    return matches;
  }, [code, searchQuery]);

  // Highlighted code with search matches
  const highlighted = useMemo(() => {
    if (!searchQuery || searchMatches.length === 0) {
      return highlightCSS(code, propMap);
    }
    // Insert markers in raw code, then highlight CSS, then convert markers to <mark>
    const q = searchQuery;
    const parts: string[] = [];
    let last = 0;
    for (const idx of searchMatches) {
      parts.push(code.slice(last, idx));
      parts.push('\x01' + code.slice(idx, idx + q.length) + '\x02');
      last = idx + q.length;
    }
    parts.push(code.slice(last));
    const marked = parts.join('');
    let html = highlightCSS(marked, propMap);
    // eslint-disable-next-line no-control-regex -- \x01/\x02 are internal sentinels marking search-highlight spans
    html = html.replace(/\x01/g, '<mark style="background:#fbbf2480;color:#fbbf24;border-radius:2px">');
    // eslint-disable-next-line no-control-regex -- matching sentinel for highlight-span close
    html = html.replace(/\x02/g, '</mark>');
    return html;
  }, [code, searchQuery, searchMatches, propMap]);

  const lines = code.split('\n');

  if (!def) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#1e1e1e',
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid #2a2a2a',
      }}
    >
      {/* Search */}
      {searchOpen && (
        <SearchBar
          query={searchQuery}
          setQuery={(q) => { setSearchQuery(q); setCurrentMatch(0); }}
          matchCount={searchMatches.length}
          currentMatch={currentMatch}
          onNext={() => setCurrentMatch((c) => (c + 1) % Math.max(1, searchMatches.length))}
          onPrev={() => setCurrentMatch((c) => (c - 1 + searchMatches.length) % Math.max(1, searchMatches.length))}
          onClose={() => { setSearchOpen(false); setSearchQuery(''); }}
        />
      )}

      {/* Editor area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Line numbers */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 40,
            backgroundColor: '#1a1a1a',
            borderRight: '1px solid #2a2a2a',
            zIndex: 2,
            overflow: 'hidden',
            paddingTop: 12,
          }}
        >
          {lines.map((_, i) => (
            <div
              key={i}
              style={{
                height: 20,
                lineHeight: '20px',
                textAlign: 'right',
                paddingRight: 8,
                fontSize: 11,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                color: '#a1a1aa',
                userSelect: 'none',
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Highlighted overlay */}
        <pre
          ref={preRef}
          aria-hidden
          style={{
            position: 'absolute',
            left: 40,
            top: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            padding: '12px 12px 12px 12px',
            fontSize: 12,
            lineHeight: '20px',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            color: '#e5e5e5',
            overflow: 'auto',
            whiteSpace: 'pre',
            pointerEvents: 'none',
            zIndex: 1,
          }}
          dangerouslySetInnerHTML={{ __html: highlighted + '\n' }}
        />

        {/* Textarea (actual editable layer) */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          onScroll={handleScroll}
          spellCheck={false}
          style={{
            position: 'absolute',
            left: 40,
            top: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            padding: '12px 12px 12px 12px',
            fontSize: 12,
            lineHeight: '20px',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            color: 'transparent',
            caretColor: '#e5e5e5',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            overflow: 'auto',
            whiteSpace: 'pre',
            zIndex: 3,
            WebkitTextFillColor: 'transparent',
          }}
        />
      </div>

      {/* Status bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 12px',
          borderTop: '1px solid #2a2a2a',
          backgroundColor: '#1a1a1a',
          fontSize: 10,
          color: '#a1a1aa',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>{lines.length} lines</span>
          {errorCount > 0 && (
            <span
              style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#ef4444' }}
              title="Lines that don't match a known property name or have an invalid value type. They won't be applied — the override stays unchanged. Hover the line in the editor to see the squiggle."
            >
              <Icon glyph="exclamation-triangle" size={10} strokeWidth={2} />
              {errorCount} {errorCount === 1 ? 'error' : 'errors'}
            </span>
          )}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: searchOpen ? '#7dd3fc' : '#4a4a4a',
              fontSize: 10,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Icon glyph="search" size={10} strokeWidth={2} />
            {navigator.platform?.includes('Mac') ? '⌘F' : 'Ctrl+F'}
          </button>
          <span>CSS</span>
        </span>
      </div>
    </div>
  );
}
