FROM node:22-alpine AS base

FROM base as Production

WORKDIR /app

COPY package.json yarn.lock ./

RUN apk --no-cache add curl

RUN yarn --frozen-lockfile

COPY . .

# Set environment variables using ARG and ENV
ARG AUTH_SECRET
ARG AUTH_URL
ARG NEXT_PUBLIC_APP_API_BASE_URL

ENV AUTH_SECRET=${AUTH_SECRET}
ENV AUTH_URL=${AUTH_URL}
ENV NEXT_PUBLIC_APP_API_BASE_URL=${NEXT_PUBLIC_APP_API_BASE_URL}

RUN yarn build

CMD ["yarn", "start"]

# development image

# FROM base AS development

# WORKDIR /app

# COPY package.json yarn.lock ./

# RUN yarn

# COPY . .