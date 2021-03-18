FROM sendy-docker-local.jfrog.io/node:10.19-alpine AS build-stage

RUN adduser -D sendy

RUN mkdir /cc 
   
RUN chown -R sendy:sendy /cc
RUN chown -R sendy:sendy /home/sendy/
WORKDIR /cc
ADD package.json .

USER sendy:sendy
RUN npm install

COPY --chown=sendy:sendy . .
ARG APP_ENV

ENV APP_ENV=$APP_ENV
RUN npm run build


########
FROM sendy-docker-local.jfrog.io/node:10.19-alpine 

RUN adduser -D sendy

RUN mkdir /cc 
    
RUN chown -R sendy:sendy /cc
RUN chown -R sendy:sendy /home/sendy/

WORKDIR /cc
COPY --from=build-stage /cc .

USER sendy
EXPOSE 8080

ENV HOST 0.0.0.0

CMD [ "npm", "start" ]