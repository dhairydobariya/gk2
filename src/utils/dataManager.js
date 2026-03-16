// Data Manager - Reads from static JSON files
import productsData from '../data/products.json';
import bannersData from '../data/banners.json';
import distributorsData from '../data/distributors.json';

export const getCategories = () => productsData.categories || [];

export const getProducts = () => productsData.products || [];

export const getProductsData = () => ({
  categories: productsData.categories || [],
  products: productsData.products || []
});

export const getBanners = () => bannersData.banners || [];

export const getDistributors = () => distributorsData.distributors || [];
