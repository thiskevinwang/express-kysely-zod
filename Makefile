app.start:
	docker compose -f apps/api/docker-compose.yml up --build --abort-on-container-exit


app.db-only:
	docker compose -f apps/api/docker-compose.yml up db

app.stop:
	docker compose -f apps/api/docker-compose.yml down

PHONY: app.start app.db-only app.stop

# todo: command for generating migration files with ISO 8601 prefix
date:
	@date -u +'%Y-%m-%dT%H:%M:%SZ'