FROM node:10.15

RUN mkdir /cc

WORKDIR /cc

ADD package.json .

RUN npm install

COPY . .
# build necessary, even if no static files are needed,
# since it builds the server as well
ARG APP_ENV

ENV APP_ENV=$APP_ENV

#RUN chmod +x /cc/env.sh /cc/start.sh

RUN npm run build

# expose 8080 on container
EXPOSE 8080

ENV HOST 0.0.0.0

# start the app
CMD [ "npm", "start" ]