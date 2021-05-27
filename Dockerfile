FROM sendy-docker-local.jfrog.io/node:10.19
RUN useradd -u 3000 sendy

<<<<<<< HEAD
RUN mkdir /cc && \
    mkdir /home/sendy
=======
RUN adduser -D sendy

WORKDIR /cc

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 5a24be66 (Have docker only install packages needed for production)
=======
>>>>>>> 5a24be66 (Have docker only install packages needed for production)
=======
>>>>>>> e15e5217 (Have docker only install clean packages needed for production)
=======
>>>>>>> e15e5217 (Have docker only install clean packages needed for production)
RUN chown -R sendy:sendy /cc
RUN chown -R sendy:sendy /home/sendy/
WORKDIR /cc
ADD package.json .

<<<<<<< HEAD
USER sendy:sendy
RUN npm install
=======
ARG APP_ENV
ENV APP_ENV=$APP_ENV

COPY package.json ./

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
RUN npm install --only=production
<<<<<<< HEAD
>>>>>>> 5a24be66 (Have docker only install packages needed for production)
=======
>>>>>>> 5a24be66 (Have docker only install packages needed for production)
=======
RUN npm install --only=production && npm cache clean --force
>>>>>>> b8a2bb35 (Have docker only install clean packages needed for production)
=======
RUN npm install  --only=production && npm cache clean --force
>>>>>>> e15e5217 (Have docker only install clean packages needed for production)
=======
RUN npm install  --only=production && npm cache clean --force
>>>>>>> e15e5217 (Have docker only install clean packages needed for production)

COPY --chown=sendy:sendy . .
ARG APP_ENV

ENV APP_ENV=$APP_ENV
RUN npm run build
<<<<<<< HEAD
EXPOSE 8080

ENV HOST 0.0.0.0

CMD [ "npm", "start" ]
=======

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 5a24be66 (Have docker only install packages needed for production)
=======
>>>>>>> 5a24be66 (Have docker only install packages needed for production)
=======
>>>>>>> e15e5217 (Have docker only install clean packages needed for production)
=======
>>>>>>> e15e5217 (Have docker only install clean packages needed for production)
