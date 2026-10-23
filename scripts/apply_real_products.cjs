const fs = require('fs');
const path = require('path');

const realProducts = require('../full_real_products.json');

// 1. Update data/database.json
const dbPath = path.join(__dirname, '../data/database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
db.products = realProducts;
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Updated data/database.json with', realProducts.length, 'products');

// 2. Update src/data/mockData.ts
const mockDataPath = path.join(__dirname, '../src/data/mockData.ts');
let mockContent = fs.readFileSync(mockDataPath, 'utf8');

// Replace the INITIAL_PRODUCTS array content
const startMarker = 'export const INITIAL_PRODUCTS: Product[] = [';
const endMarker = '];\n\nexport const VIETNAM_LOCATIONS = [';

const startIndex = mockContent.indexOf(startMarker);
const endIndex = mockContent.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const jsonString = JSON.stringify(realProducts, null, 2);
  // indent with 2 spaces
  const indented = jsonString.slice(1, -1).trim();
  const newContent = mockContent.slice(0, startIndex + startMarker.length) + '\n' + indented + '\n' + mockContent.slice(endIndex);
  fs.writeFileSync(mockDataPath, newContent, 'utf8');
  console.log('Updated src/data/mockData.ts successfully');
} else {
  console.error('Could not find markers in mockData.ts', { startIndex, endIndex });
}

// 3. Update storage.ts storage key
const storagePath = path.join(__dirname, '../src/services/storage.ts');
let storageContent = fs.readFileSync(storagePath, 'utf8');
storageContent = storageContent.replace(
  /const STORAGE_KEY_PRODUCTS = ['"]chorao_products_[^'"]+['"];/,
  "const STORAGE_KEY_PRODUCTS = 'chorao_products_v38_real_shopee_v2';"
);
fs.writeFileSync(storagePath, storageContent, 'utf8');
console.log('Updated storage key in src/services/storage.ts');
