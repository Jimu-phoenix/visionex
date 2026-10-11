"use client";

import { useAdminToken } from "@/lib/admin-token";
import { AdminGate } from "@/components/admin/admin-gate";
import { ProjectsEditor } from "@/components/admin/projects-editor";
import { GalleryEditor } from "@/components/admin/gallery-editor";

/**
 * Deliberately has no Nav — /admin should not be reachable from the site chrome,
 * only by typing the path. AdminGate reads the token from localStorage; the token
 * is passed down and attached to every write, which Convex verifies server-side.
 */

export default function AdminPage() {
  const token = useAdminToken();

  return (
    <AdminGate>
      <main className="px-6 pb-24 pt-32 sm:px-12 sm:pt-40">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
            Content
          </p>
          <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] font-bold uppercase tracking-tighter">
            Admin
          </h1>

          {token && (
            <div className="mt-16 space-y-20">
              <ProjectsEditor token={token} />
              <GalleryEditor token={token} />
            </div>
          )}
        </div>
      </main>
    </AdminGate>
  );
}
