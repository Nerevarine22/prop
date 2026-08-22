# Local NotebookLM research pipeline

This module creates a source-grounded English research report for one prop firm. It is intentionally isolated from Next.js and Firestore.

## Output

Each successful run produces:

- a dedicated NotebookLM notebook for the firm;
- a custom English research report based on `prompts/firm-research.md`;
- a local Markdown backup in `research/notebooklm/runs/<slug>/report.md`;
- an exported Google Doc;
- a local `run.json` containing notebook, source, artifact and export identifiers.

The generated report is research input. It does not write to Firestore and is not automatically published on the site.

## 1. Install

From the repository root:

```powershell
python -m venv .venv-notebooklm
.\.venv-notebooklm\Scripts\python.exe -m pip install -r requirements-notebooklm.txt
.\.venv-notebooklm\Scripts\playwright.exe install chromium
```

## 2. Sign in

Use a dedicated Google account. The storage file contains sensitive session cookies and stays in NotebookLM's standard user-profile directory outside the repository.

```powershell
.\.venv-notebooklm\Scripts\notebooklm.exe login
.\.venv-notebooklm\Scripts\notebooklm.exe auth check --test
```

The first command opens a Chromium window. Complete the Google sign-in manually and wait until the CLI confirms that authentication was saved.

## 3. Create a firm manifest

Copy `manifests/firm.example.json` to a file ending in `.local.json`, then replace the example firm and URLs with official sources.

```powershell
Copy-Item research\notebooklm\manifests\firm.example.json research\notebooklm\manifests\target-firm.local.json
```

Supported source types:

- `url` for official website, rules, pricing, terms, FAQ and documentation pages;
- `file` for a local PDF, DOCX, Markdown or another file accepted by NotebookLM.
- `text` for a clearly labelled source ledger or captured official-source notes when a site blocks NotebookLM ingestion.

## 4. Validate without creating cloud resources

```powershell
.\.venv-notebooklm\Scripts\python.exe scripts\notebooklm_research.py --manifest research\notebooklm\manifests\target-firm.local.json
```

## 5. Run the research

```powershell
.\.venv-notebooklm\Scripts\python.exe scripts\notebooklm_research.py --manifest research\notebooklm\manifests\target-firm.local.json --execute
```

If the command stops after creating part of the workflow, resume it without duplicating the notebook:

```powershell
.\.venv-notebooklm\Scripts\python.exe scripts\notebooklm_research.py --manifest research\notebooklm\manifests\target-firm.local.json --execute --resume
```

After refining the shared research prompt, generate a replacement report in the same notebook:

```powershell
.\.venv-notebooklm\Scripts\python.exe scripts\notebooklm_research.py --manifest research\notebooklm\manifests\target-firm.local.json --execute --resume --regenerate-report
```

Use `--no-google-doc` when only the local Markdown report is needed.

## Review boundary

NotebookLM is a research assistant, not the database authority. The Google Doc should be reviewed first. A separate transformation step can then convert the approved report into `research/incoming/<slug>.json`, validate it, and finally sync a reviewed profile to Firestore.
