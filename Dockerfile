# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.13.0
FROM node:${NODE_VERSION}-alpine

# Use production node environment by default
ENV NODE_ENV=production

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package files from host's project-code folder
COPY project-code/package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Ensure node_modules and cache folder have proper permissions
RUN mkdir -p /usr/src/app/node_modules/.cache && \
    chown -R node:node /usr/src/app/node_modules/.cache


# Copy the rest of the project
COPY project-code/. .

# Run the application as a non-root user
USER node

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
