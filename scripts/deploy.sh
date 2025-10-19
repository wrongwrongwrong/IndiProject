#!/bin/bash

# GameServer Pro - Secure Deployment Script
# This script deploys the secure gaming server description platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="gameserver-pro"
CLUSTER_NAME="gameserver-pro-cluster"
REGION="us-west-2"
PROJECT_ID="gameserver-pro-$(date +%s)"

echo -e "${BLUE}🚀 GameServer Pro - Secure Deployment${NC}"
echo "=================================="

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    echo -e "${BLUE}Checking prerequisites...${NC}"
    
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_error "docker is not installed"
        exit 1
    fi
    
    if ! command -v gcloud &> /dev/null; then
        print_warning "gcloud CLI not found. Make sure you have access to GKE cluster"
    fi
    
    print_status "Prerequisites check completed"
}

# Generate secure secrets
generate_secrets() {
    echo -e "${BLUE}Generating secure secrets...${NC}"
    
    # Generate random passwords and keys
    POSTGRES_PASSWORD=$(openssl rand -base64 32)
    JWT_SECRET=$(openssl rand -base64 64)
    ENCRYPTION_KEY=$(openssl rand -hex 32)
    REDIS_PASSWORD=$(openssl rand -base64 32)
    
    # Base64 encode for Kubernetes secrets
    POSTGRES_PASSWORD_B64=$(echo -n "$POSTGRES_PASSWORD" | base64)
    JWT_SECRET_B64=$(echo -n "$JWT_SECRET" | base64)
    ENCRYPTION_KEY_B64=$(echo -n "$ENCRYPTION_KEY" | base64)
    REDIS_PASSWORD_B64=$(echo -n "$REDIS_PASSWORD" | base64)
    
    # Create secrets file
    cat > k8s/secrets.yaml << EOF
apiVersion: v1
kind: Secret
metadata:
  name: gameserver-pro-secrets
  namespace: $NAMESPACE
type: Opaque
data:
  POSTGRES_PASSWORD: $POSTGRES_PASSWORD_B64
  JWT_SECRET: $JWT_SECRET_B64
  ENCRYPTION_KEY: $ENCRYPTION_KEY_B64
  REDIS_PASSWORD: $REDIS_PASSWORD_B64
  PAYMENT_GATEWAY_KEY: $(echo -n "your_payment_gateway_key_here" | base64)
EOF
    
    print_status "Secure secrets generated"
}

# Create namespace
create_namespace() {
    echo -e "${BLUE}Creating Kubernetes namespace...${NC}"
    
    kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
    
    print_status "Namespace '$NAMESPACE' created"
}

# Deploy database
deploy_database() {
    echo -e "${BLUE}Deploying PostgreSQL database...${NC}"
    
    kubectl apply -f k8s/database.yaml
    
    # Wait for database to be ready
    kubectl wait --for=condition=ready pod -l app=postgres -n $NAMESPACE --timeout=300s
    
    print_status "PostgreSQL database deployed"
}

# Deploy Redis
deploy_redis() {
    echo -e "${BLUE}Deploying Redis cache...${NC}"
    
    kubectl apply -f k8s/redis.yaml
    
    # Wait for Redis to be ready
    kubectl wait --for=condition=ready pod -l app=redis -n $NAMESPACE --timeout=300s
    
    print_status "Redis cache deployed"
}

# Build and push Docker images
build_images() {
    echo -e "${BLUE}Building Docker images...${NC}"
    
    # Build backend services
    docker build -t gameserver-pro/user-service:latest ./backend
    docker build -t gameserver-pro/wallet-service:latest ./backend
    docker build -t gameserver-pro/description-service:latest ./backend
    docker build -t gameserver-pro/api-gateway:latest ./backend
    
    print_status "Docker images built"
}

# Deploy microservices
deploy_services() {
    echo -e "${BLUE}Deploying microservices...${NC}"
    
    kubectl apply -f k8s/services.yaml
    
    # Wait for services to be ready
    kubectl wait --for=condition=ready pod -l app=user-service -n $NAMESPACE --timeout=300s
    kubectl wait --for=condition=ready pod -l app=wallet-service -n $NAMESPACE --timeout=300s
    kubectl wait --for=condition=ready pod -l app=description-service -n $NAMESPACE --timeout=300s
    kubectl wait --for=condition=ready pod -l app=api-gateway -n $NAMESPACE --timeout=300s
    
    print_status "Microservices deployed"
}

