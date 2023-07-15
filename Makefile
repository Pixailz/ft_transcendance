ifeq ($(findstring dev,$(MAKECMDGOALS)),dev)
DEV						:= 1
endif

ifeq ($(DEV),)
COMPOSE					:= docker compose
else
COMPOSE					:= docker compose -f docker-compose.dev.yaml
endif

.PHONY:					dev ./.env

all:			./.env
	$(COMPOSE) up --build $(TARGET)

./.env:
	./setup

dev:			all
