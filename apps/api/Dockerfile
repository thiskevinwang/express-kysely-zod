FROM --platform=linux/amd64 node:18-alpine3.17 AS deps

WORKDIR /app

COPY package.json ./
# COPY package-lock.json ./

RUN npm i

FROM --platform=linux/amd64 node:18-alpine3.17 AS app

WORKDIR /app

COPY --from=deps /app/package.json ./
COPY --from=deps /app/package-lock.json ./
COPY --from=deps /app/node_modules/ ./node_modules/

COPY .env ./
COPY controllers/ ./controllers/
COPY database/ ./database/
COPY generated/ ./generated/
COPY routes/ ./routes/
COPY spec/ ./spec/
COPY utils/ ./utils/
COPY app.ts ./app.ts
COPY server.ts ./server.ts
COPY tsconfig.json ./tsconfig.json

EXPOSE $PORT

CMD npm run start

