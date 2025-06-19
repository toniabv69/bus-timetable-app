# ---- Build Stage ----
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

RUN apk add --no-cache python3 make g++

# ---- Production Stage ----
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/package*.json ./
RUN npm install --omit=dev --ignore-scripts

COPY --from=build /app/dist ./dist
COPY --from=build /app/db /app/db
COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh
RUN apk add --no-cache bash

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["/app/wait-for-it.sh", "-h", "bus_postgres", "-p", "5432", "--", "sh", "-c", "node dist/db/seed.js && node dist/index.js"]