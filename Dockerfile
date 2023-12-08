# Use the official Node.js LTS Alpine image as a base
FROM node:lts-alpine

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app

# Install required dependencies for Puppeteer
RUN apk add --no-cache \
  udev \
  ttf-freefont \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  fontconfig

# Set Puppeteer to use the installed Chromium instead of downloading its own
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy package files for better caching of npm install
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

# Install npm packages
RUN npm install --production --silent && mv node_modules ../

# Copy the application code
COPY . .

# Expose port 3000
EXPOSE 3000


# RUN chown -R node /usr/src/app
# USER node

# Start the application
CMD ["npm", "start"]







