FROM		alpine:latest	AS packed

RUN			apk add --upgrade --progress --virtual base \
				nodejs \
				npm \
				curl \
			&& rm -f /var/cache/apk/* \
			&& curl https://www.npmjs.com/install.sh --output install.sh \
			&& chmod +x ./install.sh \
			&& ./install.sh \
			&& rm -f ./install.sh
