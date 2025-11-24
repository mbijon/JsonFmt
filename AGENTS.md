# Repository Guidelines

## Project Structure & Module Organization
- `src/` holds the VS Code extension source; `extension.ts` wires activation and formatting entry points.
- `dist/` contains compiled output used by tests and packaging.
- `test/` hosts the Mocha test runner (`runTest.ts`) and formatter specs.
- `jsonext-0.0.1.vsix` is a prebuilt VSIX for local installs; `language-configuration.json` defines JSONL language metadata.

## Build, Test, and Development Commands
- Install dependencies: `npm install`
- Compile TypeScript to `dist/`: `npm run compile`
- Watch mode for rapid rebuilds: `npm run watch`
- Run tests (after compile): `npm test`
- Package a VSIX for distribution: `npm run package`

## Coding Style & Naming Conventions
- Language: TypeScript for extension code; tests mirror implementation names.
- Indentation: 2 spaces; keep JSON/JSONC/JSONL formatting logic aligned with `jsonext.indentSize` defaults.
- Prefer small, single-responsibility functions; keep formatting helpers in `src/formatter.ts`-adjacent modules.
- File names: camelCase or kebab-case for modules; test files end with `.test.ts`.

## Testing Guidelines
- Framework: Mocha via `@vscode/test-electron`; tests live under `test/`.
- Run `npm run compile && npm test` before submitting changes; ensure snapshots/expected strings match formatter outputs.
- Add focused specs when changing formatting rules (e.g., indentation, trailing newlines, JSONC/JSONL edge cases).

## Commit & Pull Request Guidelines
- Commits: Use clear, imperative subjects (e.g., `Add JSONL trailing newline option`); keep related changes together.
- Pull Requests: Describe the change, testing performed (`npm run compile && npm test`), and user impact. Include repro steps or sample inputs/outputs when touching formatter behavior.
- Keep diffs minimal; avoid unrelated formatting churn.

## Security & Configuration Tips
- No secrets should enter the repo or tests; config is code and lives in source.
- VSIXs are local artifacts—do not publish without updating `publisher` and version in `package.json`.
