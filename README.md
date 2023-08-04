# Express w/ Zod Validation & OpenAPI generation

```bash
# clone
cp .env.example .env
npm i
npm run dev
# watch for changes
# Ctrl+c to exit
```

API docs @ http://localhost:5000/api-docs

## What is this?

This is a scaffolding project built around `express.js` that aims to address a few well-known use cases and development needs.

- [x] Use `docker compose` to spin up a API and Postgres database pair
- [x] Use `node` to run the API only
- [x] Use `nodemon` for hot-reloading
  - [ ] with `docker compose`
  - [x] with `node`
- [ ] Database migrations
- [x] TypeScript support
- [x] Schema validation w/ `zod`
- [ ] OpenAPI docs generation
- [ ] Testing
  - [ ] Unit
  - [ ] Integration
  - [ ] Automated via CI
- [ ] Deployment
