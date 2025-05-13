# Create image based on the official Node 12 image from dockerhub
FROM node:18-alpine



# Change directory so that our commands run inside this new directory
WORKDIR /src

# Copy dependency definitions
COPY package.json 

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . .

# Expose the port the app runs in
EXPOSE 5173

# Serve the app
CMD ["npm", "run","dev"]