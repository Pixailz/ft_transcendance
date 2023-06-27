FROM		alpine:latest	AS base

RUN			apk add --update --virtual base \
				postgresql15 \
			&& rm -f /var/cache/apk/*

#=#=#

FROM		base			AS packed

COPY		--chown=root:root entrypoint postgresql.conf /run

STOPSIGNAL	SIGINT

ENTRYPOINT	[ "/run/entrypoint" ]

