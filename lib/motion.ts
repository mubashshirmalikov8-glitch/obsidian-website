/**
 * Design System v2 — shared motion easing tokens (JS side).
 *
 * Mirrors the CSS `--ease-*` custom properties for use with Framer Motion,
 * where easing must be supplied as a cubic-bezier array rather than a CSS var.
 * Import these instead of redefining the curve inline per component.
 */
export const EASE_REVEAL = [0.16, 1, 0.3, 1] as const; // signature entrance
export const EASE_STANDARD = [0.4, 0, 0.2, 1] as const; // hover / state
