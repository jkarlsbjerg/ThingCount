# Thing Count

## Getting a new version onto the phone

After a push to GitHub Pages, the installed app on the phone picks up the new version with pull-to-refresh: scroll to the top of the app and drag down. No need to close and reopen the app.

## Changing squares: always add a data version update

`INITIAL_DATA` in `index.html` only applies to a fresh start. The phone keeps its own saved copy (localStorage), so any change to squares (added, removed, renamed, renumbered, regrouped, recolored) also needs a one-time migration, or the phone won't see it.

Whenever squares change, including in the user's own manual edits of `index.html`, do this without asking:

- Add the next entry to `MIGRATIONS` and bump `DATA_VERSION` to match.
- Match squares by `id`, never by name. IDs must stay unique and unchanged (counts and undo history hang on them); a new square needs an unused ID.
- Don't overwrite hand edits made in the app: only rename a square whose name text (ignoring the number) still matches, and only recolor/regroup one that still has the old value.
- Test before committing: fresh start, saved data from the last pushed version, and a hand-edited square.
