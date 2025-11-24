# JSON Formatter (JSON/JSONC/JSONL)

VS Code extension to format JSON, JSONC, and JSONL/NDJSON for human-readability with consistent indentation and optional trailing newlines.

## Features
- Formats JSON, JSONC, and line-delimited JSON into a neatly indented, human-readable layout.
- Works through the built-in `Format Document` action or the `JSONExt: Format Document` command.
- Respects `jsonext.indentSize` and `jsonext.ensureFinalNewline` settings for per-workspace control.

## Usage
- Open a JSON/JSONC/JSONL file and run `Format Document`, or invoke `JSONExt: Format Document` from the Command Palette.
- Configure indentation and trailing newline behavior via `jsonext.indentSize` and `jsonext.ensureFinalNewline` in your settings.

## Install via VSIX
1. Build or download the VSIX (a packaged `jsonext-0.0.1.vsix` lives at the repo root).
2. In VS Code, open the Command Palette and run `Extensions: Install from VSIX...`, then pick the VSIX file.
3. Alternatively, install from a terminal: `code --install-extension /path/to/jsonext-0.0.1.vsix`
4. Reload the window if prompted and the formatter will activate on JSON, JSONC, and JSONL files.

## Development and Testing
- Install dependencies: `npm install`
- Build the extension: `npm run compile`
- Run the test suite (after compiling): `npm test`
- Watch for rebuilds during development: `npm run watch`
- Package a new VSIX: `npm run package`
