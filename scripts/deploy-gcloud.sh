#!/bin/bash

# Simple Google Cloud Shell Deployment Script
set -e

echo "🚀 GameServer Pro - Google Cloud Deployment"
echo "=========================================="

# Check if we're in Google Cloud Shell
if [ -z "$CLOUD_SHELL" ]; then
    echo "⚠️  This script is designed for Google Cloud Shell"
fi

# Step 1: Enable required APIs
echo "📡 Enabling Google Cloud APIs..."
gcloud services enable container.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Step 2: Create GKE cluster
echo "🏗️  Creating GKE cluster..."
gcloud container clusters create gameserver-cluster \
    --zone=us-central1-a \
    --num-nodes=1 \
    --machine-type=e2-small \
    --enable-autoscaling \
    --min-nodes=1 \
    --max-nodes=3

# Step 3: Get cluster credentials
echo "🔑 Getting cluster credentials..."
gcloud container clusters get-credentials gameserver-cluster --zone=us-central1-a

# Step 4: Verify connection
echo "✅ Testing cluster connection..."
kubectl cluster-info

# Step 5: Create namespace
echo "📦 Creating namespace..."
kubectl create namespace gameserver-pro --dry-run=client -o yaml | kubectl apply -f -

# Step 6: Build and push Docker image
echo "🐳 Building Docker image..."
docker build -t gcr.io/$(gcloud config get-value project)/gameserver-pro:latest -f docker/Dockerfile-simple .

echo "📤 Pushing to Google Container Registry..."
docker push gcr.io/$(gcloud config get-value project)/gameserver-pro:latest

# Step 7: Update the deployment with correct image
echo "🔧 Updating deployment configuration..."
sed "s|gameserver-pro:latest|gcr.io/$(gcloud config get-value project)/gameserver-pro:latest|g" k8s/simple-deployment.yaml > temp-deployment.yaml

# Step 8: Deploy to Kubernetes
echo "🚀 Deploying to Kubernetes..."
kubectl apply -f temp-deployment.yaml

# Step 9: Wait for deployment
echo "⏳ Waiting for deployment to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/gameserver-pro-deployment -n gameserver-pro

# Step 10: Get service info
echo "🌐 Getting service information..."
kubectl get service gameserver-pro-service -n gameserver-pro

# Step 11: Show pods
echo "📊 Pod status:"
kubectl get pods -n gameserver-pro

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "Your application is running in Google Cloud!"
echo "To access it, run:"
echo "kubectl port-forward service/gameserver-pro-service 8080:80 -n gameserver-pro"
echo ""
echo "Then visit: http://localhost:8080"
echo ""
echo "To delete everything:"
echo "gcloud container clusters delete gameserver-cluster --zone=us-central1-a"
