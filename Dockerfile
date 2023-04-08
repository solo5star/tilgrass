FROM node:lts-alpine AS build

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY core/package.json core/pnpm-lock.yaml ./core/
COPY backend/package.json backend/pnpm-lock.yaml ./backend/
RUN pnpm -r install

COPY . .
RUN pnpm -r build



FROM node:lts-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm
RUN mkdir -p /app/core /app/backend

COPY --from=build /app/package.json .
COPY --from=build /app/pnpm-workspace.yaml .
COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/core/node_modules ./core/node_modules
COPY --from=build /app/core/dist ./core/dist
COPY --from=build /app/core/package.json ./core/

COPY --from=build /app/backend/node_modules ./backend/node_modules
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/backend/package.json ./backend/

EXPOSE 8000
CMD ["pnpm", "start"]
