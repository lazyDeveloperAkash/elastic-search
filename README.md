# 🚀 Elastic Search Web App

A modern **full-stack search platform** built with:

-   **Elasticsearch** -- ultra-fast, intelligent search\
-   **Kibana** -- analytics and search visualization\
-   **Node.js + Express** -- backend REST API\
-   **React.js (Vite)** -- high-performance frontend UI\
-   **PostgreSQL + Prisma** -- relational database + ORM\
-   **Docker + Docker Compose** -- fully containerized environment

This application implements **real-time search capabilities** commonly
found in large-scale platforms like Amazon, Flipkart, and Netflix.

------------------------------------------------------------------------

## 🔍 Core Search Features

### **1. Smart Search Recommendations**

As the user types, Elasticsearch returns real-time suggestions based on
relevance scoring.

### **2. Related Products on Product Page**

Each product shows similar items using Elasticsearch keyword, text, or
vector similarity.

### **3. Fuzzy Search (Typo Handling)**

Misspellings and partial queries still return correct results.\
**Example:** `"iphon" → "iPhone"`

------------------------------------------------------------------------

## 📦 Tech Stack

### **Frontend**

-   React.js (Vite)
-   Axios

### **Backend**

-   Node.js
-   Express.js
-   Prisma ORM
-   PostgreSQL
-   Elasticsearch

### **Tools & DevOps**

-   Docker\
-   Docker Compose\
-   Kibana\
-   Prisma Studio

------------------------------------------------------------------------

## 🏗️ Project Structure

    root/
    │── docker-compose.yml
    │── server/          # Node.js backend
    │── client/          # React.js (Vite) frontend
    │── prisma/          # Prisma schema & migrations
    └── README.md

------------------------------------------------------------------------

## 🐳 Running the Project with Docker

### **1. Clone Repository**

``` sh
git clone https://github.com/lazyDeveloperAkash/elastic-search.git

cd elastic-search
```

### **2. Start All Services**

``` sh
docker compose up --build
```

### Services & Ports

  Service             Port     Description
  ------------------- -------- ---------------------
  Frontend (Vite)     `5173`   UI
  Backend (Node.js)   `8080`   API
  Elasticsearch       `9200`   Search engine
  Kibana              `5601`   Analytics dashboard
  PostgreSQL          `5433`   Database
  Prisma Studio       `5555`   DB explorer

------------------------------------------------------------------------

## 🌐 Access URLs

  App                URL
  ------------------ -----------------------
  Frontend           http://localhost:5173
  Backend API        http://localhost:8080
  Elasticsearch      http://localhost:9200
  Kibana Dashboard   http://localhost:5601
  Prisma Studio      http://localhost:5555

------------------------------------------------------------------------

## 🔧 Development Mode (Without Docker)

### **Backend**

``` sh
cd server
npm install
npm run dev
```

### **Frontend**

``` sh
cd client
npm install
npm run dev
```

### **Prisma**

``` sh
npx prisma migrate dev
npx prisma studio
```

------------------------------------------------------------------------

## 📊 Using Kibana

-   Visit **http://localhost:5601**
-   Connect to Elasticsearch
-   Create index patterns
-   View search analytics, logs, and insights

------------------------------------------------------------------------

## 🏁 Conclusion

This project is a complete search ecosystem demonstrating how modern
apps use Elasticsearch for:

-   Smart recommendations\
-   Fuzzy matching\
-   High‑speed querying\
-   Related product discovery
