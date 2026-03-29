# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-03-29

### Added
- Created `.markdownlint.json` to standardize documentation linting rules and suppress noisy stylistic warnings.
- Added descriptive alt-text to Vercel deployment screenshots in `README.md` for better accessibility and SEO.

### Changed
- **Global Re-branding**: Re-branded the entire project from "Anurag Hazra" to **Er. Mradul Sharma** across all markdown files, social links, and metadata.
- **Repository Metadata**: Updated `package.json` with new author contact details, repository URLs, and a more professional project description.
- **Dependency Refresh**: Updated core dependencies to their latest stable patches and minor versions using `npm update`.
- Updated `README.md` for a more premium and branded appearance reflecting the new ownership.

### Fixed
- **Testing**: Resolved a floating-point precision error in `tests/calculateRank.test.js` that was causing test failures on specific environments (Node.js/Windows).
- **Maintenance**: Cleaned up build artifacts, temporary log files, and outdated vendor references in the source code.

---
*Maintained by Er. Mradul Sharma*
