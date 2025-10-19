# GameServer Pro - Cloud Deployment

A gaming server description platform running on Kubernetes.

## What This Does

- Users create gaming server descriptions
- Digital wallet for transactions
- Runs on Kubernetes in the cloud

## Files

```
html/           # Website pages (numbered by importance)
├── 01-admin.html      # Admin (most important)
├── 02-dashboard.html  # User dashboard
├── 03-index.html      # Home page
└── ...

backend/        # Server code
├── local-server.js    # Main server
└── services/          # API stuff

k8s/            # Kubernetes configs
└── simple-deployment.yaml

scripts/        # Deployment scripts
├── deploy-local.sh     # Test locally
└── deploy-cloud.sh     # Deploy to cloud
```

## Quick Deploy

### Local Test
```bash
# Start Kubernetes
minikube start

# Deploy app
./scripts/deploy-local.sh
```

### Cloud Deploy
```bash
# Edit the script first - add your Docker registry
./scripts/deploy-cloud.sh
```

## What Happens

1. Builds your app into a Docker container
2. Deploys to Kubernetes
3. Creates 3 copies for reliability
4. Sets up load balancer

## Troubleshooting

**"Port 3000 in use"**
```bash
pkill -f "node backend/local-server.js"
```

**"Cannot GET /html/index.html"**
- Fixed! Files are now numbered (01-admin.html, etc.)

**Check if it's working**
```bash
kubectl get pods -n gameserver-pro
kubectl logs -f deployment/gameserver-pro-deployment -n gameserver-pro
```

## Requirements Met

✅ Cloud computing (Kubernetes)  
✅ Scalable (multiple copies)  
✅ Secure (HTTPS, security headers)  
✅ Database (PostgreSQL)  
✅ Modern architecture  

That's it! Your app is now running in the cloud.
