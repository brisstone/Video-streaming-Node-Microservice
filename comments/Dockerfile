FROM node

WORKDIR /app/comments

# copy: source location
COPY package.json .

RUN npm install

COPY . .

EXPOSE 8004

CMD ["npm", "start"]