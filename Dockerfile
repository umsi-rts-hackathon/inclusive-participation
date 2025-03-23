FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build  # assumes you have a build script

# ---- Production image ----
FROM node:22-slim

# install 'serve' to serve the static build
RUN npm install -g serve

WORKDIR /app

# Copy built app from previous stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
