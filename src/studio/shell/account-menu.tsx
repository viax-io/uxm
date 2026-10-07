import { useEffect, useRef, useState } from 'react';

import {
  Avatar,
  Dialog,
  Disclosure,
  Icon,
  IconButton,
  IconTile,
  Menu,
  Select,
  SideFlexpane,
} from '@/ui';
import type { MenuEntry } from '@/ui';

import { useUxm, type ThemeMode } from '../lib/context';

import type { ReactNode } from 'react';

/**
 * The signed-in user, as the host knows them. The studio has no session of its
 * own and never fetches one — pass this and the account menu appears, omit it
 * and the header is exactly what it was.
 */
export interface StudioAccount {
  /** Display name, shown as the menu's identity headline and the pane title. */
  name: string;
  /** Shown under the name, and offered as a `mailto:` + copy row in Profile. */
  email: string;
  /** Free text — "Administrator", "Designer". Rendered verbatim. */
  role?: string;
  /** Auth realm / tenant / workspace, when the host has a meaningful one. */
  realm?: string;
  /**
   * Avatar initials. Derived from `name` when omitted — first letter of the
   * first and last word, which is right for "Ada Lovelace" and harmless for
   * a single word.
   */
  initials?: string;
  /**
   * Sign-out handler. The "Log out" row only renders when this is given,
   * because a studio with no way to end a session should not offer to.
   */
  onSignOut?: () => void;
}

/**
 * "Ada Lovelace" → "AL"; "ada" → "A".
 *
 * Indexed by code POINT, not code unit: `name[0]` on an astral first character
 * (an emoji, or any character outside the BMP) returns half a surrogate pair
 * and renders as a replacement glyph.
 */
function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const head = (w: string) => [...w][0] ?? '';
  const first = head(parts[0]);
  const last = parts.length > 1 ? head(parts[parts.length - 1]) : '';
  return (first + last).toUpperCase();
}

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto · match time of day' },
];

/** One read-only label/value row inside a settings section. */
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-2 min-w-0">
      <span className="w-28 flex-shrink-0 text-[13px] text-text-muted pt-0.5">{label}</span>
      <span className="flex-1 min-w-0 text-[13px] text-text-strong">{children}</span>
    </div>
  );
}

/**
 * A value with a copy button, used for the email. `navigator.clipboard` is
 * absent on insecure origins and can reject even where it exists, so the
 * button reports what actually happened rather than assuming success.
 */
function CopyableValue({ label, value, href }: { label: string; value: string; href?: string }) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | undefined>(undefined);
  // The pane can be dismissed (Escape, backdrop) inside the 1.5s window.
  useEffect(() => () => window.clearTimeout(resetTimer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable or denied — leave the label unchanged */
    }
  };
  return (
    <span className="inline-flex items-center gap-1.5 min-w-0 max-w-full">
      {href ? (
        <a href={href} className="truncate text-accent-bold hover:underline">
          {value}
        </a>
      ) : (
        <span className="truncate">{value}</span>
      )}
      <IconButton
        aria-label={copied ? `${label} copied` : `Copy ${label.toLowerCase()}`}
        title={copied ? 'Copied' : `Copy ${label.toLowerCase()}`}
        onClick={copy}
      >
        <Icon glyph={copied ? 'check' : 'copy'} size={14} />
      </IconButton>
    </span>
  );
}

/** A collapsible settings section — the shipped Disclosure plus its body. */
function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border last:border-b-0">
      <Disclosure label={title} open={open} onOpenChange={setOpen} />
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

/**
 * The account settings pane — the shipped `SideFlexpane` hosted inside the
 * shipped `Dialog`, which is where the backdrop, scroll lock, focus trap,
 * Escape and outside-click dismissal come from. Nothing here is hand-rolled;
 * the only local work is docking the panel against the right edge, since
 * Dialog centres by default.
 */
