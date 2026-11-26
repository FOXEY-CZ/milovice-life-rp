# Local preview launcher — developer use only

After creating the unapproved local-library stage with the existing builder, run `node scripts/serve-local-preview.mjs <staged-directory> 8080` from the repository. Open `http://127.0.0.1:8080/` in your browser and stop with Ctrl+C. Works without additional server dependencies, requires Node.js and the existing candidate directory. No browser launch, no installer, no public artifact or release approval. A different port can be passed explicitly (0 selects a free port; use the printed URL).

Server binds only IPv4 loopback, serves a fixed inventory of regular stage files, refuses hidden entries and symlinks, validates Host, denies traversal and non-GET/HEAD methods, and does not list directories. This is a local development helper, not a production server or a sandbox for concurrently modified files. Browser checks continue to block remote requests separately. The new HTTP fixture test and the existing desktop and wider local-only workflows exercise the launcher. CI pending.

Baseline #175 exact candidate fc54e51, run 45895460872: all nine scenarios PASS, 2960 requests, zero remote attempts, GLB, HTTP errors, failures, pending, redirects or page errors. 9/9 PR PASS; prior main 5/5 including Pages 45895390131. Not proof for physical phones or every gameplay feature.
