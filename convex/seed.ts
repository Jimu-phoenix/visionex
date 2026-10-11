import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { assertAdmin } from "./lib/admin";

/**
 * One-time seed from the placeholder arrays that used to live in
 * src/lib/projects.ts and src/lib/gallery.ts. Run once, then this file can be
 * deleted:
 *
 *   npx convex run seed:all '{"token":"<your ADMIN_SECRET>"}'
 *
 * Safe to re-run: it clears both content tables first.
 */

const PROJECTS = [
  {
    slug: "trustledger",
    title: "TrustLedger",
    summary:
      "Financial reputation scoring for informal Malawian SMEs, started at the FINOVATE 2026 hackathon and since grown into a multi-tenant helpdesk SaaS.",
    date: "2026",
    nodeId: "N.01",
    order: 1,
    icon: "wallet",
  },
  {
    slug: "hostel-management-system",
    title: "Hostel Management System",
    summary:
      "Private hostel platform with search, tenant payment history, and an owner dashboard covering rent and monthly expenses.",
    date: "2026",
    nodeId: "N.02",
    order: 2,
    icon: "server",
  },
  {
    slug: "client-websites",
    title: "Client Websites",
    summary:
      "Business websites for local clients — marketing sites and web apps built to be handed over and maintained without me.",
    date: "2025",
    nodeId: "N.03",
    order: 3,
    icon: "layout-grid",
  },
  {
    slug: "ccna-200-301",
    title: "CCNA 200-301",
    summary:
      "Networking course for Yaza IT Malawi — routing, switching, WLAN, and practice topologies built to be taught, not just read.",
    date: "2025",
    nodeId: "N.04",
    order: 4,
    icon: "graduation-cap",
  },
  {
    slug: "three-d-work",
    title: "3D & Motion",
    summary:
      "Scenes and stills built with non-destructive modifiers and procedural materials only — no downloaded shortcuts.",
    date: "2024",
    nodeId: "N.05",
    order: 5,
    icon: "boxes",
  },
];

const SECTIONS = [
  {
    nodeId: "N.02",
    title: "Graphics",
    description:
      "Flat work — logos, brand marks, posters, and type-led pieces.",
    order: 1,
    items: [
      { nodeId: "G.01", title: "Brand marks", orientation: "square", icon: "palette" },
      { nodeId: "G.02", title: "Poster series", orientation: "portrait", icon: "file-image" },
      { nodeId: "G.03", title: "Icon sets", orientation: "square", icon: "sparkles" },
      { nodeId: "G.04", title: "Typography", orientation: "landscape", icon: "layers" },
    ],
  },
  {
    nodeId: "N.03",
    title: "Project Images",
    description:
      "Screens and mockups from the builds — interfaces, dashboards, and product shots.",
    order: 2,
    items: [
      { nodeId: "G.05", title: "TrustLedger", orientation: "landscape", icon: "briefcase" },
      { nodeId: "G.06", title: "Hostel dashboard", orientation: "landscape", icon: "image" },
      { nodeId: "G.07", title: "Interface details", orientation: "portrait", icon: "aperture" },
      { nodeId: "G.08", title: "3D scenes", orientation: "square", icon: "boxes" },
    ],
  },
  {
    nodeId: "N.04",
    title: "Personal Gallery",
    description: "Photography and life away from the screen.",
    order: 3,
    items: [
      { nodeId: "G.09", title: "Photography", orientation: "portrait", icon: "camera" },
      { nodeId: "G.10", title: "Portraits", orientation: "portrait", icon: "user" },
      { nodeId: "G.11", title: "Places", orientation: "landscape", icon: "aperture" },
    ],
  },
] as const;

export const all = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    await assertAdmin(ctx, args.token);

    const existingSections = await ctx.db.query("gallerySections").collect();
    for (const section of existingSections) await ctx.db.delete(section._id);

    const existingItems = await ctx.db.query("galleryItems").collect();
    for (const item of existingItems) await ctx.db.delete(item._id);

    const existingProjects = await ctx.db.query("projects").collect();
    for (const project of existingProjects) await ctx.db.delete(project._id);

    for (const project of PROJECTS) {
      await ctx.db.insert("projects", project);
    }

    for (const section of SECTIONS) {
      const { items, ...sectionFields } = section;
      const sectionId = await ctx.db.insert("gallerySections", sectionFields);

      for (const [index, item] of items.entries()) {
        await ctx.db.insert("galleryItems", {
          ...item,
          sectionId,
          order: index + 1,
        });
      }
    }

    return {
      projects: PROJECTS.length,
      sections: SECTIONS.length,
      items: SECTIONS.reduce((total, s) => total + s.items.length, 0),
    };
  },
});
