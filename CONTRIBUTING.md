# Contributing

This guide applies to every Lumanic AI repository that does not ship its own.

## Before you start

Open an issue before any change larger than a small fix, so the approach is agreed before the code is written. Keep one concern per pull request.

## What a reviewable change includes

**Evidence.** If the change touches labeling, retrieval, reasoning or scoring, show its effect: before/after results on the relevant evaluation set, or an Explain Trail excerpt that shows the new behavior on a concrete input. "Looks better" is not evidence.

**Versions.** A change to a label definition, rule, schema or model bumps the version it belongs to, and the changelog says why. Outputs are only reproducible if their inputs are versioned.

**No personal data.** Fixtures, tests, examples and screenshots use synthetic or masked text. Never commit raw utterances, names or identifiers from real sources, and never paste them into issues or pull requests.

**Tests and docs.** New behavior comes with tests, and anything a user can see comes with documentation.

## Commits

Write the subject line in the imperative mood and under 72 characters. Use the body to explain why the change is needed; the diff already shows what changed.

## Conduct

Participation is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). Security issues follow the [security policy](SECURITY.md), not the issue tracker.
