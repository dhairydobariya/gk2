import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  arbitrarySpecifications,
  arbitraryVariant,
  arbitraryProduct,
  arbitraryProductArray
} from './generators.js';

describe('Property-Based Test Generators', () => {
  test('arbitrarySpecifications generates valid specification objects', () => {
    fc.assert(
      fc.property(arbitrarySpecifications(), (specs) => {
        // Specifications should be an object
        expect(typeof specs).toBe('object');
        expect(specs).not.toBeNull();
        
        // All keys and values should be non-empty strings
        Object.entries(specs).forEach(([key, value]) => {
          expect(typeof key).toBe('string');
          expect(key.trim().length).toBeGreaterThan(0);
          expect(typeof value).toBe('string');
          expect(value.trim().length).toBeGreaterThan(0);
        });
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  test('arbitraryVariant generates valid variant objects', () => {
    fc.assert(
      fc.property(arbitraryVariant(), (variant) => {
        // Variant should have required fields
        expect(variant).toHaveProperty('id');
        expect(variant).toHaveProperty('name');
        expect(variant).toHaveProperty('specifications');
        
        // ID should be a non-empty string
        expect(typeof variant.id).toBe('string');
        expect(variant.id.length).toBeGreaterThan(0);
        
        // Name should be a non-empty string
        expect(typeof variant.name).toBe('string');
        expect(variant.name.trim().length).toBeGreaterThan(0);
        
        // Specifications should be an object
        expect(typeof variant.specifications).toBe('object');
        expect(variant.specifications).not.toBeNull();
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  test('arbitraryProduct generates valid product objects', () => {
    fc.assert(
      fc.property(arbitraryProduct(), (product) => {
        // Product should have required fields
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('imageUrl');
        expect(product).toHaveProperty('variants');
        
        // ID should be a non-empty string
        expect(typeof product.id).toBe('string');
        expect(product.id.length).toBeGreaterThan(0);
        
        // Name should be a non-empty string
        expect(typeof product.name).toBe('string');
        expect(product.name.trim().length).toBeGreaterThan(0);
        
        // Description should be a non-empty string
        expect(typeof product.description).toBe('string');
        expect(product.description.trim().length).toBeGreaterThan(0);
        
        // ImageUrl should be a string (can be empty)
        expect(typeof product.imageUrl).toBe('string');
        
        // Variants should be an array
        expect(Array.isArray(product.variants)).toBe(true);
        
        // Each variant should be valid
        product.variants.forEach(variant => {
          expect(variant).toHaveProperty('id');
          expect(variant).toHaveProperty('name');
          expect(variant).toHaveProperty('specifications');
        });
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  test('arbitraryProductArray generates valid product arrays', () => {
    fc.assert(
      fc.property(arbitraryProductArray(), (products) => {
        // Should be an array
        expect(Array.isArray(products)).toBe(true);
        
        // Should have 0-20 products
        expect(products.length).toBeGreaterThanOrEqual(0);
        expect(products.length).toBeLessThanOrEqual(20);
        
        // Each product should be valid
        products.forEach(product => {
          expect(product).toHaveProperty('id');
          expect(product).toHaveProperty('name');
          expect(product).toHaveProperty('description');
          expect(product).toHaveProperty('imageUrl');
          expect(product).toHaveProperty('variants');
        });
        
        return true;
      }),
      { numRuns: 100 }
    );
  });
});
