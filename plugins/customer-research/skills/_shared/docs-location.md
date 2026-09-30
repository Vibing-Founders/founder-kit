# Where customer research lives

Every skill in this plugin reads and writes files in one **research folder**. Work it out
before reading or writing anything, and use the same folder for every file in the task.
All paths are relative to the project root (the folder the founder is working in). Never
write to an absolute path.

## Working out the research folder

Take the first of these that applies:

1. **The founder asked for a location in this request** ("save this in docs/sideways").
   Use it for this task only, unless they say to keep it (see "Changing the location").
2. **`.vf-founder-kit/config.yaml` sets `customer-research.root`.** Use that folder.
3. **`.vf-founder-kit/config.yaml` sets `docs_root`.** Use `<docs_root>/customer-research`.
4. **Otherwise**, use `docs/customer-research`.

`.vf-founder-kit/config.yaml` is shared by all Founder Kit plugins. The keys this plugin reads:

```yaml
# .vf-founder-kit/config.yaml
docs_root: docs                  # where Founder Kit plugins keep their docs (default: docs)

customer-research:
  root: docs/customer-research   # optional: this plugin's folder, overriding docs_root
```

If the file exists but cannot be read, or a key has an unexpected value, say so, name the
key, and fall back to the next step rather than guessing.

## Research already somewhere else

Before writing to a research folder that has no `ideal-customer-profile.md` yet, look for
one elsewhere in the project (skip dependency and build folders such as `node_modules`).
Older versions of this plugin wrote to `customer-research/` in the project root.

If you find one, do not start a second profile. Tell the founder where the existing
research is and offer two choices:

- **Move it** into the research folder (keep the folder structure, then confirm what moved), or
- **Keep it where it is** by recording that folder as `customer-research.root` in
  `.vf-founder-kit/config.yaml`.

Wait for their answer before writing anything.

## Changing the location

Only create or edit `.vf-founder-kit/config.yaml` when the founder asks for a lasting change
("keep my research in docs/sideways from now on") or chooses "keep it where it is" above.
When you do:

- keep every other key in the file exactly as it was;
- set `customer-research.root` (or `docs_root`, if they want all Founder Kit docs moved);
- tell the founder what you wrote, and that co-founders who share the project will get the
  same setting.

Never move existing files as a side effect of changing the setting. Offer to move them.

## Telling the founder

Every response that writes files ends with the paths written or changed, relative to the
project, for example:

```
Files written:
- docs/customer-research/interviews/imogen-2026-05-12/analysis.md
- docs/customer-research/ideal-customer-profile.md (updated to v0.3)
```
