#!/bin/bash

# Quick Local Kubernetes Deployment Script
# This script deploys GameServer Pro to a local Kubernetes cluster (minikube/kind)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

NAMESPACE="gameserver-pro"

echo -e "${BLUE}🚀 GameServer Pro Quick Deployment${NC}"
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

# Check if we're connected to a Kubernetes cluster
if ! kubectl cluster-info &> /dev/null; then
    print_error "Not connected to a Kubernetes cluster."
    echo "Please start your local cluster:"
    echo "  For minikube: minikube start"
    echo "  For kind: kind create cluster"
    exit 1
fi

print_status "Connected to Kubernetes cluster: $(kubectl config current-context)"

# Build Docker image
echo -e "\n${BLUE}🐳 Building Docker image...${NC}"

# Check if we're using minikube
if kubectl config current-context | grep -q minikube; then
    print_warning "Using minikube - setting docker environment"
    eval $(minikube docker-env)
fi

docker build -t gameserver-pro:latest -f docker/Dockerfile-simple .
print_status "Docker image built successfully"

# Apply Kubernetes configuration
echo -e "\n${BLUE}🔧 Applying Kubernetes configuration...${NC}"
kubectl apply -f k8s/simple-deployment.yaml
print_status "Kubernetes configuration applied"

# Wait for deployment to be ready
echo -e "\n${BLUE}⏳ Waiting for deployment to be ready...${NC}"
kubectl wait --for=condition=available --timeout=300s deployment/gameserver-pro-deployment -n $NAMESPACE
print_status "Deployment is ready"

# Get service information
echo -e "\n${BLUE}🌐 Service Information${NC}"
echo "========================"

# Get service URL
if kubectl config current-context | grep -q minikube; then
    SERVICE_URL=$(minikube service gameserver-pro-service -n $NAMESPACE --url)
    print_status "Service URL: $SERVICE_URL"
elif kubectl config current-context | grep -q kind; then
    PORT=$(kubectl get service gameserver-pro-service -n $NAMESPACE -o jsonpath='{.spec.ports[0].nodePort}')
    print_status "Service accessible at: http://localhost:$PORT"
else
    LB_IP=$(kubectl get service gameserver-pro-service -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "Pending")
    if [ "$LB_IP" = "Pending" ]; then
        print_warning "LoadBalancer IP is still pending."
    else
        print_status "LoadBalancer IP: $LB_IP"
    fi
fi

# Show pod status
echo -e "\n${BLUE}📊 Pod Status${NC}"
kubectl get pods -n $NAMESPACE

# Show services
echo -e "\n${BLUE}🔗 Services${NC}"
kubectl get services -n $NAMESPACE

echo -e "\n${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo "Your GameServer Pro application is now running in Kubernetes!"
echo ""
echo "Useful commands:"
echo "- View logs: kubectl logs -f deployment/gameserver-pro-deployment -n $NAMESPACE"
echo "- Scale deployment: kubectl scale deployment gameserver-pro-deployment --replicas=5 -n $NAMESPACE"
echo "- Delete deployment: kubectl delete namespace $NAMESPACE"
echo "- Port forward: kubectl port-forward service/gameserver-pro-service 3000:80 -n $NAMESPACE"
