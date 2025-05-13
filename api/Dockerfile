# Use a Bun base image
FROM jarredsumner/bun:latest

# Set working directory inside the container
WORKDIR /src

# Copy the package.json and bun.lockb (if you have it)
COPY package.json bun.lockb ./

# Install dependencies using Bun
RUN bun install

# Copy the rest of the application files
COPY . .

# Expose the port the app will run on
EXPOSE 7000

# Start the app in development mode with Bun (using bun dev for hot reload)
CMD ["bun", "dev", "src/index.ts"]
