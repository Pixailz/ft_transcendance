# CONFIG
SHELL				:= /bin/bash
DOCKER_COMPOSE		:= docker compose -f ./docker/docker-compose.yaml
ENV_FILE			:= ./docker/.env
VERSION				:= 0.0.1-prealpha

# Always use GNU Make.
ifeq ($(origin .RECIPEPREFIX), undefined)
  $(error This Make does not support .RECIPEPREFIX. Please use GNU Make 4.0 or later)
endif
## Use '>' to instead of tab.
.RECIPEPREFIX		= >

ifeq ($(findstring fre,$(MAKECMDGOALS)),fre)
RE_STR				:= --no-cache
endif

ifneq ($(ENTRY),)
ENTRYPOINT			:= --entrypoint $(ENTRY)
endif

RE_STR				?=
TARGET				?=

# VOLUMES DIR
SHARE_BASE			:= shared
SHARE_DIR			:= nodejs \
					   postgresql \
					   postgresql_log \
					   portainer

SHARE_DIR			:= $(addprefix $(SHARE_BASE)/,$(SHARE_DIR))

# PACKAGE TO DOWNLOAD
PORTAINER			:= ./docker/portainer/latest.tar.gz
PORTAINER_LINK		:= https://github.com/portainer/portainer/releases/download/2.18.3/portainer-2.18.3-linux-amd64.tar.gz

NODEJS				:= ./docker/nodejs/latest.tar.gz
NODEJS_VERSION		:= 18.16.1
# NODEJS_VERSION		:= 20.3.1
NODEJS_LINK			:= https://unofficial-builds.nodejs.org/download/release/v$(NODEJS_VERSION)/node-v$(NODEJS_VERSION)-linux-x64-musl.tar.gz

PACKAGES			:= $(PORTAINER) $(NODEJS)

# UTILS
## CURL WITH OPTION
CURL				:= curl -L -\#

## MKDIR BASH
MKDIR				= \
$(shell [ -f $(1) ] && rm -f $(1)) \
$(shell [ ! -d $(1) ] && mkdir -p $(1))

## ANSI COLOR
ESC					:=\x1b[
RST					:=$(ESC)00m

R					:=$(ESC)38;5;196m
G					:=$(ESC)38;5;112m
B					:=$(ESC)38;5;27m
O					:=$(ESC)38;5;208m

P					:=$(RST)
S					:=$(G)

## FUNCTION TO SET A VALUE, GIVEN A VARIABLE ON THE $(ENV_FILE)
SET_PASS			= \
read -p "WAITING FOR INPUT > " -s TMPVAR  ; \
sed -i "s|^.*$(1)|$(1)=\"$${TMPVAR}\"|g" $(ENV_FILE) ; \
printf "\nvar $(G)$(1)$(RST) set to $(R)%s$(RST)\n" "$${TMPVAR}" ;

define USAGE
$(S)BRIEF$(P)
	$(P)Makefile create the '$(S)$(SHARE_BASE)$(P)' skeleton automatically and also
	copy the '$(S)$(ENV_FILE).template$(P)' into '$(S)$(ENV_FILE)$(P)' if it not exists

	The rules $(S)up$(P), $(S)run$(P), $(S)build$(P), $(S)kill$(P), $(S)exec$(P), have a variable $(S)TARGET$(P) to set for specifying
	the target.

	exemples:
	'make exec $(S)TARGET$(P)=$(S)mariadb$(P)'
		will run 'ash' (alpine bash shell) on a running mariadb container
	'make up $(S)TARGET$(P)=$(S)nginx$(P)'
		will make up nginx container


	If no $(S)TARGET$(P) is specified all the services are targeted, except for
	$(S)run$(P) which it's have to be set

	The exec rules can take an $(S)EXEC$(P) variable wich specify what to
	launch (ex: '$(S)ash$(P)', '$(S)ps aux$(P)')

$(S)RULES$(P)
	$(S)up$(P)
		call 'build', and then call 'docker compose up' to make the whole
		project UP and running

	$(S)run$(P)
		call 'build', and then call 'docker compose run -it' to run a containers

	$(S)build$(P)
		call '$(S)$$(PACKAGES)$(P)' '$(S)$$(SHARE_DIR)$(P)' and '$(S)$$(ENV_FILE)$(P)', and then call
		'docker compose build' to first build the containers

	$(S)kill$(P)
		call 'docker compose kill' to kill all the current running containers

	$(S)exec$(P)
		call 'docker compose exec -it' to pop a shell on a containers

	$(S)re$(P)
		call 'clean' and then 'up'

	$(S)fre$(P)
		call 'full_clean' and then 'up'

	$(S)clean$(P)
		clean the $(S)$$(SHARE_DIR)$(P) folder, by removing it

	$(S)full_clean
		call 'clean' then 'docker system prune -af' and then remove all image,
		network volumes, to make sure we start from a good base

	$(S)$$(PACKAGES)$(P)
		download all necessary package before attempting to create docker image

	$(S)$$(ENV_FILE)$(P)
		copy the '$(S)$(ENV_FILE).template$(P)' onto '$(S)$(ENV_FILE)$(P)' and then read from
		stdin the PASS

	$(S)$$(SHARE_DIR)$(P)
		make whole skeleton of the '$(S)$$(SHARE_DIR)$(P)' folder

	$(S)help$(P)
		display this help message

$(S)VERSION$(P)
	$(VERSION)
$(RST)
endef
export USAGE

# RULES
.PHONY:				up run build kill exec re clean $(SHARE_DIR) $(NODEJS)

up:					build
> $(DOCKER_COMPOSE) up $(TARGET)

run:				build
> $(DOCKER_COMPOSE) run -it $(ENTRYPOINT) $(TARGET)

build:				$(PACKAGES) $(SHARE_DIR) $(ENV_FILE)
> $(DOCKER_COMPOSE) build $(TARGET) $(RE_STR)

kill:
> $(DOCKER_COMPOSE) kill $(TARGET)

exec:
> $(DOCKER_COMPOSE) exec -it $(TARGET) ash

$(PORTAINER):
> $(CURL) $(PORTAINER_LINK) --output $(@)

$(NODEJS):
> @$(eval RESULT=$(shell $(CURL) -s https://unofficial-builds.nodejs.org/download/release/v$(NODEJS_VERSION)/SHASUMS256.txt | grep "musl.tar.gz" | cut -d" " -f1)) \
if [ "$(RESULT)" != "$(shell sha256sum ./docker/nodejs/latest.tar.gz | cut -d' ' -f1 )" ]; then \
printf "Sha256sum $(R)didn't$(RST) match or not found, downloading again\n" ; \
rm -rf $(@) ; \
$(CURL) $(NODEJS_LINK) --output $(@) ; \
else \
printf "Sha256sum $(G)match$(RST) don't redownload\n" ; \
fi ;

re:					clean up

fre:				full_clean up

clean:
> sudo rm -rf $(SHARE_BASE)

full_clean:			clean
> docker system prune -af
> docker stop $(shell docker ps -qa) 2>/dev/null; true
> docker rm $(shell docker ps -qa) 2>/dev/null; true
> docker rmi $(shell docker images -qa) 2>/dev/null; true
> docker volume rm $(shell docker volume ls -q) 2>/dev/null; true
> docker network rm $(shell docker network ls -q) 2>/dev/null; true

$(ENV_FILE):
> cp -f $(ENV_FILE){.template,}
> @printf "$(R)Admin$(RST) pass\n"
> @$(call SET_PASS,ADMIN_PASS)

$(SHARE_DIR):
> $(call MKDIR,$(@))

help:
> @printf "%b" "$${USAGE}"
