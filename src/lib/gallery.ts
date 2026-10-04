/**
 * Gallery data. Placeholder entries — same intent as @/lib/projects: this is
 * the only file that should know what a gallery item looks like, so the source
 * can move to a CMS or database without touching the page.
 *
 * `image` is optional; items without one fall back to `icon` on the tinted
 * panel. `orientation` sets the tile aspect so mixed portrait/landscape batches
 * still lay out on a clean grid.
 */

import type { LucideIcon } from "lucide-react";
import {
  Aperture,
  Boxes,
  Briefcase,
  Camera,
  FileImage,
  ImageIcon,
  Layers,
  Palette,
  Sparkles,
  User,
} from "lucide-react";

export type GalleryItem = {
  id: string;
  title: string;
  /** Optional — omit for image-only tiles. */
  caption?: string;
  image?: string;
  icon?: LucideIcon;
  orientation: "portrait" | "landscape" | "square";
};

export type GallerySection = {
  id: string;
  title: string;
  description: string;
  items: GalleryItem[];
};

export const GALLERY: GallerySection[] = [
  {
    id: "N.02",
    title: "Graphics",
    description:
      "Flat work — logos, brand marks, posters, and type-led pieces.",
    items: [
      {
        id: "G.01",
        title: "Brand marks",
        orientation: "square",
        icon: Palette,
      },
      {
        id: "G.02",
        title: "Poster series",
        orientation: "portrait",
        icon: FileImage,
      },
      {
        id: "G.03",
        title: "Icon sets",
        orientation: "square",
        icon: Sparkles,
      },
      {
        id: "G.04",
        title: "Typography",
        orientation: "landscape",
        icon: Layers,
      },
    ],
  },
  {
    id: "N.03",
    title: "Project Images",
    description:
      "Screens and mockups from the builds — interfaces, dashboards, and product shots.",
    items: [
      {
        id: "G.05",
        title: "TrustLedger",
        orientation: "landscape",
        icon: Briefcase,
      },
      {
        id: "G.06",
        title: "Hostel dashboard",
        orientation: "landscape",
        icon: ImageIcon,
      },
      {
        id: "G.07",
        title: "Interface details",
        orientation: "portrait",
        icon: Aperture,
      },
      {
        id: "G.08",
        title: "3D scenes",
        orientation: "square",
        icon: Boxes,
      },
    ],
  },
  {
    id: "N.04",
    title: "Personal Gallery",
    description: "Photography and life away from the screen.",
    items: [
      {
        id: "G.09",
        title: "Photography",
        orientation: "portrait",
        icon: Camera,
      },
      {
        id: "G.10",
        title: "Portraits",
        orientation: "portrait",
        icon: User,
      },
      {
        id: "G.11",
        title: "Places",
        orientation: "landscape",
        icon: Aperture,
      },
    ],
  },
];