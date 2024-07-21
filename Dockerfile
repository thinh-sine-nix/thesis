FROM node:18-alpine

WORKDIR /app

RUN npm install npm@latest -g
RUN npm install -g typescript

COPY package*.json ./
RUN npm install

COPY . .

COPY tsconfig.json ./

EXPOSE 3000

CMD ["npm", "run", "dev"]
