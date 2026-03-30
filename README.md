# TamperMonkey Scripts Monorepo

This repository contains various TamperMonkey scripts and related utilities, organized as a monorepo.

## Structure

- `generic-services/` - Shared utilities and hooks
- `projects/` - Individual script projects
- `scripts/` - Build and start scripts

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Build all projects**

   ```bash
   npm run build
   ```

3. **Start development server** (if available)

   ```bash
   npm run start
   ```

## Development Notes

- Uses TypeScript, Webpack, and Babel for building scripts.
- Each project may have its own `package.json` and build config.
- Scripts are intended for use with TamperMonkey or similar userscript managers.

## Contributing

- Please open issues or pull requests for improvements or bug fixes.
- Follow standard code style and linting rules.

## License

This repository is for personal or educational use. See individual scripts for license details.
