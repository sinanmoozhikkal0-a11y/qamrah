import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load backend env
dotenv.config({ path: 'c:/qamrah-main/qamrah-main/backend/.env' });

const BASE_URL = 'http://localhost:5000/api';

const results = [];

function recordTest(num, name, passed, details) {
  results.push({ num, name, passed, details });
  const icon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`[Test ${num}] ${icon} - ${name}: ${details}`);
}

async function runTests() {
  console.log('🚀 [Product CRUD API Test Suite Starting]...\n');

  // Connect to DB directly for test setup and teardown
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection;
  const usersColl = db.collection('users');
  const productsColl = db.collection('products');

  const testSuffix = Date.now();
  const testAdminEmail = `temp_admin_${testSuffix}@qamrah.luxury`;
  const testCustomerEmail = `temp_customer_${testSuffix}@qamrah.luxury`;
  const testPassword = 'Password123!';
  const hashedPassword = await bcrypt.hash(testPassword, 10);

  // 1. Create temporary test admin & customer accounts directly in DB
  const adminDoc = await usersColl.insertOne({
    name: 'Temporary Test Admin',
    email: testAdminEmail,
    password: hashedPassword,
    role: 'admin',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const customerDoc = await usersColl.insertOne({
    name: 'Temporary Test Customer',
    email: testCustomerEmail,
    password: hashedPassword,
    role: 'customer',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // 2. Obtain real JWTs via POST /api/auth/login
  const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testAdminEmail, password: testPassword })
  });
  const adminLoginData = await adminLoginRes.json();
  const adminToken = adminLoginData?.data?.token;

  const customerLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testCustomerEmail, password: testPassword })
  });
  const customerLoginData = await customerLoginRes.json();
  const customerToken = customerLoginData?.data?.token;

  if (!adminToken || !customerToken) {
    throw new Error('Failed to obtain JWT tokens for testing.');
  }

  let createdProductId = null;
  const createdProductSlug = 'royal-amber-dates-test';

  // Ensure any previous test product with this slug is cleaned up first
  await productsColl.deleteOne({ slug: createdProductSlug });

  try {
    // -------------------------------------------------------------
    // Test 6: Admin create product (run early to have a product to query)
    // -------------------------------------------------------------
    const createPayload = {
      name: 'Royal Amber Dates [Verified Test Product]',
      slug: createdProductSlug,
      category: 'dates',
      categoryName: 'Premium Dates',
      price: 1850,
      mrp: 2200,
      stock: 45,
      packSize: '500g',
      mainImage: 'https://images.unsplash.com/photo-dates-test.jpg',
      badge: 'Bestseller',
      featured: true,
      bestseller: true,
      description: 'Exclusive organic Amber dates harvested from Medina.'
    };

    const res6 = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify(createPayload)
    });
    const data6 = await res6.json();
    const p6 = data6?.data;
    createdProductId = p6?._id;

    const test6Pass =
      res6.status === 201 &&
      data6.success === true &&
      p6?.name === createPayload.name &&
      p6?.slug === createdProductSlug &&
      p6?.originalPrice === 2200 && // alias check: mrp -> originalPrice
      p6?.weight === '500g' && // alias check: packSize -> weight
      p6?.isFeatured === true && // alias check: featured -> isFeatured
      p6?.inStock === true;

    recordTest(
      6,
      'Admin create product',
      test6Pass,
      `Status ${res6.status}, ID: ${createdProductId}, inStock: ${p6?.inStock}, alias synced`
    );

    // -------------------------------------------------------------
    // Test 1: Public GET products
    // -------------------------------------------------------------
    const res1 = await fetch(`${BASE_URL}/products`);
    const data1 = await res1.json();
    const test1Pass =
      res1.status === 200 &&
      data1.success === true &&
      Array.isArray(data1.data) &&
      data1.pagination !== undefined &&
      data1.data.some((p) => p._id === createdProductId);

    recordTest(
      1,
      'Public GET products',
      test1Pass,
      `Status ${res1.status}, count: ${data1?.count}, total: ${data1?.pagination?.total}`
    );

    // -------------------------------------------------------------
    // Test 2: Public category filter
    // -------------------------------------------------------------
    const res2 = await fetch(`${BASE_URL}/products?category=dates`);
    const data2 = await res2.json();
    const test2Pass =
      res2.status === 200 &&
      data2.success === true &&
      data2.data.length > 0 &&
      data2.data.every((p) => p.category.toLowerCase() === 'dates');

    recordTest(
      2,
      'Public category filter',
      test2Pass,
      `Status ${res2.status}, returned ${data2?.data?.length} products in 'dates'`
    );

    // -------------------------------------------------------------
    // Test 3: Public featured filter
    // -------------------------------------------------------------
    const res3 = await fetch(`${BASE_URL}/products?featured=true`);
    const data3 = await res3.json();
    const test3Pass =
      res3.status === 200 &&
      data3.success === true &&
      data3.data.some((p) => p._id === createdProductId) &&
      data3.data.every((p) => p.featured === true || p.isFeatured === true);

    recordTest(
      3,
      'Public featured filter',
      test3Pass,
      `Status ${res3.status}, returned ${data3?.data?.length} featured products`
    );

    // -------------------------------------------------------------
    // Test 4: Public single product by ID
    // -------------------------------------------------------------
    const res4 = await fetch(`${BASE_URL}/products/${createdProductId}`);
    const data4 = await res4.json();
    const test4Pass =
      res4.status === 200 &&
      data4.success === true &&
      data4.data._id === createdProductId &&
      data4.data.slug === createdProductSlug;

    recordTest(
      4,
      'Public single product by ID',
      test4Pass,
      `Status ${res4.status}, retrieved name: "${data4?.data?.name}"`
    );

    // -------------------------------------------------------------
    // Test 5: Public slug lookup
    // -------------------------------------------------------------
    const res5 = await fetch(`${BASE_URL}/products/slug/${createdProductSlug}`);
    const data5 = await res5.json();
    const test5Pass =
      res5.status === 200 &&
      data5.success === true &&
      data5.data._id === createdProductId;

    recordTest(
      5,
      'Public slug lookup',
      test5Pass,
      `Status ${res5.status}, slug matched "${createdProductSlug}"`
    );

    // -------------------------------------------------------------
    // Test 7: Admin update product
    // -------------------------------------------------------------
    const updatePayload = {
      price: 1999,
      originalPrice: 2499,
      weight: '750g',
      badge: 'Limited Reserve'
    };

    const res7 = await fetch(`${BASE_URL}/products/${createdProductId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify(updatePayload)
    });
    const data7 = await res7.json();
    const p7 = data7?.data;
    const test7Pass =
      res7.status === 200 &&
      data7.success === true &&
      p7?.price === 1999 &&
      p7?.mrp === 2499 && // alias check: originalPrice -> mrp
      p7?.packSize === '750g' && // alias check: weight -> packSize
      p7?.tag === 'Limited Reserve'; // alias check: badge -> tag

    recordTest(
      7,
      'Admin update product',
      test7Pass,
      `Status ${res7.status}, price: ${p7?.price}, mrp: ${p7?.mrp}, packSize: ${p7?.packSize}`
    );

    // -------------------------------------------------------------
    // Test 8: Admin status update
    // -------------------------------------------------------------
    const res8 = await fetch(`${BASE_URL}/products/${createdProductId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'inactive' })
    });
    const data8 = await res8.json();
    const test8Pass =
      res8.status === 200 &&
      data8.success === true &&
      data8?.data?.status === 'inactive';

    recordTest(
      8,
      'Admin status update',
      test8Pass,
      `Status ${res8.status}, new status: ${data8?.data?.status}`
    );

    // Re-activate product for further tests
    await fetch(`${BASE_URL}/products/${createdProductId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'active' })
    });

    // -------------------------------------------------------------
    // Test 9: Admin stock update (and inStock sync)
    // -------------------------------------------------------------
    // 9a: update to 0 -> inStock should be false
    const res9a = await fetch(`${BASE_URL}/products/${createdProductId}/stock`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ stock: 0 })
    });
    const data9a = await res9a.json();

    // 9b: update to 25 -> inStock should be true
    const res9b = await fetch(`${BASE_URL}/products/${createdProductId}/stock`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ stock: 25 })
    });
    const data9b = await res9b.json();

    const test9Pass =
      res9a.status === 200 &&
      data9a?.data?.stock === 0 &&
      data9a?.data?.inStock === false &&
      res9b.status === 200 &&
      data9b?.data?.stock === 25 &&
      data9b?.data?.inStock === true;

    recordTest(
      9,
      'Admin stock update',
      test9Pass,
      `Status ${res9b.status}, stock 0 -> inStock:${data9a?.data?.inStock}, stock 25 -> inStock:${data9b?.data?.inStock}`
    );

    // -------------------------------------------------------------
    // Test 10: Non-admin create rejection
    // -------------------------------------------------------------
    const res10 = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify(createPayload)
    });
    const data10 = await res10.json();
    const test10Pass = res10.status === 403 && data10.success === false;

    recordTest(
      10,
      'Non-admin create rejection',
      test10Pass,
      `Status ${res10.status} (Forbidden), error: "${data10.message}"`
    );

    // -------------------------------------------------------------
    // Test 11: Non-admin update rejection
    // -------------------------------------------------------------
    const res11 = await fetch(`${BASE_URL}/products/${createdProductId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({ price: 999 })
    });
    const data11 = await res11.json();
    const test11Pass = res11.status === 403 && data11.success === false;

    recordTest(
      11,
      'Non-admin update rejection',
      test11Pass,
      `Status ${res11.status} (Forbidden), error: "${data11.message}"`
    );

    // -------------------------------------------------------------
    // Test 12: Admin archive/delete behavior
    // -------------------------------------------------------------
    // Create a temporary product specifically to test archiving
    const archiveTargetRes = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: `Archive Target Product ${testSuffix}`,
        slug: `archive-target-${testSuffix}`,
        category: 'dates',
        price: 500,
        mainImage: 'https://images.unsplash.com/archive-test.jpg'
      })
    });
    const archiveTargetData = await archiveTargetRes.json();
    const archiveTargetId = archiveTargetData?.data?._id;

    const res12 = await fetch(`${BASE_URL}/products/${archiveTargetId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    });
    const data12 = await res12.json();

    // Verify it is archived and hidden from public GET
    const publicAfterArchive = await fetch(`${BASE_URL}/products`);
    const publicDataAfter = await publicAfterArchive.json();
    const isHiddenFromPublic = !publicDataAfter.data.some(
      (p) => p._id === archiveTargetId
    );

    const test12Pass =
      res12.status === 200 &&
      data12?.data?.status === 'archived' &&
      isHiddenFromPublic;

    recordTest(
      12,
      'Admin archive/delete behavior',
      test12Pass,
      `Status ${res12.status}, status set to '${data12?.data?.status}', hidden from default public GET`
    );

    // Clean up archiveTargetDoc permanently
    if (archiveTargetId) {
      await productsColl.deleteOne({ _id: new mongoose.Types.ObjectId(archiveTargetId) });
    }

    // -------------------------------------------------------------
    // Test 13: Invalid product ID
    // -------------------------------------------------------------
    const res13a = await fetch(`${BASE_URL}/products/000000000000000000000000`);
    const data13a = await res13a.json();

    const res13b = await fetch(`${BASE_URL}/products/non-existent-random-slug`);
    const data13b = await res13b.json();

    const test13Pass =
      res13a.status === 404 &&
      data13a.success === false &&
      res13b.status === 404 &&
      data13b.success === false;

    recordTest(
      13,
      'Invalid product ID / Not found',
      test13Pass,
      `Non-existent ObjectId: ${res13a.status}, Non-existent slug: ${res13b.status}`
    );

    // -------------------------------------------------------------
    // Test 14: Product validation
    // -------------------------------------------------------------
    // Test 14a: Missing required name
    const res14a = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        category: 'dates',
        price: 500,
        mainImage: 'img.jpg'
      })
    });

    // Test 14b: Negative price
    const res14b = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'Negative Price Test',
        category: 'dates',
        price: -100,
        mainImage: 'img.jpg'
      })
    });

    const test14Pass = res14a.status === 400 && res14b.status === 400;

    recordTest(
      14,
      'Product validation (missing field & negative price)',
      test14Pass,
      `Missing name -> ${res14a.status}, Negative price -> ${res14b.status}`
    );

    // -------------------------------------------------------------
    // Test 15: Duplicate slug rejection
    // -------------------------------------------------------------
    // Create an active product with unique slug first
    const uniqueSlug = `dup-slug-test-${testSuffix}`;
    const p1 = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'Original Unique Product',
        slug: uniqueSlug,
        category: 'honey',
        price: 800,
        mainImage: 'honey.jpg'
      })
    });
    const p1Data = await p1.json();
    const p1Id = p1Data?.data?._id;

    // Try to create second product with same slug
    const p2 = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'Duplicate Slug Product',
        slug: uniqueSlug,
        category: 'honey',
        price: 900,
        mainImage: 'honey2.jpg'
      })
    });
    const p2Data = await p2.json();

    const test15Pass = p2.status === 400 && p2Data.success === false;

    recordTest(
      15,
      'Duplicate slug rejection',
      test15Pass,
      `Status ${p2.status}, error: "${p2Data.message}"`
    );

    // Cleanup p1
    if (p1Id) {
      await productsColl.deleteOne({ _id: new mongoose.Types.ObjectId(p1Id) });
    }
  } finally {
    // Retain verified test product in MongoDB as requested
    // Clean up temporary test users
    await usersColl.deleteOne({ _id: adminDoc.insertedId });
    await usersColl.deleteOne({ _id: customerDoc.insertedId });
    await mongoose.disconnect();
    console.log('\n🧹 [Test Cleanup Completed]: Temporary test users removed, verified test product retained in MongoDB.');
  }

  const allPassed = results.every((r) => r.passed);
  console.log(`\n========================================`);
  console.log(`TEST SUITE RESULT: ${allPassed ? 'ALL 15 TESTS PASSED 🎉' : 'SOME TESTS FAILED ⚠️'}`);
  console.log(`Passed: ${results.filter((r) => r.passed).length}/${results.length}`);
  console.log(`========================================\n`);

  if (!allPassed) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test execution error:', err);
  process.exit(1);
});
