BMAD setup and safe install instructions
=====================================

This file documents a safe, reproducible way to install and run the `bmad-method` tooling
for this repository. It assumes you're using zsh on macOS and are at the project root:
`/Users/timquattrochi/Projects/rBuddy-v1`.

1) Safety first — create a branch or commit your work

```bash
# from the project root
git status --porcelain
git add -A
git commit -m "WIP: save work before BMAD init" || true
git checkout -b bmad-init || git switch -c bmad-init
```

2) Preview the `bmad-method` CLI before running

```bash
# show help/version without installing globally
npx -p bmad-method bmad-method --help
npx -p bmad-method bmad-method --version
```

3) Install `bmad-method` as a devDependency (recommended)

```bash
cd /Users/timquattrochi/Projects/rBuddy-v1
npm install --save-dev bmad-method

# then run the project's init (interactive)
npx bmad-method init
```

Notes:
- Running `npx bmad-method init` will likely prompt for choices (where to install web bundles, which integrations to enable). Run it from the project root so files are written into this repo.
- If you prefer not to add it to package.json, you can always run the CLI directly via `npx -p bmad-method bmad-method init`.

4) Alternative: global install (makes CLI available system-wide)

```bash
# use a node version manager (nvm) to avoid sudo where possible
npm install -g bmad-method
# then run
bmad-method init
```

5) If you already ran the installer via npx (like earlier) and want to persist the web bundles that were placed in the npx cache, copy them to a project folder:

```bash
mkdir -p .bmad-core/web-bundles
cp -R /Users/timquattrochi/.npm/_npx/*/node_modules/bmad-method/web-bundles/* .bmad-core/web-bundles/

# check size before committing
du -sh .bmad-core/web-bundles
```

Recommendation: web bundles can be large. Consider adding `.bmad-core/web-bundles/` to `.gitignore` unless you want them checked into git intentionally for reproducibility.

6) Preview changes the init will make (dry-run strategy)

- There may not be a built-in dry-run. A safe way is to run the CLI in a temporary directory to inspect what it writes:

```bash
mkdir -p /tmp/bmad-test && cd /tmp/bmad-test
npx -p bmad-method bmad-method
# review files created inside /tmp/bmad-test, then remove the folder when done
cd -
rm -rf /tmp/bmad-test
```

7) Commit the repo changes after you've reviewed them

```bash
# after running init and verifying files
git add -A
git commit -m "chore(bmad): run bmad-method init and add project config"
```

8) Optional cleanup of npx temp cache (only if you don't need the temp files)

```bash
rm -rf /Users/timquattrochi/.npm/_npx/2d6bcd63982e6f85
# or to clear all npx temp runs (be cautious)
rm -rf /Users/timquattrochi/.npm/_npx/*
```

9) If you want help: I can either (A) prepare an apply_patch that adds a `.bmad-core` folder (without the bundles) plus this doc, or (B) prepare an apply_patch that adds small, proven files written by the BMAD init (like `.vscode/settings.json` changes) — tell me which and I will create the patch.

Troubleshooting
- If `npx bmad-method` shows an error, try `npm install --save-dev bmad-method` then run `npx bmad-method --help`.
- If the init tries to overwrite files you care about, abort the run, review changes, and restore from the branch you created above.

End of doc
