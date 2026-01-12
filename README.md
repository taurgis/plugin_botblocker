# BotBlocker for Salesforce B2C Commerce Cloud

BotBlocker provides request filtering, IP/user-agent reputation checks, and Business Manager tooling for Salesforce B2C Commerce Cloud (SFCC). The package is split into cartridges for storefront interception, integration logic, Business Manager UI, and scheduled jobs.

## Features

- Request filtering hook to block/flag suspicious traffic before it reaches storefront controllers.
- Integration cartridge to enrich requests with browser, OS, and IP metadata for downstream decisions.
- Business Manager extension with pages to inspect IP detail, manage blacklists, and configure services.
- Scheduled job to fetch and publish blacklist data from external sources.
- Service definition and logging utilities for auditability.

## Repository Layout

- `cartridges/plugin_botblocker` – storefront controller overrides/entry points (`Blocker.js`).
- `cartridges/int_botblocker` – core integration code, request filter, managers, and templates.
- `cartridges/bm_app_botblocker` – Business Manager extension (controllers, client assets, templates).
- `cartridges/bc_jobs_botblocker` – job step to build/refresh blacklists and supporting assets.
- `metadata/` – service definition, job definition, system and custom object types used by the cartridges.
- `test/` – unit tests and mocks for SFCC script APIs.

## Prerequisites

- SFCC Sandbox/Instance with rights to deploy cartridges and import metadata.
- Node.js 14+ (current engines field is permissive, but tooling is tested against Node 14/16).
- npm 6+.

## Installation

```bash
npm install
```

## Build, Lint, and Test

- Build client assets: `npm run build` (runs JS, fonts, and SCSS compilation via `sgmf-scripts`).
- Lint: `npm run lint` or run individually with `npm run lint:js` and `npm run lint:css`.
- Unit tests: `npm test`.
- Coverage: `npm run cover` (outputs reports in `coverage/`).

## Deployment

1. Build assets locally with `npm run build`.
2. Upload cartridges to your instance (or push via CI/CD):
	- `bc_jobs_botblocker`
	- `bm_app_botblocker`
	- `int_botblocker`
	- `plugin_botblocker`
3. Add cartridges to the instance cartridge path in the order above.
4. Import metadata from `metadata/` (system object definitions, custom object types, services, job definitions, site preferences).
5. In Business Manager, verify the BotBlocker service configuration and job schedule (see `metadata/services/botblocker.xml` and `metadata/jobs/botblocker.xml`).

## Configuration Notes

- Global/site preferences are defined under `metadata/system-object-types/global-preferences.xml`; apply them and set values per site as needed.
- Custom objects for IP and blacklist data are defined in `metadata/custom-object-types/` and must be imported before running jobs or services.
- The request filter lives in `cartridges/int_botblocker/cartridge/scripts/filter/BotBlockerRequestFilter.js` and depends on the integration managers in `cartridges/int_botblocker/cartridge/scripts/managers/`.
- Business Manager pages/controllers live in `cartridges/bm_app_botblocker/cartridge/controllers/`; client assets compile from `cartridges/bm_app_botblocker/cartridge/client/`.
- The scheduled job step is `cartridges/bc_jobs_botblocker/cartridge/scripts/jobsteps/buildBlacklist.js`; configure a job using the provided XML definition.

## Contributing

1. Fork the repository and create a feature branch.
2. Run lint and tests before opening a pull request: `npm run lint` and `npm test`.
3. Provide context for SFCC cartridge order, configuration expectations, and any metadata additions in your PR description.

## Support

For issues or feature requests, open a GitHub issue. For security reports, please contact the maintainer directly.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).