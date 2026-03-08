import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'public', 'uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-originalname
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Paths to JSON files
const DATA_DIR = path.join(__dirname, 'src', 'data');
const FILES = {
  products: path.join(DATA_DIR, 'products.json'),
  banners: path.join(DATA_DIR, 'banners.json'),
  distributors: path.join(DATA_DIR, 'distributors.json')
};

// Helper function to read JSON file
async function readJSONFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    throw error;
  }
}

// Helper function to write JSON file
async function writeJSONFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    throw error;
  }
}

// ============ FILE UPLOAD API ============

// Upload single image
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Return the public URL path
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ 
      success: true, 
      url: imageUrl,
      filename: req.file.filename 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Upload multiple images (up to 3)
app.post('/api/upload-multiple', upload.array('images', 3), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    // Return array of public URL paths
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ 
      success: true, 
      urls: imageUrls,
      filenames: req.files.map(f => f.filename)
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

// Delete image
app.delete('/api/upload/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'public', 'uploads', filename);
    
    // Check if file exists
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      res.json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
      // File doesn't exist, return success anyway
      res.json({ success: true, message: 'Image not found or already deleted' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// ============ CATEGORIES API ============

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const data = await readJSONFile(FILES.products);
    res.json(data.categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read categories' });
  }
});

// Update categories
app.put('/api/categories', async (req, res) => {
  try {
    const data = await readJSONFile(FILES.products);
    data.categories = req.body;
    await writeJSONFile(FILES.products, data);
    res.json({ success: true, categories: data.categories });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update categories' });
  }
});

// ============ PRODUCTS API ============

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const data = await readJSONFile(FILES.products);
    res.json(data.products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read products' });
  }
});

// Update products
app.put('/api/products', async (req, res) => {
  try {
    const data = await readJSONFile(FILES.products);
    data.products = req.body;
    await writeJSONFile(FILES.products, data);
    res.json({ success: true, products: data.products });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update products' });
  }
});

// Get full products data (categories + products)
app.get('/api/products/full', async (req, res) => {
  try {
    const data = await readJSONFile(FILES.products);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read products data' });
  }
});

// ============ BANNERS API ============

// Get all banners
app.get('/api/banners', async (req, res) => {
  try {
    const data = await readJSONFile(FILES.banners);
    res.json(data.banners);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read banners' });
  }
});

// Update banners
app.put('/api/banners', async (req, res) => {
  try {
    const data = await readJSONFile(FILES.banners);
    data.banners = req.body;
    await writeJSONFile(FILES.banners, data);
    res.json({ success: true, banners: data.banners });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update banners' });
  }
});

// ============ DISTRIBUTORS API ============

// Get all distributors
app.get('/api/distributors', async (req, res) => {
  try {
    const data = await readJSONFile(FILES.distributors);
    res.json(data.distributors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read distributors' });
  }
});

// Update distributors
app.put('/api/distributors', async (req, res) => {
  try {
    const data = await readJSONFile(FILES.distributors);
    data.distributors = req.body;
    await writeJSONFile(FILES.distributors, data);
    res.json({ success: true, distributors: data.distributors });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update distributors' });
  }
});

// ============ SERVE REACT APP ============

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
