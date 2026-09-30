# Where the coaching files live

The coach keeps two files, `founder-profile.md` and `journey.md`, in one **coaching
folder**. Work it out before reading or writing anything, and use the same folder for both
files. All paths are relative to the project root (the folder the founder is working in).
Never write to an absolute path.

## Working out the coaching folder

Take the first of these that applies:

1. **The founder asked for a location in this request** ("keep this in docs/my-idea").
   Use it for this conversation only, unless they say to keep it (see "Changing the
   location").
2. **`.vf-founder-kit/config.yaml` sets `founder-coach.root`.** Use that folder.
3. **`.vf-founder-kit/config.yaml` sets `docs_root`.** Use `<docs_root>/founder-coach`.
4. **Otherwise**, use `docs/founder-coach`.

`.vf-founder-kit/config.yaml` is shared by all Founder Kit plugins. The keys this plugin reads:

```yaml
# .vf-founder-kit/config.yaml
docs_root: docs                  # where Founder Kit plugins keep their docs (default: docs)

founder-coach:
  root: docs/founder-coach       # optional: this plugin's folder, overriding docs_root
```

If the file exists but cannot be read, or a key has an unexpected value, say so, name the
key, and fall back to the next step rather than guessing.

## Files already somewhere else

Before creating `founder-profile.md` or `journey.md` in a coaching folder that has neither,
look for them elsewhere in the project (skip dependency and build folders such as
`node_modules`). A founder may have moved them, or set a folder on another machine.

If you find them, do not start a second copy. Tell the founder where they are and offer
two choices:

- **Move them** into the coaching folder (then confirm what moved), or
- **Keep them where they are** by recording that folder as `founder-coach.root` in
  `.vf-founder-kit/config.yaml`.

Wait for their answer before writing anything.

## Changing the location

Only create or edit `.vf-founder-kit/config.yaml` when the founder asks for a lasting change
("keep my coaching notes in docs/my-idea from now on") or chooses "keep them where they
are" above. When you do:

- keep every other key in the file exactly as it was;
- set `founder-coach.root` (or `docs_root`, if they want all Founder Kit docs moved);
- tell the founder what you wrote, and that co-founders who share the project will get the
  same setting.

Never move existing files as a side effect of changing the setting. Offer to move them.

## Other skills reading the profile

Other Founder Kit skills may read `founder-profile.md` from this folder to tailor their
advice. Only this plugin writes it.

## Telling the founder

Every response that writes files ends with the paths written or changed, relative to the
project, for example:

```
Files written:
- docs/founder-coach/founder-profile.md (created)
- docs/founder-coach/journey.md (stage 2: two criteria updated, decision logged)
```
