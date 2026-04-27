# 📦 Deployment Guide — Aksesa to Azure

## 🎯 Overview

This guide covers **3 deployment methods**:
1. ⚡ **Azure Developer CLI** (Recommended - 5 minutes)
2. 🔧 **Manual Azure Portal** (10-15 minutes)
3. 🐳 **Docker locally** (For testing before deployment)

---

## ⚡ Method 1: Azure Developer CLI (Recommended)

### Prerequisites
- Azure account with active subscription
- Azure Developer CLI (`azd`) installed
- Docker installed (for building images)
- Git

### Installation

```bash
# Install Azure Developer CLI (one-time setup)
# https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd

# macOS
brew tap azure/azd && brew install azd

# Windows (Winget)
winget install microsoft.azd

# Linux
curl -fsSL https://aka.ms/install-azd.sh | bash

# Verify installation
azd --version
```

### Step 1: Login to Azure

```bash
azd auth login
# This opens browser to authenticate with your Azure account
```

### Step 2: Deploy Infrastructure & App

```bash
# From project root
cd aksesa

azd up
# Follow prompts:
# 1. Environment name (e.g., "prod", "demo")
# 2. Subscription (select your subscription)
# 3. Location (e.g., "eastasia", "southeastasia")

# This will:
# ✅ Create resource group
# ✅ Deploy Bicep infrastructure (App Service, SQL, Storage, OpenAI, etc.)
# ✅ Build Docker images for frontend & backend
# ✅ Push images to Azure Container Registry
# ✅ Deploy to App Service
# ✅ Run post-provision hooks (grant SQL permissions)
# ✅ Configure environment variables
```

**⏱️ Time: ~5-10 minutes**

### Step 3: Configure Application Settings

After deployment, add your Azure credentials to App Service config:

```bash
# Get app names
azd env get-values | grep SERVICE

# Set environment variables in App Service (Azure Portal or CLI)
az webapp config appsettings set \
  --resource-group <resource-group> \
  --name <api-app-name> \
  --settings \
    AZURE_OPENAI_API_KEY="your-key" \
    AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o" \
    AZURE_DOC_INTEL_KEY="your-key" \
    AZURE_STORAGE_CONNECTION_STRING="your-connection-string" \
    SECRET_KEY="your-super-secret-key" \
    ALLOWED_ORIGINS="https://<your-web-app>.azurewebsites.net,http://localhost:3000"
```

### Step 4: Verify Deployment

```bash
# Get deployment endpoints
azd env get-values

# Output:
# AZURE_LOCATION=eastasia
# SERVICE_WEB_NAME=aksesa-web-xxxxx
# SERVICE_API_NAME=aksesa-api-xxxxx
# WEB_ENDPOINT=https://aksesa-web-xxxxx.azurewebsites.net
# API_ENDPOINT=https://aksesa-api-xxxxx.azurewebsites.net

# Test frontend
curl https://aksesa-web-xxxxx.azurewebsites.net

# Test backend
curl https://aksesa-api-xxxxx.azurewebsites.net/health

# View Swagger API docs
# https://aksesa-api-xxxxx.azurewebsites.net/docs
```

### Step 5: View Logs

```bash
# Stream logs in real-time
az webapp log tail --resource-group <resource-group> --name <api-app-name>

# Or view in Azure Portal:
# Resource Group → App Service → "Log Stream" tab
```

---

## 🔧 Method 2: Manual Deployment (Azure Portal)

### Step 1: Create Resource Group

```bash
az group create \
  --name aksesa-rg \
  --location eastasia

# Output: "successfully created"
```

### Step 2: Create App Service Plan

```bash
az appservice plan create \
  --name aksesa-plan \
  --resource-group aksesa-rg \
  --sku B1 \
  --is-linux
```

### Step 3: Create Web App (Frontend)

```bash
az webapp create \
  --resource-group aksesa-rg \
  --plan aksesa-plan \
  --name aksesa-web-001 \
  --runtime "NODE|20-lts"

# Configure for Next.js
az webapp config set \
  --resource-group aksesa-rg \
  --name aksesa-web-001 \
  --startup-file "node server.js"
```

### Step 4: Create API App (Backend)

```bash
az webapp create \
  --resource-group aksesa-rg \
  --plan aksesa-plan \
  --name aksesa-api-001 \
  --runtime "PYTHON|3.11"

# Set startup command
az webapp config set \
  --resource-group aksesa-rg \
  --name aksesa-api-001 \
  --startup-file "python -m uvicorn main:app --host 0.0.0.0 --port 8000"
```

### Step 5: Create Azure SQL Database

