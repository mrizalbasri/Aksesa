# Project Root Configuration

## About Aksesa

Aksesa adalah platform credit scoring berbasis AI untuk UMKM Indonesia yang tidak memiliki laporan keuangan formal.

## Project Structure

```
Aksesa/
├── backend/                 # FastAPI Python backend
│   ├── main.py             # Entry point
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example        # Environment template
│   ├── routes/             # API endpoints
│   ├── services/           # Azure integrations
│   └── models/             # Database models
├── frontend/               # Next.js React frontend
│   ├── pages/              # Page components
│   ├── components/         # Reusable components
│   ├── styles/             # Global styles
│   ├── package.json        # Node dependencies
│   ├── tsconfig.json       # TypeScript config
│   ├── next.config.js      # Next.js config
│   ├── tailwind.config.js  # Tailwind config
│   └── .env.local.example  # Environment template
└── ml/                     # Machine learning module
    ├── train_model.py      # Model training script
    ├── requirements.txt    # ML dependencies
    ├── notebooks/          # Jupyter notebooks
    └── dataset/            # Training datasets
```

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Configure Azure credentials in .env
python -m uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

## Azure Services Required

- Azure OpenAI (GPT-4o)
- Azure Machine Learning
- Azure Document Intelligence
- Azure App Service
- Azure Blob Storage
- Azure SQL Database

## Development Status

- ✅ Project structure created
- ✅ Backend scaffold with FastAPI
- ✅ Frontend scaffold with Next.js
- ✅ Dependencies installed
- ⏳ Azure service integration (in progress)
- ⏳ ML model development (in progress)
- ⏳ Feature implementation (pending)

## Next Steps

1. Configure Azure credentials in `.env` files
2. Implement Azure service integrations
3. Develop ML credit scoring model
4. Build UI components
5. Integrate frontend with backend API
6. Deploy to Azure App Service