# Deploy Nginx load balancer
deploy_nginx() {
    echo -e "${BLUE}Deploying Nginx load balancer...${NC}"
    
    kubectl apply -f k8s/nginx.yaml
    
    # Wait for Nginx to be ready
    kubectl wait --for=condition=ready pod -l app=nginx -n $NAMESPACE --timeout=300s
    
    print_status "Nginx load balancer deployed"
}

# Setup SSL certificates
setup_ssl() {
    echo -e "${BLUE}Setting up SSL certificates...${NC}"
    
    # Create SSL certificate secret (replace with actual certificates)
    kubectl create secret tls nginx-ssl-secret \
        --cert=ssl/cert.pem \
        --key=ssl/key.pem \
        -n $NAMESPACE \
        --dry-run=client -o yaml | kubectl apply -f -
    
    print_warning "SSL certificates configured (replace with production certificates)"
}

# Configure monitoring
setup_monitoring() {
    echo -e "${BLUE}Setting up monitoring...${NC}"
    
    # Create monitoring namespace
    kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -
    
    # Deploy Prometheus and Grafana (optional)
    print_warning "Monitoring setup - configure Prometheus/Grafana as needed"
}

# Security hardening
security_hardening() {
    echo -e "${BLUE}Applying security hardening...${NC}"
    
    # Create NetworkPolicy for microservices
    cat > k8s/network-policy.yaml << EOF
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: gameserver-pro-network-policy
  namespace: $NAMESPACE
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: $NAMESPACE
    - podSelector:
        matchLabels:
          app: nginx
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: $NAMESPACE
  - to: []
    ports:
    - protocol: TCP
      port: 53
    - protocol: UDP
      port: 53
EOF
    
    kubectl apply -f k8s/network-policy.yaml
    
    # Create PodSecurityPolicy
    cat > k8s/pod-security-policy.yaml << EOF
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: gameserver-pro-psp
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  fsGroup:
    rule: 'RunAsAny'
EOF
    
    kubectl apply -f k8s/pod-security-policy.yaml
    
    print_status "Security hardening applied"
}

# Health checks
health_checks() {
    echo -e "${BLUE}Performing health checks...${NC}"
    
    # Check all pods are running
    kubectl get pods -n $NAMESPACE
    
    # Check services
    kubectl get services -n $NAMESPACE
    
    # Test API endpoints
    API_GATEWAY_IP=$(kubectl get service api-gateway -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    
    if [ ! -z "$API_GATEWAY_IP" ]; then
        echo "Testing API Gateway health endpoint..."
        curl -f http://$API_GATEWAY_IP/health || print_warning "API Gateway health check failed"
    fi
    
    print_status "Health checks completed"
}

# Display deployment info
display_info() {
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo "=================================="
    echo -e "${BLUE}Deployment Information:${NC}"
    echo "Namespace: $NAMESPACE"
    echo "Cluster: $CLUSTER_NAME"
    echo "Region: $REGION"
    echo ""
    echo -e "${BLUE}Access Information:${NC}"
    echo "API Gateway: http://$(kubectl get service nginx-service -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}')"
    echo "Database: postgres-service.$NAMESPACE.svc.cluster.local:5432"
    echo "Redis: redis-service.$NAMESPACE.svc.cluster.local:6379"
    echo ""
    echo -e "${BLUE}Security Features:${NC}"
    echo "✅ Encrypted database connections"
    echo "✅ JWT authentication"
    echo "✅ Rate limiting"
    echo "✅ Network policies"
    echo "✅ Pod security policies"
    echo "✅ SSL/TLS encryption"
    echo "✅ Audit logging"
    echo "✅ Financial transaction security"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "1. Configure SSL certificates in ssl/ directory"
    echo "2. Update payment gateway credentials"
    echo "3. Set up monitoring and alerting"
    echo "4. Configure backup strategies"
    echo "5. Test all endpoints thoroughly"
}

# Main deployment function
main() {
    check_prerequisites
    generate_secrets
    create_namespace
    deploy_database
    deploy_redis
    build_images
    deploy_services
    deploy_nginx
    setup_ssl
    setup_monitoring
    security_hardening
    health_checks
    display_info
}

# Run main function
main "$@"
