# Marketplaces and two-sided businesses

A marketplace serves two (or more) groups who find each other through it. Each side has
different pains, different reasons to join and a different idea of success, so one
profile cannot describe both.

## Detecting a marketplace

Look for:

- two distinct kinds of customer who interact through the product (people booking and
  people being booked, buyers and sellers, clients and freelancers, hosts and guests);
- value that depends on the other side being there ("I'd only join if there were enough
  local tutors");
- interviews where some people talk about supplying something and others about using it.

If you detect a marketplace, say so, name the sides, and give the evidence. If only one
side has been interviewed so far, still set up both files and mark the other side's file
as having no evidence yet, with research gaps listing who to talk to.

## Files

```
docs/customer-research/                      # or your configured research folder
  ideal-customer-profile.md                  # master
  ideal-customer-profile-<segment>.md        # one per side, e.g. -dog-owners, -walkers
```

Segment names are short, plain and lowercase with hyphens, named after who the people
are (`-dog-owners`, `-dog-walkers`), not "side-a" or "supply".

### Master file

- Header and version log (see `file-conventions.md`)
- Overview: what the marketplace connects, the sides, links to each segment file
- Shared characteristics across sides (only if evidenced)
- **Cross-side pain points**: problems that affect the whole marketplace, such as trust
  between strangers or no-shows, with quotes from each side and `Possible Solutions`
- Signs the marketplace is healthy, in customers' words
- Research gaps across sides

### Segment file

- Header and version log, with a link back to the master file
- Who this side is and their role in the marketplace
- Full B2B or B2C structure for this side (sides can differ: dog owners are B2C, a dog
  walking business may be B2B)
- Pain points specific to this side, with quotes and `Possible Solutions`
- How this side relates to the other side(s), with links
- Buyer personas, negative personas and qualifying questions for this side
- Research gaps for this side

## Where each pain point goes

- Felt by one side only → that side's segment file.
- Felt by both sides, or about the connection between them → master file.
- Never in both places. If unsure, put it in the master file and link to it from the
  segment files.

## Qualifying questions

Include a first question that tells which side someone is on, then the persona
questions for that side.

## Reporting

After an analysis, list which files changed and which side the conversation informed.
If one side has far fewer conversations than the other, say so: a lopsided evidence base
is a common reason marketplaces misjudge one side.
