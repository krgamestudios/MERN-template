FROM node:15

# Change working directory
WORKDIR "/app"

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm production packages 
RUN npm install

COPY . /app

EXPOSE 3000

USER node

ENTRYPOINT ["npm", "start"]