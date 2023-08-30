FROM		alpine:latest	AS base

RUN			apk add --update --virtual base \
				postgresql15 \
				dumb-init \
			&& rm -f /var/cache/apk/*

#=#=#

FROM		base			AS packed

COPY		--chown=root:root entrypoint /run

# https://www.postgresql.org/docs/current/server-shutdown.html
## Smart Shutdown
STOPSIGNAL	SIGTERM
## Fast Shutdown
# STOPSIGNAL	SIGINT
## Immediate Shutdown
# STOPSIGNAL	SIGQUIT

ENTRYPOINT	[ "dumb-init", "/run/entrypoint" ]
