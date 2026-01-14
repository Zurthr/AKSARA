FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG NUXT_PUBLIC_API_BASE_URL=https://aksara-api.fruz.xyz/api
ARG NUXT_PUBLIC_EXTERNAL_API_URL=https://aksara-external.fruz.xyz/api
ARG NUXT_PUBLIC_EMBED_API_URL=https://aksara.fruz.xyz/api
ENV NUXT_PUBLIC_API_BASE_URL=$NUXT_PUBLIC_API_BASE_URL
ENV NUXT_PUBLIC_EXTERNAL_API_URL=$NUXT_PUBLIC_EXTERNAL_API_URL
ENV NUXT_PUBLIC_EMBED_API_URL=$NUXT_PUBLIC_EMBED_API_URL
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
