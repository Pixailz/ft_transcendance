FROM		alpine:latest	AS base

RUN			apk add --upgrade --progress --virtual dependencies \
				nodejs \
				npm \
			&& rm -f /var/cache/apk/*

#=#=#

FROM		base			AS nodejs

ENV			PATH="/usr/local/lib/nodejs/bin:${PATH}"

COPY		--chown=root:root --chmod=755 entrypoint /run

WORKDIR		/shared/transcendence

ENTRYPOINT	[ "/run/entrypoint" ]
