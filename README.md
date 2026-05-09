# OpenClaw Gateway - Cloud Deployment

## Quick Deploy to Render

1. Create a [Render](https://render.com) account
2. Connect your GitHub repository
3. Click "New Web Service"
4. Select this repository
5. Use these settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Click Deploy!

## Environment Variables

- `PORT` - Port to listen on (default: 3000)
- `OPENCLAW_API_KEY` - API key for authentication
- `OPENCLAW_CONFIG` - JSON config for the gateway

## After Deployment

Once deployed, you'll get a URL like:
`https://your-gateway.onrender.com`

Use this URL in your mobile app settings!

## Discord Integration

To add Discord bot:
1. Go to Discord Developer Portal
2. Create a new application
3. Add bot to your server
4. Configure the bot token in Render env vars
