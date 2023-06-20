FROM		alpine:latest	AS base

RUN			apk add --upgrade --progress --virtual base \
				nodejs \
				npm \
				curl \
			&& rm -f /var/cache/apk/* \
			&& curl -qL https://www.npmjs.com/install.sh | sh

#=#=#

FROM		base			AS packed

RUN			npm i -g @nestjs/cli
