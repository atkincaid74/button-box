# Deployment Instructions

## Current Setup
- **Platform**: Cloud Run (us-east4)
- **Domain**: https://button.kinca.id (with Google-managed SSL)
- **Deployment**: Automatic via Cloud Build on push to main branch
- **Cost**: ~$0-2/month (Cloud Run free tier covers most usage)

## Architecture
- Static files served by nginx in a Docker container
- Cloud Run auto-scales from 0 to 10 instances
- Custom domain with automatic SSL certificate provisioning
- Continuous deployment from GitHub

## Prerequisites
1. Google Cloud Project with billing enabled (Project: `k-button-box`)
2. GitHub repository connected to Cloud Build
3. gcloud CLI installed and authenticated

## Initial Setup (Already Completed)

### 1. Enable Required APIs
```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com
```

### 2. Deploy to Cloud Run
```bash
# Build and deploy the container
gcloud builds submit --tag us-east4-docker.pkg.dev/k-button-box/cloud-run-source-deploy/button-box:latest

# Deploy to Cloud Run
gcloud run deploy button-box \
  --image us-east4-docker.pkg.dev/k-button-box/cloud-run-source-deploy/button-box:latest \
  --platform managed \
  --region us-east4 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 256Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 60
```

### 3. Set Up Custom Domain
```bash
# Map custom domain to Cloud Run
gcloud beta run domain-mappings create \
  --service button-box \
  --domain button.kinca.id \
  --region us-east4
```

### 4. Configure DNS (GoDaddy)
1. Log into GoDaddy
2. Go to "My Products" → "DNS" for kinca.id
3. Add/update CNAME record:
   - **Type**: CNAME
   - **Name**: button
   - **Value**: `ghs.googlehosted.com`
   - **TTL**: 1 Hour (3600 seconds)
4. Save the record

SSL certificate will be automatically provisioned by Google (takes 15-30 minutes after DNS propagation).

### 5. Set Up Continuous Deployment
1. Go to Cloud Build Triggers: https://console.cloud.google.com/cloud-build/triggers?project=k-button-box
2. Click "CREATE TRIGGER"
3. Configure:
   - **Name**: deploy-button-box
   - **Region**: us-east4 (or global)
   - **Event**: Push to a branch
   - **Source**: Select `button-box-github / button-box-repo` (2nd gen repository)
   - **Branch**: `^main$`
   - **Configuration**: Cloud Build configuration file
   - **Location**: `/cloudbuild.yaml`
4. Click "CREATE"

## Daily Usage

### Making Changes
1. Edit files locally
2. Commit changes: `git commit -am "Your message"`
3. Push to GitHub: `git push origin main`
4. Cloud Build automatically builds and deploys to Cloud Run
5. Changes are live at https://button.kinca.id within 2-3 minutes

### Adding New Sounds
1. Add MP3 files to the `sounds/` directory
2. Update the button in `index.html` if needed
3. Push to main branch - automatic deployment handles the rest

### Monitoring Deployments
- View builds: https://console.cloud.google.com/cloud-build/builds?project=k-button-box
- View Cloud Run service: https://console.cloud.google.com/run/detail/us-east4/button-box?project=k-button-box
- Check domain mapping: https://console.cloud.google.com/run/domains?project=k-button-box

### Manual Deployment (if needed)
```bash
# Build and deploy manually
gcloud builds submit \
  --config=cloudbuild.yaml \
  --region=us-east4 \
  --substitutions=COMMIT_SHA=$(git rev-parse --short HEAD)
```

## Local Testing
```bash
# Build and run locally with Docker
docker build -t button-box .
docker run -p 8080:8080 button-box

# Open http://localhost:8080 in your browser
```

Or test without Docker:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

## Troubleshooting

### SSL Certificate Not Provisioning
1. Check DNS: `dig button.kinca.id` should return `ghs.googlehosted.com`
2. Check certificate status:
   ```bash
   gcloud beta run domain-mappings describe \
     --domain button.kinca.id \
     --region us-east4
   ```
3. Wait 15-30 minutes after DNS changes (can take up to 24 hours)

### Build Failing
1. Check build logs: https://console.cloud.google.com/cloud-build/builds?project=k-button-box
2. Verify `cloudbuild.yaml` and `Dockerfile` are valid
3. Check service account permissions

### Site Not Updating After Push
1. Verify trigger fired: Check Cloud Build history
2. Check trigger configuration: https://console.cloud.google.com/cloud-build/triggers?project=k-button-box
3. Manually trigger deployment if needed

## Cost Breakdown
- **Cloud Run**: Free tier covers 2 million requests/month + 180,000 vCPU-seconds
- **Cloud Build**: 120 build-minutes/day free
- **Artifact Registry**: 0.5 GB storage free
- **Expected monthly cost**: $0-2 (well within free tier for this traffic level)

**Savings**: Migrated from Cloud Storage + Load Balancer setup which cost ~$18/month

## Service URLs
- **Primary**: https://button.kinca.id
- **Cloud Run URL**: https://button-box-251736154097.us-east4.run.app
- **Project**: k-button-box
- **Region**: us-east4

## Files
- `Dockerfile` - Container definition with nginx
- `nginx.conf` - Web server configuration
- `cloudbuild.yaml` - Build and deployment pipeline
- `.dockerignore` - Files excluded from Docker build
