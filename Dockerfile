FROM sendy-docker-local.jfrog.io/node:10.19-alpine AS build-stage

RUN adduser -D sendy

WORKDIR /cc

RUN chown -R sendy:sendy /cc
RUN chown -R sendy:sendy /home/sendy/

ARG APP_ENV
ENV APP_ENV=$APP_ENV

COPY package.json ./

RUN npm install  --only=production && npm cache clean --force

COPY --chown=sendy:sendy . .

RUN npm run build

USER sendy:sendy


########
FROM sendy-docker-local.jfrog.io/node:10.19-alpine

RUN adduser -D sendy

WORKDIR /cc

RUN chown -R sendy:sendy /cc
RUN chown -R sendy:sendy /home/sendy/

COPY --from=build-stage --chown=sendy:sendy /cc ./

ENV HOST 0.0.0.0

#this installs dumb-init - a minimalistic init system for docker containers
RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_x86_64
RUN chmod +x /usr/local/bin/dumb-init

USER sendy:sendy

EXPOSE 8080

CMD [ "dumb-init", "npm", "start" ]