```bash
# Create SQL server
az sql server create \
  --resource-group aksesa-rg \
  --name aksesa-sql-001 \
  --admin-user sqladmin \
  --admin-password "ComplexPassword123!"

# Create database
az sql db create \
  --resource-group aksesa-rg \
  --server aksesa-sql-001 \
  --name Aksesa_db

# Open firewall to Azure services
az sql server firewall-rule create \
  --resource-group aksesa-rg \
  --server aksesa-sql-001 \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### Step 6: Create Azure OpenAI

```bash
az cognitiveservices account create \
  --resource-group aksesa-rg \
  --name aksesa-openai \
  --kind OpenAI \
  --sku S0 \
  --location eastasia \
  --yes

# Get keys
az cognitiveservices account keys list \
  --resource-group aksesa-rg \
  --name aksesa-openai
```

### Step 7: Create Document Intelligence

```bash
az cognitiveservices account create \
  --resource-group aksesa-rg \
  --name aksesa-docintl \
  --kind FormRecognizer \
  --sku S0 \
  --location eastasia \
  --yes
```

### Step 8: Create Storage Account

```bash
az storage account create \
  --resource-group aksesa-rg \
  --name aksesastorage001 \
  --sku Standard_LRS

# Create container
az storage container create \
  --account-name aksesastorage001 \
  --name documents
```

### Step 9: Deploy Code

#### Deploy Frontend

```bash
cd frontend
npm run build

# Deploy to App Service
az webapp up \
  --resource-group aksesa-rg \
  --name aksesa-web-001 \
  --plan aksesa-plan \
  --runtime "NODE|20-lts"
```

#### Deploy Backend

```bash
cd backend

# Create deployment ZIP
zip -r deployment.zip . -x "venv/*" ".venv/*"

# Deploy
az webapp deployment source config-zip \
  --resource-group aksesa-rg \
  --name aksesa-api-001 \
  --src deployment.zip
```

### Step 10: Configure Environment Variables

```bash
# Set app settings
az webapp config appsettings set \
  --resource-group aksesa-rg \
  --name aksesa-api-001 \
  --settings \
    AZURE_OPENAI_API_KEY="your-key" \
    AZURE_OPENAI_ENDPOINT="https://aksesa-openai.openai.azure.com/" \
    AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o" \
    AZURE_DOC_INTEL_ENDPOINT="https://aksesa-docintl.cognitiveservices.azure.com/" \
    AZURE_DOC_INTEL_KEY="your-key" \
    AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=aksesastorage001;..." \
    AZURE_SQL_SERVER="aksesa-sql-001.database.windows.net" \
    AZURE_SQL_DATABASE="Aksesa_db" \
    AZURE_SQL_USER="sqladmin" \
    AZURE_SQL_PASSWORD="ComplexPassword123!" \
    SECRET_KEY="your-super-secret-key" \
    ALLOWED_ORIGINS="https://aksesa-web-001.azurewebsites.net" \
    DEBUG="false"
```

### Step 11: Grant SQL Permissions

```bash
# SSH into App Service and run grant script
az webapp create-remote-connection \
  --resource-group aksesa-rg \
  --name aksesa-api-001

# Or run SQL grant queries manually in SQL Management Studio
```

---

## 🐳 Method 3: Local Docker Testing

### Prerequisites
- Docker & Docker Compose installed

### Step 1: Build Images

```bash
cd aksesa

# Build frontend
docker build -f frontend/Dockerfile -t aksesa-web:latest ./frontend

# Build backend
docker build -f backend/Dockerfile -t aksesa-api:latest ./backend
```

### Step 2: Run with Docker Compose

```bash
# Create docker-compose.yml if not exists
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_BASE_URL: http://localhost:8000
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: development
    ports:
      - "8000:8000"
    environment:
      DEBUG: "true"
      DB_SQLITE_PATH: ./aksesa.db
      SECRET_KEY: dev-secret-key-change-in-prod
      ALLOWED_ORIGINS: http://localhost:3000
      AZURE_OPENAI_API_KEY: ${AZURE_OPENAI_API_KEY:-}
      AZURE_DOC_INTEL_KEY: ${AZURE_DOC_INTEL_KEY:-}
    volumes:
      - ./backend:/app
    command: python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

  db:
    image: mcr.microsoft.com/mssql/server:2019-latest
    environment:
      SA_PASSWORD: "YourComplexPassword123!"
      ACCEPT_EULA: "Y"
    ports:
      - "1433:1433"
    volumes:
      - mssql_data:/var/opt/mssql

volumes:
  mssql_data:
EOF

# Run
docker-compose up
```

### Step 3: Test

```bash
# Frontend
http://localhost:3000

# Backend Swagger
http://localhost:8000/docs

# Backend Health
curl http://localhost:8000/health
```

---

## 🔑 Environment Variables Reference

### Required for Azure Deployment

```bash
# Azure OpenAI
AZURE_OPENAI_API_KEY=           # Get from Azure Portal
AZURE_OPENAI_ENDPOINT=          # e.g., https://resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=   # e.g., gpt-4o

# Document Intelligence
AZURE_DOC_INTEL_ENDPOINT=       # e.g., https://resource.cognitiveservices.azure.com/
AZURE_DOC_INTEL_KEY=            # Get from Azure Portal

