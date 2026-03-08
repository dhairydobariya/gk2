# GelKrupa Electronics (GK2) Website

A modern, full-stack e-commerce website for GelKrupa Electronics, specializing in MCB (Miniature Circuit Breaker) products and electrical switchgear.

## 🚀 Features

### Frontend
- **Dynamic Product Catalog** - Browse MCBs with filtering by category, rating, and price
- **Product Detail Pages** - Comprehensive product information with image gallery
- **Distributor Locator** - Find authorized distributors with Google Maps integration
- **Dynamic Banners** - Customizable banners for different pages
- **Responsive Design** - Mobile-first design that works on all devices
- **Modern UI** - Clean, professional interface with smooth animations

### Admin Panel
- **Product Management** - Add, edit, delete products with multiple images
- **Category Management** - Organize products into categories
- **Banner Management** - Create dynamic banners with page targeting
- **Distributor Management** - Manage distributor information and locations
- **Image Upload** - Drag-and-drop image upload with preview
- **Search & Filter** - Advanced search and filtering across all modules
- **Pagination** - Configurable items per page (10, 25, 50, 100)

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Data Storage
- **JSON Files** - Lightweight data storage
- **File System** - Image storage in public/uploads

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/gelkrupa-electronics.git
cd gelkrupa-electronics
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
# Start backend server (port 3001)
npm run server

# In another terminal, start frontend (port 5173)
npm run dev
```

4. **Build for production**
```bash
npm run build
```

## 🔐 Admin Access

- **URL**: `/admin`
- **Username**: `gk2`
- **Password**: `123456`

⚠️ **Important**: Change the default credentials in production!

## 📁 Project Structure

```
gelkrupa-electronics/
├── public/
│   ├── uploads/          # Uploaded images
│   └── placeholder.png   # Fallback image
├── src/
│   ├── assets/           # Static assets (logo, etc.)
│   ├── components/       # React components
│   │   ├── admin/        # Admin panel components
│   │   ├── DynamicBanner.jsx
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── ...
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── Admin.jsx
│   │   └── ...
│   ├── utils/            # Utility functions
│   │   ├── dataManager.js
│   │   ├── imageUpload.js
│   │   └── storage.js
│   ├── data/             # JSON data files
│   │   ├── products.json
│   │   ├── banners.json
│   │   └── distributors.json
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── server.js             # Express backend server
├── package.json          # Dependencies
└── vite.config.js        # Vite configuration
```

## 🌐 API Endpoints

### Products
- `GET /api/products` - Get all products
- `PUT /api/products` - Update products
- `GET /api/categories` - Get all categories
- `PUT /api/categories` - Update categories

### Banners
- `GET /api/banners` - Get all banners
- `PUT /api/banners` - Update banners

### Distributors
- `GET /api/distributors` - Get all distributors
- `PUT /api/distributors` - Update distributors

### File Upload
- `POST /api/upload` - Upload single image
- `POST /api/upload-multiple` - Upload multiple images
- `DELETE /api/upload/:filename` - Delete image

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme.

### Logo
Replace `src/assets/logo.png` with your company logo.

### Admin Credentials
Update the credentials in `src/pages/Admin.jsx`.

## 📝 Data Management

All data is stored in JSON files in `src/data/`:
- `products.json` - Product catalog
- `banners.json` - Banner configurations
- `distributors.json` - Distributor information

Images are stored in `public/uploads/`.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Hosting
1. Upload the `dist/` folder to your web server
2. Ensure Node.js is installed on the server
3. Run `node server.js` to start the backend
4. Configure your web server to serve the frontend and proxy API requests

### Environment Variables
Create a `.env` file for production:
```
PORT=3001
NODE_ENV=production
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is proprietary software owned by GelKrupa Electronics.

## 📞 Contact

**GelKrupa Electronics (GK2)**
- Website: [Your Website]
- Email: [Your Email]
- Phone: [Your Phone]

---

Built with ❤️ for GelKrupa Electronics
