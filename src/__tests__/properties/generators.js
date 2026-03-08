import * as fc from 'fast-check';

/**
 * Generator for product specifications
 * Generates an object with 1-5 key-value pairs
 * Keys and values are non-empty strings
 */
export function arbitrarySpecifications() {
  return fc.dictionary(
    fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
    fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
    { minKeys: 0, maxKeys: 5 }
  );
}

/**
 * Generator for product variants
 * Generates a variant with id, name, and specifications
 */
export function arbitraryVariant() {
  return fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }),
    name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
    specifications: arbitrarySpecifications()
  });
}

/**
 * Generator for products
 * Generates a product with id, name, description, imageUrl, and variants array
 */
export function arbitraryProduct() {
  return fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }),
    name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
    description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
    imageUrl: fc.oneof(
      fc.constant(''),
      fc.webUrl()
    ),
    variants: fc.array(arbitraryVariant(), { minLength: 0, maxLength: 5 })
  });
}

/**
 * Generator for arrays of products
 * Generates 0-20 products
 */
export function arbitraryProductArray() {
  return fc.array(arbitraryProduct(), { minLength: 0, maxLength: 20 });
}