# Storage
AZURE_STORAGE_CONNECTION_STRING= # Get from Storage Account → Access keys

# SQL Database
AZURE_SQL_SERVER=               # e.g., server.database.windows.net
AZURE_SQL_DATABASE=             # e.g., Aksesa_db
AZURE_SQL_USER=                 # e.g., sqladmin
AZURE_SQL_PASSWORD=             # Strong password

# Application
SECRET_KEY=                     # Use strong random string
DEBUG=                          # false in production
ALLOWED_ORIGINS=                # Comma-separated frontend URLs
```

### Optional

```bash
# Database (if not using Azure SQL)
DB_SQLITE_PATH=./aksesa.db      # Default for local dev

# Google Sign-In
GOOGLE_CLIENT_ID=               # From Google Cloud Console

# LLM Fallback
GROQ_API_KEY=                   # Fallback if Azure OpenAI unavailable
```

---

## 🚀 Post-Deployment Checklist

- [ ] Frontend loads at `https://<web-app>.azurewebsites.net`
- [ ] Backend API responds at `https://<api-app>.azurewebsites.net/docs`
- [ ] Landing page renders correctly
- [ ] Login/signup works
- [ ] Can upload invoice image for OCR
- [ ] Scoring endpoint returns valid results
- [ ] Results saved to database
- [ ] Can export PDF report
- [ ] Logs visible in Application Insights
- [ ] CORS errors resolved (if any)

---

## 🐛 Troubleshooting

### Frontend not loading

```bash
# Check logs
az webapp log tail --resource-group aksesa-rg --name aksesa-web-001

# Check environment variables
az webapp config appsettings list --resource-group aksesa-rg --name aksesa-web-001

# Verify NEXT_PUBLIC_API_BASE_URL is correct
```

### Backend 500 errors

```bash
# View logs
az webapp log tail --resource-group aksesa-rg --name aksesa-api-001

# Check if ML models exist
# SSH into App Service and verify ml/models/credit_model.pkl

# Check database connection
# SQL query: SELECT * FROM Users;
```

### CORS errors

```bash
# Update ALLOWED_ORIGINS
az webapp config appsettings set \
  --resource-group aksesa-rg \
  --name aksesa-api-001 \
  --settings \
    ALLOWED_ORIGINS="https://aksesa-web-001.azurewebsites.net"
```

### SQL authentication fails

```bash
# Run grant script
./scripts/grant-sql-access.sh

# Or manually:
az sql db query \
  --server aksesa-sql-001 \
  --database Aksesa_db \
  --auth-mode ActiveDirectoryDefault \
  --queries "CREATE USER [aksesa-api-001] FROM EXTERNAL PROVIDER;"
```

---

## 📊 Monitoring & Logging

### Application Insights

```bash
# View performance metrics
# https://portal.azure.com → Resource Group → App Insights → Performance

# View logs
# App Insights → Logs → Write KQL query
```

### Custom Monitoring

```python
# In backend code (FastAPI middleware)
from applicationinsights import TelemetryClient

client = TelemetryClient('instrumentation-key')
client.track_event('scoring_completed', {'score': 85})
```

---

## 🔒 Security Best Practices

1. **Secrets Management**
   - ✅ Use Azure Key Vault for sensitive data
   - ✅ Never commit `.env` files
   - ✅ Use managed identities instead of connection strings

2. **Database**
   - ✅ Enable SQL Database encryption
   - ✅ Use Azure AD authentication
   - ✅ Regularly backup database

3. **API**
   - ✅ Enable CORS only for trusted origins
   - ✅ Use HTTPS everywhere (enforced by Azure)
   - ✅ Implement rate limiting

4. **Network**
   - ✅ Use Azure VNet if needed
   - ✅ Restrict firewall rules
   - ✅ Enable DDOS protection

---

## 💰 Cost Estimation (Monthly)

| Service | SKU | Cost |
|---------|-----|------|
| App Service | B1 | ~$50 |
| SQL Database | Basic | ~$10 |
| Blob Storage | Standard LRS | ~$0.02/GB |
| OpenAI | S0 | ~$15/1M tokens |
| Document Intelligence | S0 | ~$1.50/100 pages |
| **Total** | | **~$80-150/month** |

*Prices vary by region. See [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/)*

---

## 📚 Additional Resources

- [Azure Developer CLI Docs](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/)
- [Bicep Documentation](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Next.js on Azure](https://learn.microsoft.com/en-us/azure/app-service/quickstart-nodejs?tabs=linux&pivots=development-environment-nodejs)
- [Azure SQL Best Practices](https://learn.microsoft.com/en-us/azure/azure-sql/database/best-practices)

---

## ❓ Need Help?

- 📧 Email: support@aksesa.id
- 🐛 Report issues: [GitHub Issues](https://github.com/username/aksesa/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/username/aksesa/discussions)

---

**Last Updated**: 2026-04-27  
**Status**: Production Ready ✅
