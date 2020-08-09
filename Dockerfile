FROM node:10.15
RUN useradd -u 3000 sendy

RUN mkdir /cc && \
    mkdir /home/sendy
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
EXPOSE 8080

ENV HOST 0.0.0.0

CMD [ "npm", "start" ]