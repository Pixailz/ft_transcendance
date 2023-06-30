FROM		alpine:latest	AS base

RUN			apk add --upgrade --progress --virtual dependencies \
				nodejs \
			&& rm -f /var/cache/apk/*

#=#=#

FROM		base			AS nodejs

ARG			PROJECT_NAME

ENV			PATH="/usr/local/lib/nodejs/bin:${PATH}"

COPY		--chown=root:root --chmod=755 entrypoint /run

WORKDIR		/shared/${PROJECT_NAME}

ENTRYPOINT	[ "/run/entrypoint" ]

CMD			[ "npm", "run", "start:dev" ]
