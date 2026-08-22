from __future__ import annotations

import argparse
import asyncio
import json
import re
from dataclasses import asdict, is_dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from notebooklm import ExportType, NotebookLMClient, ReportFormat


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_STORAGE = Path.home() / ".notebooklm" / "profiles" / "default" / "storage_state.json"
RUNS_ROOT = REPO_ROOT / "research" / "notebooklm" / "runs"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create a source-grounded prop-firm report with NotebookLM.",
    )
    parser.add_argument("--manifest", required=True, help="Path to the firm research manifest JSON.")
    parser.add_argument("--storage", default=str(DEFAULT_STORAGE), help="NotebookLM storage_state.json path.")
    parser.add_argument("--execute", action="store_true", help="Create cloud resources. Without this flag, only validate and print the plan.")
    parser.add_argument("--resume", action="store_true", help="Resume from the saved local run state instead of creating another notebook.")
    parser.add_argument("--regenerate-report", action="store_true", help="Generate a new report in an existing resumed notebook using the current prompt.")
    parser.add_argument("--no-google-doc", action="store_true", help="Generate and download the report without exporting it to Google Docs.")
    return parser.parse_args()


def resolve_from_repo(value: str) -> Path:
    path = Path(value)
    return (REPO_ROOT / path).resolve() if not path.is_absolute() else path.resolve()


def load_manifest(path_value: str) -> tuple[Path, dict[str, Any]]:
    path = resolve_from_repo(path_value)
    data = json.loads(path.read_text(encoding="utf-8"))
    required = ("slug", "name", "notebookTitle", "googleDocTitle", "promptPath", "sources")
    missing = [key for key in required if not data.get(key)]
    if missing:
        raise ValueError(f"Manifest is missing required fields: {', '.join(missing)}")
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", data["slug"]):
        raise ValueError("Manifest slug must use lowercase kebab-case.")
    if not isinstance(data["sources"], list) or not data["sources"]:
        raise ValueError("Manifest must contain at least one source.")

    prompt_path = resolve_from_repo(data["promptPath"])
    if not prompt_path.is_file():
        raise ValueError(f"Prompt file does not exist: {prompt_path}")

    for index, source in enumerate(data["sources"], start=1):
        if not isinstance(source, dict) or source.get("type") not in {"url", "file", "text"} or not source.get("value"):
            raise ValueError(f"Source {index} must contain type=url|file|text and value.")
        if source["type"] == "url":
            parsed = urlparse(source["value"])
            if parsed.scheme not in {"http", "https"} or not parsed.netloc:
                raise ValueError(f"Source {index} is not a valid HTTP(S) URL.")
        elif source["type"] == "file":
            file_path = resolve_from_repo(source["value"])
            if not file_path.is_file():
                raise ValueError(f"Source file does not exist: {file_path}")

    data["_promptPath"] = prompt_path
    return path, data


def json_safe(value: Any) -> Any:
    if is_dataclass(value):
        return {key: json_safe(item) for key, item in asdict(value).items()}
    if isinstance(value, dict):
        return {str(key): json_safe(item) for key, item in value.items()}
    if isinstance(value, (list, tuple, set)):
        return [json_safe(item) for item in value]
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, Path):
        return str(value)
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    return str(value)


