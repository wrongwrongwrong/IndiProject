#!/bin/bash

# Ultra Simple Google Cloud Deployment (No Docker required)
set -e

echo "🚀 GameServer Pro - Simple Cloud Deployment"
echo "=========================================="

# Step 1: Enable APIs
echo "📡 Enabling APIs..."
gcloud services enable container.googleapis.com

# Step 2: Create cluster
echo "🏗️  Creating cluster..."
gcloud container clusters create gameserver-cluster \
    --zone=us-central1-a \
    --num-nodes=1 \
    --machine-type=e2-small

# Step 3: Connect
echo "🔑 Connecting to cluster..."
gcloud container clusters get-credentials gameserver-cluster --zone=us-central1-a

# Step 4: Test
echo "✅ Testing connection..."
kubectl cluster-info

# Step 5: Deploy (using a simple nginx pod for now)
echo "🚀 Deploying simple app..."
kubectl create deployment gameserver-pro --image=nginx:latest
kubectl expose deployment gameserver-pro --port=80 --type=LoadBalancer

# Step 6: Wait
echo "⏳ Waiting for deployment..."
kubectl wait --for=condition=available --timeout=300s deployment/gameserver-pro

# Step 7: Show status
echo "📊 Status:"
kubectl get pods
kubectl get service

echo ""
echo "🎉 Done! Your app is running."
echo "Get the external IP with: kubectl get service gameserver-pro"
