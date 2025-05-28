# Stage 1: Build React client
FROM node:18 AS client-build
WORKDIR /app
COPY client/package.json client/package-lock.json ./client/
RUN cd client && npm install
COPY client ./client
RUN cd client && npm run build

# Stage 2: Build server and final image
FROM node:18 AS server
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY server ./server
# Copy built client
COPY --from=client-build /app/client/build ./client/build
COPY index.json ./


EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "server/index.js"] 