def write_state(path: Path, state: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(json_safe(state), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(path)


def find_google_doc_url(value: Any) -> str | None:
    if isinstance(value, str) and value.startswith("https://docs.google.com/document/"):
        return value
    if isinstance(value, dict):
        for item in value.values():
            result = find_google_doc_url(item)
            if result:
                return result
    if isinstance(value, (list, tuple)):
        for item in value:
            result = find_google_doc_url(item)
            if result:
                return result
    return None


async def execute(
    manifest_path: Path,
    manifest: dict[str, Any],
    storage: Path,
    resume: bool,
    regenerate_report: bool,
    export_google_doc: bool,
) -> None:
    if not storage.is_file():
        raise RuntimeError(
            f"NotebookLM authentication is missing: {storage}\n"
            "Run the login command from research/notebooklm/README.md first."
        )

    run_dir = RUNS_ROOT / manifest["slug"]
    state_path = run_dir / "run.json"
    state: dict[str, Any] = {}
    if resume:
        if not state_path.is_file():
            raise RuntimeError(f"Cannot resume because no state exists at {state_path}")
        state = json.loads(state_path.read_text(encoding="utf-8"))
    elif state_path.exists():
        raise RuntimeError(
            f"A previous run exists at {state_path}. Use --resume or move the run directory before starting a new notebook."
        )

    if regenerate_report:
        if not resume:
            raise RuntimeError("--regenerate-report requires --resume.")
        for key in ("artifactId", "generation", "localReport", "googleDocExport", "googleDocUrl"):
            state.pop(key, None)

    prompt = Path(manifest["_promptPath"]).read_text(encoding="utf-8")
    state.update({
        "slug": manifest["slug"],
        "name": manifest["name"],
        "manifestPath": str(manifest_path),
        "updatedAt": datetime.now(UTC).isoformat(),
    })

    async with NotebookLMClient.from_storage(path=str(storage), chat_timeout=180.0) as client:
        notebook_id = state.get("notebookId")
        if not notebook_id:
            notebook = await client.notebooks.create(manifest["notebookTitle"])
            notebook_id = notebook.id
            state["notebookId"] = notebook_id
            write_state(state_path, state)
            print(f"Created notebook: {notebook_id}")

        source_records = state.get("sources", [])
        source_ids = [record["id"] for record in source_records]
        completed_source_inputs = {
            json.dumps(record.get("input"), ensure_ascii=False, sort_keys=True)
            for record in source_records
        }
        for source in manifest["sources"]:
            source_key = json.dumps(source, ensure_ascii=False, sort_keys=True)
            if source_key in completed_source_inputs:
                continue
            try:
                title = source.get("label")
                if source["type"] == "url":
                    created = await client.sources.add_url(
                        notebook_id,
                        source["value"],
                        title=title,
                        wait=True,
                        wait_timeout=180.0,
                    )
                elif source["type"] == "file":
                    created = await client.sources.add_file(
                        notebook_id,
                        resolve_from_repo(source["value"]),
                        title=title,
                        wait=True,
                        wait_timeout=180.0,
                    )
                else:
                    created = await client.sources.add_text(
                        notebook_id,
                        title or f"Research notes for {manifest['name']}",
                        source["value"],
                        wait=True,
                        wait_timeout=180.0,
                    )
            except Exception:
                state["sourceIds"] = source_ids
                state["sources"] = source_records
                write_state(state_path, state)
                if source.get("optional"):
                    print(f"Optional source skipped: {source.get('label') or source['value']}")
                    continue
                raise
            source_ids.append(created.id)
            source_records.append({"id": created.id, "title": created.title, "input": source})
            completed_source_inputs.add(source_key)
            state["sourceIds"] = source_ids
            state["sources"] = source_records
            write_state(state_path, state)
            print(f"Source ready: {created.title}")

        artifact_id = state.get("artifactId")
        if not artifact_id:
            generation = await client.artifacts.generate_report(
                notebook_id,
                report_format=ReportFormat.CUSTOM,
                source_ids=source_ids,
                language="en",
                custom_prompt=prompt,
            )
            artifact_id = generation.task_id
            state["artifactId"] = artifact_id
            write_state(state_path, state)
            print(f"Report generation started: {artifact_id}")

        completed = await client.artifacts.wait_for_completion(
            notebook_id,
            artifact_id,
            timeout=900.0,
        )
        state["generation"] = json_safe(completed)
        write_state(state_path, state)
        if not completed.is_complete:
            raise RuntimeError(f"Report generation ended with status: {completed.status}")

        run_dir.mkdir(parents=True, exist_ok=True)
        local_report = run_dir / "report.md"
        downloaded = await client.artifacts.download_report(
            notebook_id,
            str(local_report),
            artifact_id=artifact_id,
        )
        state["localReport"] = str(downloaded)

        if export_google_doc and "googleDocExport" not in state:
            exported = await client.artifacts.export_report(
                notebook_id,
                artifact_id,
                title=manifest["googleDocTitle"],
                export_type=ExportType.DOCS,
            )
            state["googleDocExport"] = json_safe(exported)
            state["googleDocUrl"] = find_google_doc_url(exported)

        state["updatedAt"] = datetime.now(UTC).isoformat()
        write_state(state_path, state)

    print(f"Local report: {state['localReport']}")
    if state.get("googleDocUrl"):
        print(f"Google Doc: {state['googleDocUrl']}")
    elif export_google_doc:
        print("Google Docs export completed; inspect run.json for the raw export response.")


def main() -> None:
    args = parse_args()
    manifest_path, manifest = load_manifest(args.manifest)
    plan = {
        "manifest": str(manifest_path),
        "firm": manifest["name"],
        "slug": manifest["slug"],
        "sources": len(manifest["sources"]),
        "prompt": str(manifest["_promptPath"]),
        "output": str(RUNS_ROOT / manifest["slug"] / "report.md"),
        "googleDocsExport": not args.no_google_doc,
    }
    print(json.dumps(plan, ensure_ascii=False, indent=2))
    if not args.execute:
        print("Dry run only. Add --execute after authentication to create the NotebookLM report.")
        return
    asyncio.run(
        execute(
            manifest_path,
            manifest,
            resolve_from_repo(args.storage),
            args.resume,
            args.regenerate_report,
            not args.no_google_doc,
        )
    )


if __name__ == "__main__":
    main()
