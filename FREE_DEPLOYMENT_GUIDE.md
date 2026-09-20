# 🌐 100% Free Cloud Deployment & PostgreSQL Connection Guide

This guide details how to deploy the **QR Safety Reporting System** live on the web with a **100% Free Cloud PostgreSQL Database** (zero credit card required).

---

## 🟢 Step 1: Create a 100% Free Cloud PostgreSQL Database (Neon.tech or Supabase)

### Option A: Neon.tech (Recommended - Takes 1 Minute)
1. Go to [https://neon.tech](https://neon.tech) and sign up for free (Sign in with GitHub/Google).
2. Click **Create Project**, name it `qr-safety-db`.
3. Neon will display your database connection details. Copy the **Connection String**:
   ```env
   postgres://username:password@ep-xyz.region.aws.neon.tech/neondb?sslmode=require
   ```
4. Note your credentials:
   - `Host`: `ep-xyz.region.aws.neon.tech`
   - `Database`: `neondb`
   - `Username`: `username`
   - `Password`: `password`
   - `JDBC URL`: `jdbc:postgresql://ep-xyz.region.aws.neon.tech:5432/neondb?sslmode=require`

---

## 🚀 Step 2: Deploy Spring Boot Backend for FREE (Render.com)

1. Sign up for free at [https://render.com](https://render.com).
2. Click **New +** ➔ **Web Service**.
3. Select **Build and deploy from a Git repository** (Push your `qr-safety-system` folder to GitHub) OR select **Deploy a Docker Image**.
4. Set the build settings:
   - **Environment**: Docker (Render will auto-detect `backend/Dockerfile`)
   - **Instance Type**: Free ($0/month)
5. Under **Environment Variables**, add the following 4 variables:

   | Key | Value |
   | --- | --- |
   | `SPRING_DATASOURCE_URL` | `jdbc:postgresql://<your-neon-host>:5432/neondb?sslmode=require` |
   | `SPRING_DATASOURCE_DRIVER` | `org.postgresql.Driver` |
   | `SPRING_DATASOURCE_USERNAME` | `<your-neon-username>` |
   | `SPRING_DATASOURCE_PASSWORD` | `<your-neon-password>` |
   | `SPRING_JPA_DATABASE_PLATFORM` | `org.hibernate.dialect.PostgreSQLDialect` |

6. Click **Create Web Service**.
7. Render will build and launch your backend API for free at:
   `https://qr-safety-backend.onrender.com`

---

## ⚡ Step 3: Deploy React Frontend for FREE (Vercel / Netlify)

1. Sign up for free at [https://vercel.com](https://vercel.com).
2. Click **Add New...** ➔ **Project**.
3. Import your GitHub repository, selecting the `frontend` folder.
4. Framework Preset: **Vite**
5. Under **Environment Variables**, add:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://qr-safety-backend.onrender.com` (Your Render backend URL from Step 2)
6. Click **Deploy**.
7. Vercel will instantly publish your live web link at:
   `https://qr-safety-system.vercel.app`

---

## 🧪 Local PostgreSQL Connection Test (Alternative)

If you wish to test PostgreSQL on your local machine before pushing online:

Set environment variables in PowerShell:
```powershell
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/safety_db"
$env:SPRING_DATASOURCE_DRIVER="org.postgresql.Driver"
$env:SPRING_DATASOURCE_USERNAME="postgres"
$env:SPRING_DATASOURCE_PASSWORD="yourpassword"
$env:SPRING_JPA_DATABASE_PLATFORM="org.hibernate.dialect.PostgreSQLDialect"

cd backend
java -jar target/backend-0.0.1-SNAPSHOT.jar
```
