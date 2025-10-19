#!/bin/bash

# GameServer Pro Cloud Deployment Script
# This script deploys the GameServer Pro application to Kubernetes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="gameserver-pro"
REGISTRY="your-registry.com"  # Replace with your container registry
IMAGE_TAG="latest"

echo -e "${BLUE}🚀 GameServer Pro Cloud Deployment${NC}"
echo "=================================="

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if we're connected to a Kubernetes cluster
if ! kubectl cluster-info &> /dev/null; then
    print_error "Not connected to a Kubernetes cluster. Please configure kubectl."
    exit 1
fi

print_status "Connected to Kubernetes cluster: $(kubectl config current-context)"

# Create namespace if it doesn't exist
echo -e "\n${BLUE}📦 Creating namespace...${NC}"
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
print_status "Namespace '$NAMESPACE' is ready"

# Build and push Docker image
echo -e "\n${BLUE}🐳 Building Docker image...${NC}"
docker build -t $REGISTRY/gameserver-pro:$IMAGE_TAG -f docker/Dockerfile .
print_status "Docker image built successfully"

echo -e "\n${BLUE}📤 Pushing Docker image to registry...${NC}"
docker push $REGISTRY/gameserver-pro:$IMAGE_TAG
print_status "Docker image pushed to registry"

# Apply Kubernetes configurations
echo -e "\n${BLUE}🔧 Applying Kubernetes configurations...${NC}"

# Apply database configuration
kubectl apply -f k8s/database.yaml
print_status "Database configuration applied"

# Apply secrets
kubectl apply -f k8s/secrets.yaml
print_status "Secrets applied"

# Apply services
kubectl apply -f k8s/services.yaml
print_status "Services configuration applied"

# Apply additional services
kubectl apply -f k8s/additional-services.yaml
print_status "Additional services applied"

# Apply nginx configuration
kubectl apply -f k8s/nginx.yaml
print_status "Nginx configuration applied"

# Wait for deployments to be ready
echo -e "\n${BLUE}⏳ Waiting for deployments to be ready...${NC}"
kubectl wait --for=condition=available --timeout=300s deployment/postgres-deployment -n $NAMESPACE
kubectl wait --for=condition=available --timeout=300s deployment/redis-deployment -n $NAMESPACE
kubectl wait --for=condition=available --timeout=300s deployment/api-gateway-deployment -n $NAMESPACE
kubectl wait --for=condition=available --timeout=300s deployment/nginx-deployment -n $NAMESPACE

print_status "All deployments are ready"

# Get service information
echo -e "\n${BLUE}🌐 Service Information${NC}"
echo "========================"

# Get LoadBalancer IP
LB_IP=$(kubectl get service nginx-service -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "Pending")

if [ "$LB_IP" = "Pending" ]; then
    print_warning "LoadBalancer IP is still pending. This may take a few minutes."
    echo "You can check the status with: kubectl get service nginx-service -n $NAMESPACE"
else
    print_status "LoadBalancer IP: $LB_IP"
    echo "Your application should be accessible at: http://$LB_IP"
fi

# Show pod status
echo -e "\n${BLUE}📊 Pod Status${NC}"
kubectl get pods -n $NAMESPACE

# Show services
echo -e "\n${BLUE}🔗 Services${NC}"
kubectl get services -n $NAMESPACE

echo -e "\n${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Configure your DNS to point to the LoadBalancer IP"
echo "2. Update SSL certificates in k8s/nginx.yaml if needed"
echo "3. Monitor your application with: kubectl logs -f deployment/api-gateway-deployment -n $NAMESPACE"
echo ""
echo "Useful commands:"
echo "- View logs: kubectl logs -f deployment/api-gateway-deployment -n $NAMESPACE"
echo "- Scale services: kubectl scale deployment api-gateway-deployment --replicas=3 -n $NAMESPACE"
echo "- Delete deployment: kubectl delete namespace $NAMESPACE"
