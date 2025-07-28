# GitHub OAuth Setup Guide

## Step 1: Create GitHub OAuth App

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/applications/new
   - Or: GitHub Settings → Developer settings → OAuth Apps → New OAuth App

2. **Fill in the Application Details**
   ```
   Application name: CodeDuck Local Development
   Homepage URL: http://100.79.131.40:3002
   Application description: Mobile-first AI coding assistant for developers
   Authorization callback URL: http://100.79.131.40:3002/auth/github/callback
   ```
   
   **Note**: If you need both localhost and Tailscale access, create two OAuth apps or add multiple callback URLs (GitHub allows comma-separated URLs in some cases).

3. **Click "Register application"**

4. **Save Your Credentials**
   - Copy the **Client ID** (public)
   - Click "Generate a new client secret" and copy the **Client Secret** (private)

## Step 2: Add Environment Variables

### Backend (.env)
```env
# Add these to backend/.env
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
```

### Frontend (.env)
```env
# Add this to webapp/.env
REACT_APP_GITHUB_CLIENT_ID=your_client_id_here
```

## Step 3: Test the Setup

After setting up:
1. Restart your development servers
2. Go to http://100.79.131.40:3002
3. Login to the dashboard
4. Click "GitHub" integration card
5. Should redirect to GitHub OAuth flow

## Important Notes

- **Local Development**: Uses `http://localhost:3002` for OAuth callback
- **Production**: You'll need to create a separate OAuth app with production URLs
- **Security**: Never commit the client secret to git
- **Callback URL**: Must match exactly what's registered with GitHub

## Troubleshooting

### Common Issues:
- **"Callback URL mismatch"**: Check that `http://localhost:3002/auth/github/callback` is exact
- **"Application suspended"**: OAuth app might be flagged, check GitHub settings
- **CORS errors**: Make sure backend allows requests from frontend domain

### Testing OAuth Flow:
```bash
# Test GitHub OAuth redirect (replace CLIENT_ID)
curl "https://github.com/login/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3002/auth/github/callback&scope=repo,user:email"
```