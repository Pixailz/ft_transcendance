# CONFIG
SHELL				:= /bin/bash
DOCKER_COMPOSE		:= docker compose -f ./docker/docker-compose.yaml
CURL				:= curl -L -\#

ENV_FILE			:= ./docker/.env

# VOLUMES DIR
SHARE_BASE			:= ./docker/Shared
export SHARE_BASE
SHARE_DIR			:= node \
					   portainer

SHARE_DIR			:= $(addprefix $(SHARE_BASE)/,$(SHARE_DIR))

# PACKAGE TO DOWNLOAD

PORTAINER			:= ./docker/portainer/latest.tar.gz

PORTAINER_LINK		:= https://github.com/portainer/portainer/releases/download/2.18.3/portainer-2.18.3-linux-amd64.tar.gz

PACKAGES			:= $(PORTAINER)

# UTILS
MKDIR				= \
$(shell [ -f $(1) ] && rm -f $(1)) \
$(shell [ ! -d $(1) ] && mkdir -p $(1))

SET_VAR				= \
var_pos="$$(grep -n $(1) ./docker/.env | cut -d':' -f1)" ; \
sed -i "$${var_pos}d" ./docker/.env ; \
sed -i "$${var_pos}i$(1)=$(2)" ./docker/.env ; \
printf "var %b%s%b " "$(G)" "$(1)" "$(RST)" ; \
printf "set to %b%s%b\n" "$(R)" "$(2)" "$(RST)" ;

SET_PASS			= \
printf "%bAdmin%b pass\n" "$(R)" "$(RST)" ; \
read -s ADMIN_PASS ; \
$(call SET_VAR,ADMIN_PASS,$${ADMIN_PASS})

ifeq ($(findstring fre,$(MAKECMDGOALS)),fre)
RE_STR				:= --no-cache
endif

ifneq ($(ENTRY),)
ENTRYPOINT			:= --entrypoint $(ENTRY)
endif

RE_STR				?=
TARGET				?=

ESC					:=\x1b[
R					:=$(ESC)38;5;196m
G					:=$(ESC)38;5;112m
B					:=$(ESC)38;5;27m
O					:=$(ESC)38;5;208m

PRI					:=$(G)
SEC					:=$(O)
RST					:=$(ESC)00m

# RULES
.PHONY:				up run build kill exec re clean fclean  $(SHARE_DIR)

up:					build
	$(DOCKER_COMPOSE) up $(TARGET)

run:				build
	$(DOCKER_COMPOSE) run -it $(ENTRYPOINT) $(TARGET)

build:				$(PACKAGES)  $(SHARE_DIR) $(ENV_FILE)
	$(DOCKER_COMPOSE) build $(TARGET) $(RE_STR)

kill:
	$(DOCKER_COMPOSE) kill $(TARGET)

exec:
	$(DOCKER_COMPOSE) exec -it $(TARGET) ash

re:					clean up

fre:				fclean up

clean:				kill
	docker system prune -af
	docker stop $(shell docker ps -qa) 2>/dev/null; true
	docker rm $(shell docker ps -qa ) 2>/dev/null; true
	docker rmi $(shell docker images -qa) 2>/dev/null; true
	docker volume rm $(shell docker volume ls -q) 2>/dev/null; true
	docker network rm $(shell docker network ls -q) 2>/dev/null; true

$(PORTAINER):
	$(CURL) $(PORTAINER_LINK) --output $(@)

$(ENV_FILE):
	cp -f ./docker/.env{.template,}
	@$(call SET_PASS)

$(SHARE_DIR):
	$(call MKDIR,$(@))
