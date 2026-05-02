#!/bin/bash
set -e
export PATH=$PATH:/Users/arun/Data-Science/Python-Projects/google-cloud-sdk/bin

# Deployment script for NexusFlow to Google Cloud Run

PROJECT_ID=$1
REGION="us-central1"

if [ -z "$PROJECT_ID" ]; then
    echo "Usage: ./deploy.sh <GCP_PROJECT_ID>"
    exit 1
fi

echo "Deploying to Google Cloud Project: $PROJECT_ID"

# 1. Deploy Frontend
echo "--- Deploying Frontend ---"
cd frontend
gcloud builds submit --tag gcr.io/$PROJECT_ID/nexusflow-frontend --project $PROJECT_ID
gcloud run deploy nexusflow-frontend \
    --image gcr.io/$PROJECT_ID/nexusflow-frontend \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --project $PROJECT_ID
cd ..

# 2. Deploy Backend
echo "--- Deploying Backend ---"
cd backend
gcloud builds submit --tag gcr.io/$PROJECT_ID/nexusflow-backend --project $PROJECT_ID
gcloud run deploy nexusflow-backend \
    --image gcr.io/$PROJECT_ID/nexusflow-backend \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --project $PROJECT_ID
cd ..

echo "--- Deployment Complete ---"
