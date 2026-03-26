# 🧪 AMW-Testing (Staging Environment)

![Environment: Staging](https://img.shields.io/badge/Environment-Staging-FFA500?style=for-the-badge)
![Status: Experimental](https://img.shields.io/badge/Status-Experimental-8A2BE2?style=for-the-badge)

⚠️ **NOTICE: This is a testing and staging repository.** ⚠️

This repository serves as the dedicated testing ground for the **Azeroth's Most Wanted Armory** dashboard. 

The primary purpose of this repository is to safely validate structural changes, GitHub Actions workflows, and **GitHub Pages deployments** before they are pushed to the live production environment. It is essentially an exact, albeit experimental, mirror of the main project.

🔗 **[View the Production Repository Here](https://github.com/CodeNode-Automation/Azeroths-Most-Wanted)**

---

## 🎯 Purpose of this Repo

Because the AMW Armory relies heavily on an automated, serverless CI/CD pipeline to render static HTML natively, testing changes locally isn't always 1:1 with how GitHub Pages processes the build. 

This repository allows us to:
* Safely test `update_data.yml` cron jobs and workflow dispatches.
* Validate Jinja2 HTML rendering and Chart.js payloads in a live browser environment.
* Debug database schema migrations with a test Turso edge database.
* Ensure CSS and mobile responsiveness work perfectly on GitHub Pages before going live.

---

## 🏗️ Project Overview

If you are looking for the actual documentation, system architecture, or setup instructions for the WoW Classic API Dashboard pipeline, please head over to the main repository. 

**Tech Stack Snapshot:**
* **Extraction:** Python (AsyncIO, Aiohttp) via Blizzard REST API
* **Database:** Turso (libSQL/SQLite)
* **Automation:** GitHub Actions
* **Frontend:** Jinja2, HTML5, Vanilla JS, Chart.js

---

*Note: Please do not open Issues or Pull Requests on this repository. All contributions and bug reports should be directed to the [main production repository](https://github.com/CodeNode-Automation/Azeroths-Most-Wanted).*
