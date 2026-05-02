# Security Policy

## Supported Versions

Currently, only the main branch is receiving security updates.

| Version | Supported          |
| ------- | ------------------ |
| MVP     | :white_check_mark: |
| 0.x     | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within NexusFlow, please do not disclose it publicly. Instead, please follow these steps:

1. **Email the core team** at security@codeforinnovation.org (or the project maintainer's email).
2. Provide a detailed description of the vulnerability, including steps to reproduce the issue.
3. Allow the team 48 hours to acknowledge the receipt of the report and provide an estimated timeline for a patch.

We take all security vulnerabilities seriously and will work diligently to patch them in the next deployment cycle.

## Automated Audits
This repository is configured to run automated dependency security audits (`npm audit` and Python `safety` checks) on the 1st of every month via GitHub Actions. Maintainers will be alerted immediately if a high-severity vulnerability is detected in our dependencies.
