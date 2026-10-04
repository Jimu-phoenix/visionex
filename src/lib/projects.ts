/**
 * Project data. Placeholder entries for now — these get replaced by a CMS or
 * database call later, so nothing outside this file should hard-code a project.
 *
 * `image` is optional: entries without one fall back to `icon` (a lucide
 * component) rendered on the tinted panel, so every card has a visual slot even
 * before real screenshots exist.
 *
 * `href` is optional too. Omit it for a project that is not linked out yet and
 * the card renders as a static tile rather than a link.
 */

import type { LucideIcon } from "lucide-react";
import { Boxes, GraduationCap, LayoutGrid, Server, Wallet } from "lucide-react";

export type Project = {
  slug: string;
  title: string;
  /** Short summary for the card. Keep to a sentence or two. */
  summary: string;
  /** ISO-ish display date, e.g. "2026" or "Mar 2026". */
  date: string;
  image?: string;
  icon?: LucideIcon;
  href?: string;
  /** Node number shown in mono above the title, matching the home grid. */
  id: string;
};

export const PROJECTS: Project[] = [
  {
    id: "N.01",
    slug: "trustledger",
    title: "TrustLedger",
    summary:
      "Financial reputation scoring for informal Malawian SMEs, started at the FINOVATE 2026 hackathon and since grown into a multi-tenant helpdesk SaaS.",
    date: "2026",
    icon: Wallet,
  },
  {
    id: "N.02",
    slug: "hostel-management-system",
    title: "Hostel Management System",
    summary:
      "Private hostel platform with search, tenant payment history, and an owner dashboard covering rent and monthly expenses.",
    date: "2026",
    icon: Server,
  },
  {
    id: "N.03",
    slug: "client-websites",
    title: "Client Websites",
    summary:
      "Business websites for local clients — marketing sites and web apps built to be handed over and maintained without me.",
    date: "2025",
    icon: LayoutGrid,
  },
  {
    id: "N.04",
    slug: "ccna-200-301",
    title: "CCNA 200-301",
    summary:
      "Networking course for Yaza IT Malawi — routing, switching, WLAN, and practice topologies built to be taught, not just read.",
    date: "2025",
    icon: GraduationCap,
  },
  {
    id: "N.05",
    slug: "three-d-work",
    title: "3D & Motion",
    summary:
      "Scenes and stills built with non-destructive modifiers and procedural materials only — no downloaded shortcuts.",
    date: "2024",
    icon: Boxes,
  },
];