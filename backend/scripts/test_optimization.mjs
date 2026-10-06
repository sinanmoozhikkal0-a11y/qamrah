import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  console.log('DNS setup warning:', e.message);
}

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from '../app.js';
import { connectDB, closeDB } from '../config/db.js';

const TEST_PORT = 5088;
const BASE = `http://localhost:${TEST_PORT}/api`;

async function runOptimizationTests() {
  console.log('====================================================');
  console.log('  QAMRAH Backend Optimization & Projection Tests     ');
  console.log('====================================================\n');

  await connectDB();
  const server = app.listen(TEST_PORT);
  console.log(`Server listening on http://localhost:${TEST_PORT}\n`);

  try {
    // ----------------------------------------------------
    // TEST 1: GET /api/products (List Projection & Cache)
    // ----------------------------------------------------
    console.log('1. Testing GET /api/products...');
    const t0 = performance.now();
    const res1 = await fetch(`${BASE}/products`);
    const text1 = await res1.text();
    const dur1 = (performance.now() - t0).toFixed(0);
    const data1 = JSON.parse(text1);

    console.log(`   Status:       ${res1.status}`);
    console.log(`   Duration:     ${dur1} ms`);
    console.log(`   Payload Size: ${(text1.length / 1024).toFixed(2)} KB (${text1.length} bytes)`);
    console.log(`   Count:        ${data1.count}`);
    console.log(`   Cache-Control: ${res1.headers.get('cache-control')}`);

    if (res1.status !== 200 || !data1.success) {
      throw new Error('GET /api/products failed');
    }

    const expectedCache = 'public, max-age=30, s-maxage=60, stale-while-revalidate=300';
    if (res1.headers.get('cache-control') !== expectedCache) {
      throw new Error(`Expected Cache-Control "${expectedCache}", got "${res1.headers.get('cache-control')}"`);
    }

    // Verify fields in list response
    const firstProd = data1.data[0];
    const requiredFields = [
      '_id', 'name', 'slug', 'category', 'categoryName',
      'price', 'mrp', 'originalPrice', 'discount', 'stock',
      'inStock', 'packSize', 'weight', 'rating', 'reviewCount',
      'badge', 'tag', 'mainImage', 'image'
    ];
    for (const f of requiredFields) {
      if (firstProd[f] === undefined) {
        throw new Error(`Missing required field in list projection: "${f}"`);
      }
    }

    // Verify excluded heavy fields
    if (firstProd.nutritionalFacts !== undefined) {
      throw new Error('nutritionalFacts should NOT be included in list projection');
    }
    if (firstProd.healthBenefits !== undefined) {
      throw new Error('healthBenefits should NOT be included in list projection');
    }
    if (firstProd.images !== undefined) {
      throw new Error('images array should NOT be included in list projection');
    }

    // Verify no base64 in any product
    for (const p of data1.data) {
      if (p.mainImage?.startsWith('data:image/') || p.image?.startsWith('data:image/')) {
        throw new Error(`Product ${p.slug} contains base64 image!`);
      }
    }
    console.log('   ✅ Projection verified: required fields present, heavy fields excluded, no base64.');

    // ----------------------------------------------------
    // TEST 2: GET /api/products?status=active
    // ----------------------------------------------------
    console.log('\n2. Testing GET /api/products?status=active...');
    const res2 = await fetch(`${BASE}/products?status=active`);
    const text2 = await res2.text();
    const data2 = JSON.parse(text2);
    console.log(`   Status:       ${res2.status}`);
    console.log(`   Payload Size: ${(text2.length / 1024).toFixed(2)} KB`);
    console.log(`   Cache-Control: ${res2.headers.get('cache-control')}`);
    if (res2.status !== 200 || !data2.success) {
      throw new Error('GET /api/products?status=active failed');
    }
    console.log('   ✅ GET /api/products?status=active verified.');

    // ----------------------------------------------------
    // TEST 3: GET /api/products?category=cashews
    // ----------------------------------------------------
    console.log('\n3. Testing GET /api/products?category=cashews...');
    const res3 = await fetch(`${BASE}/products?category=cashews`);
    const text3 = await res3.text();
    const data3 = JSON.parse(text3);
    console.log(`   Status:       ${res3.status}`);
    console.log(`   Count:        ${data3.count}`);
    console.log(`   Payload Size: ${(text3.length / 1024).toFixed(2)} KB`);
    if (res3.status !== 200 || !data3.success) {
      throw new Error('GET /api/products?category=cashews failed');
    }
    console.log('   ✅ Category filter verified.');

    // ----------------------------------------------------
    // TEST 4: GET /api/products/slug/pistachios (Detail endpoint)
    // ----------------------------------------------------
    console.log('\n4. Testing GET /api/products/slug/pistachios...');
    const res4 = await fetch(`${BASE}/products/slug/pistachios`);
    const text4 = await res4.text();
    const data4 = JSON.parse(text4);
    console.log(`   Status:       ${res4.status}`);
    console.log(`   Payload Size: ${(text4.length / 1024).toFixed(2)} KB`);
    console.log(`   Cache-Control: ${res4.headers.get('cache-control')}`);
    console.log(`   mainImage:    ${data4.data?.mainImage}`);

    if (res4.status !== 200 || !data4.success) {
      throw new Error('GET /api/products/slug/pistachios failed');
    }
    if (!data4.data?.mainImage?.includes('cloudinary.com')) {
      throw new Error('Pistachios mainImage should be a Cloudinary URL');
    }
    // Detail endpoint SHOULD have nutritionalFacts & healthBenefits
    if (!data4.data?.nutritionalFacts) {
      throw new Error('Detail endpoint should retain nutritionalFacts');
    }
    console.log('   ✅ Detail endpoint verified: full fields retained, clean Cloudinary URL.');

    // ----------------------------------------------------
    // TEST 5: GET /api/products/slug/cashews
    // ----------------------------------------------------
    console.log('\n5. Testing GET /api/products/slug/cashews...');
    const res5 = await fetch(`${BASE}/products/slug/cashews`);
    const data5 = await res5.json();
    console.log(`   Status:       ${res5.status}`);
    console.log(`   Name:         ${data5.data?.name}`);
    console.log(`   Cache-Control: ${res5.headers.get('cache-control')}`);
    if (res5.status !== 200 || !data5.success) {
      throw new Error('GET /api/products/slug/cashews failed');
    }
    console.log('   ✅ Slug lookup verified.');

    // ----------------------------------------------------
    // TEST 6: Base64 Protection Guard (Admin JWT login & Product Create)
    // ----------------------------------------------------
    console.log('\n6. Testing Base64 Protection Guard...');
    // Login as admin
    const loginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD
      })
    });
    const loginData = await loginRes.json();
    const token = loginData.data?.token;

    // Test creating a product with a 1x1 PNG base64 string
    const tinyBase64Png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    const testCreateRes = await fetch(`${BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Optimization Test Base64 Upload Product',
        slug: 'opt-test-base64-' + Date.now(),
        category: 'cashews',
        categoryName: 'Cashews',
        price: 799,
        stock: 10,
        mainImage: tinyBase64Png, // Base64 data URI
        description: 'Verifying automatic Cloudinary upload of base64 data'
      })
    });
    const testCreateData = await testCreateRes.json();
    console.log(`   Create with base64 status: ${testCreateRes.status}`);
    console.log(`   Product mainImage in DB:  ${testCreateData.data?.mainImage}`);

    if (!testCreateData.success) {
      throw new Error('Base64 upload guard test failed: ' + testCreateData.message);
    }
    if (testCreateData.data?.mainImage?.startsWith('data:image/')) {
      throw new Error('Base64 string was incorrectly saved directly into database!');
    }
    if (!testCreateData.data?.mainImage?.includes('cloudinary.com')) {
      throw new Error('Base64 string was not converted to Cloudinary URL!');
    }
    console.log('   ✅ Base64 image was automatically uploaded to Cloudinary CDN and saved as URL!');

    // Cleanup the test product
    const createdId = testCreateData.data._id;
    await fetch(`${BASE}/products/${createdId}?hard=true`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Test product cleaned up successfully.');

    console.log('\n====================================================');
    console.log('  ALL OPTIMIZATION & PROJECTION TESTS PASSED!       ');
    console.log('====================================================');
  } finally {
    server.close();
    await closeDB();
  }
}

runOptimizationTests().catch((err) => {
  console.error('\n❌ Test failure:', err);
  process.exit(1);
});
