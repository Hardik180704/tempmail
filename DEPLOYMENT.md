# TempMail - Deployment Guide 🚀

This guide explains how to deploy the entire TempMail stack (Frontend + Backend + Database + Redis) to a production environment.

## 1. Architecture Overview
We use **Docker** to containerize the application, ensuring it runs consistently anywhere.
- **Frontend**: Next.js application (Port 3000)
- **Backend**: Go API & SMTP Server (Ports 8080 & 25)
- **PostgreSQL**: Database for storage (Port 5432)
- **Redis**: Queue and Cache (Port 6379)

These 4 services are orchestrated using **Docker Compose**.

## 2. Prerequisites
You need a Virtual Private Server (VPS) with:
1.  **Docker & Docker Compose** installed.
2.  **Port 25 Open**: Essential for receiving emails. Check your provider (AWS/DigitalOcean usually block this by default; Hetzner/Vultr are more lenient).

### Recommended Providers
Since this app needs **Port 25** (SMTP) to receive emails, not all cloud providers will work out of the box.

| Provider | Port 25 Status | Recommendation |
| :--- | :--- | :--- |
| **Hetzner** | Open (ID verify required) | ⭐ **Best Choice** (Cheap & Powerful) |
| **Vultr** | Blocked (Open via Tkts) | ✅ Good Alternative |
| **DigitalOcean** | Blocked for new accts | ⚠️ Hard to unlock |
| **AWS / GCP** | Strictly Blocked | ❌ Avoid for this project |

**Note**: You typically need the cheapest "Ubuntu 22.04" or "Debian 12" server (approx $4-6/month).

## 3. Configuration
Create a `.env` file in the root directory (do NOT commit this to Git).

```env
# Database
POSTGRES_USER=tempmail
POSTGRES_PASSWORD=secure_production_password
POSTGRES_DB=tempmail_pro

# API Configuration
JWT_SECRET=generate_a_long_random_string
DOMAIN=yourdomain.com
API_BASE_URL=https://api.yourdomain.com/v1

# Frontend
NEXT_PUBLIC_API_BASE=https://api.yourdomain.com/v1
```

## 4. Deployment Steps

### Step 1: Clone & Setup
```bash
git clone https://github.com/Start-Indie/tempmail-pro.git
cd tempmail-pro
# Create your .env file here
```

### Step 2: Build & Run
We use a production compose file that builds optimized images.

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### Step 3: Verify
- **Frontend**: Visit `http://your-server-ip:3000`
- **Backend Check**: `curl http://your-server-ip:8080/health`

## 5. Production Considerations
- **Reverse Proxy**: It is highly recommended to run **Nginx** or **Caddy** in front of the services to handle SSL (HTTPS) and route traffic (e.g., `temp-mail.dev` -> Port 3000, `api.temp-mail.dev` -> Port 8080).
- **Persistence**: Ensure the `./storage` volume (if used) or Docker volumes are backed up.
- **Security**: Use a firewall (UFW) to allow only necessary ports (80, 443, 25). Do NOT expose Postgres/Redis ports (5432/6379) to the public internet.