function AccountSettingsPane({
  account,
  embed,
  onClose,
}: {
  account: StudioAccount;
  embed: boolean;
  onClose: () => void;
}) {
  const { themeMode, setThemeMode, theme } = useUxm();

  // Lift the popover tier for the lifetime of this pane only — see the
  // `body.uxm-studio-pane-open` rule in studio-shell.css for why it is scoped
  // here rather than declared at :root. Without it the Theme dropdown opens
  // BEHIND the dialog and cannot be clicked.
  useEffect(() => {
    document.body.classList.add('uxm-studio-pane-open');
    return () => document.body.classList.remove('uxm-studio-pane-open');
  }, []);

  return (
    <Dialog open onOpenChange={(next) => { if (!next) onClose(); }} className="uxm-studio-account-dialog">
      <SideFlexpane
        title={account.name}
        subtitle="Account settings"
        icon={
          <IconTile size={40}>
            <Icon glyph="user" size={20} />
          </IconTile>
        }
        onClose={onClose}
        resizable
        minWidth={420}
        maxWidth={840}
      >
        <Section title="Profile">
          <Field label="Name">{account.name}</Field>
          <Field label="Email">
            <CopyableValue label="Email" value={account.email} href={`mailto:${account.email}`} />
          </Field>
          {account.role && <Field label="Role">{account.role}</Field>}
          {account.realm && <Field label="Realm">{account.realm}</Field>}
        </Section>

        {/* Appearance is omitted when embedded: `UxmApp` mounts ThemeSync only
            when standalone, so in embed mode this control would write context
            state and localStorage while nothing repainted — and the "showing
            the X theme" line would then be plainly false. An embedded host
            owns its own theme control, which is the same reason the canvas
            hides its light/dark toggle there. */}
        {!embed && (
        <Section title="Appearance">
          <Field label="Theme">
            <Select
              value={themeMode}
              aria-label="Theme"
              onChange={(e) => setThemeMode(e.currentTarget.value as ThemeMode)}
            >
              {THEME_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          {themeMode === 'auto' && (
            <p className="pt-1 text-[12px] text-text-muted">
              Auto is on — showing the {theme} theme for the current time of day.
            </p>
          )}
        </Section>
        )}
      </SideFlexpane>
    </Dialog>
  );
}

/**
 * Avatar → account menu, plus the settings pane it opens. Mirrors the shape
 * modo settled on: a non-interactive identity header, then the actions.
 *
 * The theme lives in the pane under Appearance rather than in this menu, so
 * there is one place to change it — the canvas keeps its own light/dark
 * IconButton as the quick toggle, exactly as modo keeps a sun/moon button in
 * the top bar beside this.
 */
export function AccountMenu({ account, embed = false }: { account: StudioAccount; embed?: boolean }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const triggerRef = useRef<HTMLSpanElement | null>(null);

  /**
   * Send focus back to the avatar when the pane closes.
   *
   * Dialog's `useFocusOnMount` restore runs only when its `active` flips to
   * false. The pane is mounted conditionally with `<Dialog open>` hard-coded,
   * so `active` never flips — the whole subtree just unmounts and the restore
   * effect never runs at all. Focus therefore lands on <body>. (Even if it did
   * run, the element it captured is the "Account settings" menu row, gone by
   * then.) Either way the composition has to name its own return target rather
   * than leave a keyboard user at the top of the document.
   */
  const closeSettings = () => {
    setSettingsOpen(false);
    triggerRef.current?.querySelector<HTMLElement>('[role="button"]')?.focus();
  };

  const items: MenuEntry[] = [
    // A disabled two-line row as the identity header: not an action, so it must
    // not be focusable or selectable.
    { key: 'identity', disabled: true, label: account.name, subtitle: account.email },
    { separator: true, key: 'sep-account' },
    {
      key: 'settings',
      label: 'Account settings',
      icon: 'cog-6-tooth',
      onSelect: () => setSettingsOpen(true),
    },
    ...(account.onSignOut
      ? [
          {
            key: 'logout',
            label: 'Log out',
            icon: 'arrow-right-start-on-rectangle',
            onSelect: account.onSignOut,
          },
        ]
      : []),
  ];

  return (
    <>
      <Menu
        items={items}
        placement="bottom-end"
        aria-label="Account"
        renderTrigger={({ triggerProps }) => {
          // Menu's `ref` goes straight onto Avatar (which spreads rest onto its
          // own span), and the wrapper carries a plain ref object of our own.
          // The earlier version merged both into an inline callback on the
          // wrapper — a fresh function every render, which is exactly the
          // null-then-node churn Menu memoises its triggerProps to avoid, and
          // which Popover reads while positioning.
          return (
            <span ref={triggerRef} className="inline-flex">
              <Avatar
                type="text"
                // `||` not `??`: an empty string is "not supplied", and `??`
                // would let it through and paint a blank avatar.
                initials={account.initials || initialsFrom(account.name)}
                role="button"
                tabIndex={0}
                aria-label="Account"
                {...triggerProps}
              />
            </span>
          );
        }}
      />
      {settingsOpen && (
        <AccountSettingsPane account={account} embed={embed} onClose={closeSettings} />
      )}
    </>
  );
}
