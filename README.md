[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=madhouseminers_control&metric=alert_status)](https://sonarcloud.io/dashboard?id=madhouseminers_control)
[![Known Vulnerabilities](https://snyk.io/test/github/madhouseminers/control/badge.svg)](https://snyk.io/test/github/madhouseminers/control)

# Madhouse Miners Control

This is the control system for the Madhouse Miners minecraft server network.

## Development

To dev this system you will need to install some dependencies. The system requires:

- Redis
- PostGres

Set up a .env file with the [database connection information](https://node-postgres.com/features/connecting#environment-variables) (e.g. PGUSER, PGPASSWORD.)

Run the following commands to get up and running:

```
yarn install  # Install the dependent node packages
yarn migrate  # Run the database migrations
yarn dev      # Start up the development environment
```

You can access the site at http://localhost:2111. If you need to change the port, you can use the `PORT` environment variable.
