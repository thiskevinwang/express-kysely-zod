start:
	docker compose up --build --abort-on-container-exit

db-only:
	docker compose up db

stop:
	docker compose down

PHONY: start stop

# todo: command for generating migration files with ISO 8601 prefix
date:
	@date -u +'%Y-%m-%dT%H:%M:%SZ'