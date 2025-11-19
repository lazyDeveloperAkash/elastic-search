
FROM node:22

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema and source code
COPY prisma ./prisma
COPY src ./src
COPY .env ./

# ✅ Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 8080

# Start app
CMD ["npm", "run", "dev"]
