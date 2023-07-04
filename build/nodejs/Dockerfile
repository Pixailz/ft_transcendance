FROM		alpine:latest	AS base

RUN			apk add --upgrade --progress --virtual dependencies \
				nodejs \
				npm \
			&& rm -f /var/cache/apk/*

#=#=#

FROM		base			AS nodejs

ARG			PROJECT_NAME

ENV			PATH="/usr/local/lib/nodejs/bin:${PATH}"

COPY		--chown=root:root --chmod=755 entrypoint /run

WORKDIR		/shared/

ENTRYPOINT	[ "/run/entrypoint" ]
