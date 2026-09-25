---
name: Vite dependency cache
description: A workspace-specific issue where Vite kept prebundled dependencies from the previous React catalog version.
---

When React or another core dependency changes version, Vite may continue serving an old prebundled copy from the artifact's `node_modules/.vite` directory even after installation succeeds. Clear that artifact cache and restart its workflow before diagnosing a remaining version-mismatch overlay.

**Why:** The preview reported React 19.1.4 versus react-dom 19.1.0 even though both packages resolved to 19.1.4; the stale optimizer metadata was the cause.

**How to apply:** If package resolution and typechecks agree but the browser reports a dependency version mismatch, remove the affected artifact's Vite optimizer cache and restart the workflow once.