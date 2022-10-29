FROM node

WORKDIR /app/posts

# copy: source location
COPY package.json .

RUN npm install

COPY . .

EXPOSE 8003

CMD ["npm", "start"]