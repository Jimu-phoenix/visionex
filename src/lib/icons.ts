/**
 * Icon registry.
 *
 * Convex stores `icon` as a string name, because a lucide component is a
 * function and cannot be serialised into the database. This map is the one place
 * a name becomes a component, shared by the pages and the admin dropdown.
 *
 * To add an icon: import it from lucide-react, add a kebab-case key, and it
 * becomes selectable in /admin.
 */

import {
  Aperture,
  ArrowUpRight,
  Boxes,
  Briefcase,
  Camera,
  FileImage,
  GraduationCap,
  ImageIcon,
  Layers,
  LayoutGrid,
  Palette,
  Server,
  Sparkles,
  User,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export const ICONS = {
  "arrow-up-right": ArrowUpRight,
  aperture: Aperture,
  boxes: Boxes,
  briefcase: Briefcase,
  camera: Camera,
  "file-image": FileImage,
  "graduation-cap": GraduationCap,
  image: ImageIcon,
  layers: Layers,
  "layout-grid": LayoutGrid,
  palette: Palette,
  server: Server,
  sparkles: Sparkles,
  user: User,
  wallet: Wallet,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

/** Names in dropdown order. */
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

/**
 * Used when a row has no icon or an unrecognised one, so a bad value in the
 * database degrades to a sensible glyph instead of throwing on a live page.
 *
 * Note for render components: look the icon up with a plain map access —
 * `ICONS[name as IconName] ?? ICON_FALLBACK` — rather than calling a resolver
 * function. The React Compiler treats calling a function that returns a
 * component during render as creating a component on every pass
 * (react-hooks: "Cannot create components during render").
 */
export const ICON_FALLBACK: LucideIcon = ArrowUpRight;
