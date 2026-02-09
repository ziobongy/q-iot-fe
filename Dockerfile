FROM node:23.11-alpine AS builder
WORKDIR /app

ARG NPM_LOGLEVEL=verbose
ENV NPM_CONFIG_LOGLEVEL=$NPM_LOGLEVEL

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build


FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]