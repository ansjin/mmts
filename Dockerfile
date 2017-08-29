FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/mmts
WORKDIR /usr/src/mmts

# Install app dependencies
COPY package.json /usr/src/mmts/
RUN npm install
# Bundle app source
COPY . /usr/src/mmts

EXPOSE 8080

CMD [ "npm", "start"]

