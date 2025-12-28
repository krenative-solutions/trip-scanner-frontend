# Environment Configuration

This project uses Vite environment variables for configuration.

## Environment Files

- `.env` - Default values (not committed to git)
- `.env.development` - Local development (npm run dev)
- `.env.production` - Production build (Vercel deployment)
- `.env.local` - Local overrides (not committed to git)

## Available Variables

### `VITE_API_BASE_URL`
Backend API base URL. Automatically set based on environment:
- **Development**: `http://localhost:8080` (local backend)
- **Production**: `https://trip-scanner-ec127ad298df.herokuapp.com` (Heroku backend)

## Deployment

### Vercel
The production environment variables are automatically used during Vercel builds.
No additional configuration needed in Vercel dashboard.

### Local Development
Run the backend locally:
```bash
cd ../trip-scanner
./mvnw spring-boot:run
```

Then run the frontend:
```bash
npm run dev
```

## Testing Production API Locally
To test against the production backend locally, create a `.env.local` file:
```
VITE_API_BASE_URL=https://trip-scanner-ec127ad298df.herokuapp.com
```