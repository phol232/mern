# Stage 1: dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: run unit/integration tests
FROM deps AS test
COPY . .
RUN npm run test:ci

# Stage 3: build optimized assets
FROM deps AS build
COPY . .
RUN npm run build

# Stage 4: static server
FROM nginx:1.25-alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
