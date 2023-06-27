FROM		alpine:latest	AS base

RUN			apk add --upgrade --progress --virtual dependencies \
				libstdc++ \
			&& rm -f /var/cache/apk/*
			# && curl -qL https://www.npmjs.com/install.sh | sh

#=#=#

FROM		base			AS packed

COPY		--chown=root:root latest.tar.gz /tmp/latest.tar.gz
COPY		--chown=root:root --chmod=755 entrypoint /run

ENTRYPOINT	[ "/run/entrypoint" ]

CMD			[ "/bin/ash" ]
