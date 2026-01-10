FROM node:22-alpine

WORKDIR /app

# Copy only package.json to force fresh lockfile creation and linux binaries
COPY package.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
