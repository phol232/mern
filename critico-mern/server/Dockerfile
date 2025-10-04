# Stage 1: install dependencies with dev tooling
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: run automated tests to guarantee quality
FROM deps AS test
COPY . .
RUN npm run test:ci

# Stage 3: production image with only runtime deps
FROM node:18-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=test /app /app
RUN rm -rf node_modules && npm ci --omit=dev
EXPOSE 4000
CMD ["npm", "start"]
