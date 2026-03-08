# Backend Setup Instructions

## Overview
This project now includes a Node.js backend that allows the admin panel to update JSON files that all users can see.

## How It Works

```
Admin Panel → Backend API → JSON Files → All Users See Updates
```

## Setup Steps

### 1. Install Backend Dependencies

```bash
npm install
```

This will install:
- `express` - Web server
- `cors` - Allow frontend to communicate with backend
- `concurrently` - Run frontend and backend together

### 2. Development Mode

Run both frontend and backend together:

```bash
npm run dev:all
```

Or run them separately:

```bash
# Terminal 1 - Frontend (React)
npm run dev

# Terminal 2 - Backend (Node.js)
npm run dev:server
```

### 3. Production Build

```bash
# Build the React app
npm run build

# Start the production server
npm start
```

The server will:
- Serve the built React app
- Provide API endpoints for data management
- Run on port 3001 (or PORT environment variable)

## API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `PUT /api/categories` - Update categories

### Products
- `GET /api/products` - Get all products
- `PUT /api/products` - Update products
- `GET /api/products/full` - Get categories + products

### Banners
- `GET /api/banners` - Get all banners
- `PUT /api/banners` - Update banners

### Distributors
- `GET /api/distributors` - Get all distributors
- `PUT /api/distributors` - Update distributors

## How Data Flows

1. **Admin makes changes** in the admin panel
2. **Frontend sends API request** to backend
3. **Backend updates JSON file** in `src/data/`
4. **All users see updated data** on next page load/refresh

## File Structure

```
project/
├── server.js                    # Backend server
├── src/
│   ├── data/                    # JSON data files (backend reads/writes these)
│   │   ├── products.json
│   │   ├── banners.json
│   │   └── distributors.json
│   └── utils/
│       └── dataManager.js       # Frontend API client
└── package.json                 # Dependencies and scripts
```

## Environment Variables

Create a `.env` file (optional):

```env
PORT=3001
VITE_API_URL=http://localhost:3001/api
```

## Deployment

### Option 1: Traditional Hosting (VPS, Shared Hosting with Node.js)

1. Upload all files to server
2. Run `npm install`
3. Run `npm run build`
4. Run `npm start`
5. Use PM2 or similar to keep server running:
   ```bash
   npm install -g pm2
   pm2 start server.js --name gk2-website
   pm2 save
   pm2 startup
   ```

### Option 2: Platform as a Service (Heroku, Railway, Render)

1. Push code to Git repository
2. Connect repository to platform
3. Platform will automatically:
   - Install dependencies
   - Build React app
   - Start Node.js server

### Option 3: Separate Frontend/Backend

- **Frontend**: Deploy to Netlify/Vercel (static hosting)
- **Backend**: Deploy to Heroku/Railway (Node.js hosting)
- Update `VITE_API_URL` to point to backend URL

## Benefits

✅ **All users see updates** - Changes made by admin are visible to everyone
✅ **No database needed** - Simple JSON file storage
✅ **Easy to backup** - Just copy the JSON files
✅ **Version control friendly** - JSON files can be tracked in Git
✅ **Fast and simple** - No complex database setup

## Troubleshooting

### Port already in use
Change the port in server.js or set PORT environment variable:
```bash
PORT=3002 npm start
```

### CORS errors
Make sure both frontend and backend are running and the API URL is correct.

### Changes not persisting
Check that the backend has write permissions to the `src/data/` directory.

## Next Steps

For production, consider:
1. Add authentication to admin panel
2. Add request validation
3. Add rate limiting
4. Use environment variables for configuration
5. Set up automated backups of JSON files
