
## CI/CD

Bei jedem Push auf `main` fuehrt eine GitHub-Actions-Pipeline automatisiert die Unit-Tests aus und veroeffentlicht bei Erfolg ein neues Docker-Image auf Docker Hub (ecosteelag/ecosteel-asset-api:latest). Render uebernimmt dieses Image danach automatisch fuer das produktive Deployment.
