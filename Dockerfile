FROM node:18

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production 

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]

