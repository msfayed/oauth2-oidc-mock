FROM node:18

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

#RUN npm install -g npm@9.8.1
RUN npm install -g oauth2-mock-server

RUN npm install
# If you are building your code for production
#RUN npm ci --omit=dev

COPY index.js .

EXPOSE 8090
CMD [ "node", "index.js" ]