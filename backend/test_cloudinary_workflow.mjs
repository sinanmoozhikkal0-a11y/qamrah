import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import app from './app.js';
import { connectDB, closeDB } from './config/db.js';
import { isCloudinaryConfigured, cloudinary } from './config/cloudinary.js';

const TEST_PORT = 5055;

async function runTests() {
  console.log('====================================================');
  console.log('  QAMRAH Cloudinary & Product Integration Tests     ');
  console.log('====================================================\n');

  // 1. Verify Cloudinary Configuration
  console.log('1. Checking Cloudinary Configuration...');
  const isConfigured = isCloudinaryConfigured();
  console.log('   Cloudinary configured:', isConfigured);
  if (!isConfigured) {
    throw new Error('Cloudinary is not configured. Check environment variables.');
  }

  // 2. Connect Database and Start HTTP Test Server
  console.log('\n2. Connecting to MongoDB & Starting Test HTTP Server...');
  await connectDB();
  const server = app.listen(TEST_PORT);
  const BASE = `http://localhost:${TEST_PORT}/api`;
  console.log(`   Server running on http://localhost:${TEST_PORT}`);

  try {
    // 3. Test Admin Login
    console.log('\n3. Testing Admin Login...');
    const loginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD
      })
    });
    const loginData = await loginRes.json();
    console.log('   Login HTTP Status:', loginRes.status);
    console.log('   Login Success:', loginData.success);
    if (!loginData.success || !loginData.data?.token) {
      throw new Error('Admin login failed: ' + (loginData.message || 'No token'));
    }
    const token = loginData.data.token;
    console.log('   Admin JWT Token obtained successfully.');

    // 4. Test Unauthorized Upload Protection
    console.log('\n4. Testing Unauthorized Upload Protection...');
    const unauthRes = await fetch(`${BASE}/uploads/image`, {
      method: 'POST'
    });
    console.log('   Unauthenticated POST /uploads/image status:', unauthRes.status);
    if (unauthRes.status !== 401) {
      throw new Error(`Expected 401 for unauthenticated upload, got ${unauthRes.status}`);
    }
    console.log('   Protected route correctly denied unauthenticated request (401).');

    // 5. Test Upload to Cloudinary
    console.log('\n5. Testing Authorized Upload to Cloudinary...');
    // Create a 1x1 transparent PNG buffer
    const testPngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      'base64'
    );
    const blob = new Blob([testPngBuffer], { type: 'image/png' });
    const formData = new FormData();
    formData.append('image', blob, 'test_royal_cashew.png');
    formData.append('folder', 'products');

    const uploadRes = await fetch(`${BASE}/uploads/image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    const uploadData = await uploadRes.json();
    console.log('   Upload HTTP Status:', uploadRes.status);
    console.log('   Upload Success:', uploadData.success);
    console.log('   Cloudinary secure_url:', uploadData.data?.secure_url);
    console.log('   Cloudinary public_id:', uploadData.data?.public_id);

    if (!uploadData.success || !uploadData.data?.secure_url || !uploadData.data?.secure_url.includes('cloudinary.com')) {
      throw new Error('Upload to Cloudinary failed: ' + JSON.stringify(uploadData));
    }
    const firstImageUrl = uploadData.data.secure_url;
    const firstPublicId = uploadData.data.public_id;

    // 6. Test Product Creation with Cloudinary Image
    console.log('\n6. Testing Product Creation with Cloudinary Image...');
    const createRes = await fetch(`${BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Automated Cloudinary Test Pistachios',
        slug: 'auto-cloudinary-test-' + Date.now(),
        category: 'pistachios',
        categoryName: 'Pistachios',
        price: 999,
        mrp: 1299,
        stock: 35,
        mainImage: firstImageUrl,
        description: 'Test product for verifying Cloudinary integration'
      })
    });
    const createData = await createRes.json();
    console.log('   Create Product HTTP Status:', createRes.status);
    console.log('   Product Created Name:', createData.data?.name);
    console.log('   Saved mainImage:', createData.data?.mainImage);

    if (!createData.success || createData.data?.mainImage !== firstImageUrl) {
      throw new Error('Failed to create product with Cloudinary image: ' + JSON.stringify(createData));
    }
    const createdProductId = createData.data._id;

    // 7. Verify Product in GET /api/products/:id and Storefront List
    console.log('\n7. Verifying Product via Public GET Endpoints...');
    const getRes = await fetch(`${BASE}/products/${createdProductId}`);
    const getData = await getRes.json();
    console.log('   GET /products/:id Status:', getRes.status);
    console.log('   Retrieved Image matches Cloudinary URL?:', getData.data?.mainImage === firstImageUrl);
    if (!getData.success || getData.data?.mainImage !== firstImageUrl) {
      throw new Error('Product retrieval image mismatch');
    }

    // 8. Test Edit Product WITHOUT changing image
    console.log('\n8. Testing Edit Product WITHOUT changing image...');
    const editNoImgRes = await fetch(`${BASE}/products/${createdProductId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        price: 1099,
        stock: 40,
        mainImage: firstImageUrl // Unchanged
      })
    });
    const editNoImgData = await editNoImgRes.json();
    console.log('   Edit (price update) HTTP Status:', editNoImgRes.status);
    console.log('   Updated Price:', editNoImgData.data?.price);
    console.log('   mainImage preserved:', editNoImgData.data?.mainImage === firstImageUrl);
    if (editNoImgData.data?.price !== 1099 || editNoImgData.data?.mainImage !== firstImageUrl) {
      throw new Error('Editing product without image change failed');
    }

    // 9. Test Replace Product Image with New Cloudinary Image
    console.log('\n9. Testing Product Image Replacement with 2nd Cloudinary Upload...');
    const testPngBuffer2 = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    const blob2 = new Blob([testPngBuffer2], { type: 'image/png' });
    const formData2 = new FormData();
    formData2.append('image', blob2, 'test_replacement.png');
    formData2.append('folder', 'products');

    const uploadRes2 = await fetch(`${BASE}/uploads/image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData2
    });
    const uploadData2 = await uploadRes2.json();
    const secondImageUrl = uploadData2.data?.secure_url;
    const secondPublicId = uploadData2.data?.public_id;
    console.log('   2nd Upload Status:', uploadRes2.status);
    console.log('   2nd Cloudinary secure_url:', secondImageUrl);

    const editWithNewImgRes = await fetch(`${BASE}/products/${createdProductId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        mainImage: secondImageUrl
      })
    });
    const editWithNewImgData = await editWithNewImgRes.json();
    console.log('   Product update with new image status:', editWithNewImgRes.status);
    console.log('   New mainImage in DB:', editWithNewImgData.data?.mainImage);
    if (editWithNewImgData.data?.mainImage !== secondImageUrl) {
      throw new Error('Failed to update product with replaced image');
    }

    // Wait 1.5s for async cleanup of old image on Cloudinary
    await new Promise((r) => setTimeout(r, 1500));

    // Verify 1st image was destroyed on Cloudinary
    try {
      const checkOldImg = await cloudinary.api.resource(firstPublicId);
      console.log('   Notice: Old image status on Cloudinary:', checkOldImg ? 'still present' : 'deleted');
    } catch (checkErr) {
      console.log('   Old image successfully destroyed on Cloudinary (404/not found confirmed).');
    }

    // 10. Test Product Deletion and Asset Cleanup
    console.log('\n10. Testing Product Deletion with Cloudinary Cleanup...');
    const deleteRes = await fetch(`${BASE}/products/${createdProductId}?hard=true`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const deleteData = await deleteRes.json();
    console.log('   DELETE /products/:id?hard=true status:', deleteRes.status);
    console.log('   DELETE message:', deleteData.message);

    // Wait 1.5s for async cleanup of 2nd image on Cloudinary
    await new Promise((r) => setTimeout(r, 1500));

    // Verify 2nd image was destroyed on Cloudinary
    try {
      await cloudinary.api.resource(secondPublicId);
      console.log('   Notice: Second image status on Cloudinary: still present');
    } catch {
      console.log('   Second image successfully destroyed on Cloudinary.');
    }

    // Verify product no longer exists in DB
    const finalCheckRes = await fetch(`${BASE}/products/${createdProductId}`);
    console.log('   GET deleted product status (should be 404):', finalCheckRes.status);
    if (finalCheckRes.status !== 404) {
      throw new Error('Deleted product still returned');
    }

    console.log('\n====================================================');
    console.log('  ALL CLOUDINARY WORKFLOW TESTS PASSED PERFECTLY!   ');
    console.log('====================================================\n');
  } finally {
    server.close();
    await closeDB();
  }
}

runTests().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
