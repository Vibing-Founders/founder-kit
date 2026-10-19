# Where compliance reports live

Skills in this plugin that save a report write it to one **compliance folder**. Work it out
before writing anything, and use the same folder for every file in the task. All paths are
relative to the project root (the folder the founder is working in). Never write to an absolute
path.

## Working out the compliance folder

Take the first of these that applies:

1. **The founder asked for a location in this request** ("save this in docs/security").
   Use it for this task only, unless they say to keep it (see "Changing the location").
2. **`.vf-founder-kit/config.yaml` sets `compliance.root`.** Use that folder.
3. **`.vf-founder-kit/config.yaml` sets `docs_root`.** Use `<docs_root>/compliance`.
4. **Otherwise**, use `docs/compliance`.

`.vf-founder-kit/config.yaml` is shared by all Founder Kit plugins. The keys this plugin reads:

```yaml
# .vf-founder-kit/config.yaml
docs_root: docs              # where Founder Kit plugins keep their docs (default: docs)

compliance:
  root: docs/compliance      # optional: this plugin's folder, overriding docs_root
```

If the file exists but cannot be read, or a key has an unexpected value, say so, name the key,
and fall back to the next step rather than guessing.

Create the folder if it does not exist. If a report with the same name already exists (the check
was run twice in one day), add a suffix (`supabase-rls-2026-10-19-2.md`) rather than overwriting
it.

## Changing the location

Only create or edit `.vf-founder-kit/config.yaml` when the founder asks for a lasting change
("keep compliance reports in docs/security from now on"). When you do:

- keep every other key and section in the file exactly as it was;
- set `compliance.root` (or `docs_root`, if they want all Founder Kit docs moved);
- tell the founder what you wrote, and that co-founders who share the project will get the same
  setting.

Never move existing files as a side effect of changing the setting. Offer to move them.

## Telling the founder

Every response that writes files ends with the paths written, relative to the project, for
example:

```
Report saved:
- docs/compliance/supabase-rls-2026-10-19.md
```
