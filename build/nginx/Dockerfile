FROM		alpine:latest	AS base

RUN			apk add --update \
				nginx \
				openssl \
			&& rm -f /var/cache/apk/*

#=#=#

FROM		base			AS packed

COPY		--chown=root:root default.conf entrypoint /run

ENTRYPOINT	[ "/run/entrypoint" ]
