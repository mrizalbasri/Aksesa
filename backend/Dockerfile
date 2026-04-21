# Stage 1: Base
FROM python:3.11-slim AS base
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Development (optional - can be used for debugging)
FROM base AS development
ENV DEBUG=true
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# Stage 3: Production
FROM base AS production
ENV DEBUG=false

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash appuser
USER appuser
WORKDIR /app

# Copy application files
COPY --chown=appuser:appuser . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]