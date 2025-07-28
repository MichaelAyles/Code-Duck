# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the entire backend directory contents
COPY . .

# Install any needed packages
RUN npm install

# Build the TypeScript source
RUN npm run build

# Your app binds to port 4000, so expose it
EXPOSE 4000

# Define the command to run your app
CMD [ "npm", "run", "start" ]
