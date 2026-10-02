import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const API_BASE_URL = 'http://localhost:5000/api';

const results = [];

function record(num, name, passed, details) {
  results.push({ num, name, passed, details });
  const icon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`[Order Test ${num.toString().padStart(2, '0')}] ${icon} - ${name}: ${details}`);
}

async function runOrderTests() {
  console.log('🚀 [STARTING REAL E-COMMERCE ORDER SYSTEM TEST SUITE]\n');

  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection;
  const usersColl = db.collection('users');
  const productsColl = db.collection('products');
  const ordersColl = db.collection('orders');

  const testSuffix = Date.now();
  let testProductId = null;
  let customer1Token = null;
  let customer2Token = null;
  let adminToken = null;
  let customer1Id = null;
  let customer2Id = null;
  let createdOrderId = null;
  let createdOrderDocId = null;

  try {
    // -------------------------------------------------------------
    // SETUP: Create test product & users
    // -------------------------------------------------------------
    const testProductDoc = await productsColl.insertOne({
      name: `Imperial Amber Dates ${testSuffix}`,
      slug: `imperial-amber-${testSuffix}`,
      category: 'dates',
      categoryName: 'Premium Dates',
      price: 600,
      mrp: 800,
      stock: 20,
      inStock: true,
      packSize: '250g',
      weight: '250g',
      mainImage: '/images/pouch_dates.jpg',
      image: '/images/pouch_dates.jpg',
      status: 'active',
      featured: true,
      bestseller: true,
      availableWeights: [
        { label: '250g', price: 600, originalPrice: 800 },
        { label: '500g', price: 1100, originalPrice: 1500 }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    testProductId = testProductDoc.insertedId.toString();

    // Register Customer 1
    const cust1Email = `order_cust1_${testSuffix}@qamrah.luxury`;
    const regRes1 = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Royal Patron One',
        email: cust1Email,
        password: 'Password123!'
      })
    });
    const regData1 = await regRes1.json();
    customer1Token = regData1?.data?.token;
    customer1Id = regData1?.data?.user?._id;

    // Register Customer 2
    const cust2Email = `order_cust2_${testSuffix}@qamrah.luxury`;
    const regRes2 = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Royal Patron Two',
        email: cust2Email,
        password: 'Password123!'
      })
    });
    const regData2 = await regRes2.json();
    customer2Token = regData2?.data?.token;
    customer2Id = regData2?.data?.user?._id;

    // Login Admin
    const adminLoginRes = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: process.env.ADMIN_NAME || 'QAMRAH',
        password: process.env.ADMIN_PASSWORD
      })
    });
    const adminData = await adminLoginRes.json();
    adminToken = adminData?.data?.token;

    if (!customer1Token || !customer2Token || !adminToken) {
      throw new Error('Failed to obtain authentication tokens for testing.');
    }

    // -------------------------------------------------------------
    // Test 1: Customer creates order successfully
    // -------------------------------------------------------------
    const orderPayload = {
      items: [
        {
          product: testProductId,
          quantity: 2,
          weight: '250g',
          packDesign: 'Classic QAMRAH Pack'
        }
      ],
      shippingAddress: {
        fullName: 'Royal Patron One',
        phone: '9876543210',
        address: 'Villa 14, Palm Avenue',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India'
      },
      paymentMethod: 'Cash on Delivery',
      notes: 'Please deliver in signature royal packaging.'
    };

    const res1 = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customer1Token}`
      },
      body: JSON.stringify(orderPayload)
    });
    const data1 = await res1.json();
    const createdOrder = data1?.data;
    createdOrderDocId = createdOrder?._id;
    createdOrderId = createdOrder?.orderId;

    const pass1 =
      res1.status === 201 &&
      data1.success === true &&
      createdOrder?.orderId?.startsWith('QMR-') &&
      createdOrder?.orderStatus === 'pending' &&
      createdOrder?.paymentStatus === 'pending';

    record(
      1,
      'Customer creates order successfully',
      pass1,
      `Status 201, OrderID: ${createdOrderId}, User: ${createdOrder?.user}`
    );

    // -------------------------------------------------------------
    // Test 2: Order stored in MongoDB
    // -------------------------------------------------------------
    const mongoOrder = await ordersColl.findOne({
      _id: new mongoose.Types.ObjectId(createdOrderDocId)
    });
    const pass2 =
      mongoOrder !== null &&
      mongoOrder.orderId === createdOrderId &&
      mongoOrder.items?.length === 1;

    record(
      2,
      'Order stored in MongoDB',
      pass2,
      `Retrieved directly from MongoDB collection 'orders' with ID ${mongoOrder?._id}`
    );

    // -------------------------------------------------------------
    // Test 3: Correct server-calculated subtotal
    // (2 items * ₹600 unit price = ₹1200)
    // -------------------------------------------------------------
    const pass3 = mongoOrder.subtotal === 1200;
    record(
      3,
      'Correct server-calculated subtotal',
      pass3,
      `Subtotal: ₹${mongoOrder.subtotal} (Expected 2 * ₹600 = ₹1200)`
    );

    // -------------------------------------------------------------
    // Test 4: Correct total (Subtotal >= 999 qualifies for free shipping)
    // Total = 1200 + 0 shipping = 1200
    // -------------------------------------------------------------
    const pass4 =
      mongoOrder.shippingFee === 0 &&
      mongoOrder.total === 1200 &&
      mongoOrder.discount === 0;

    record(
      4,
      'Correct total with free shipping rule',
      pass4,
      `Shipping: ₹${mongoOrder.shippingFee}, Total: ₹${mongoOrder.total}`
    );

    // -------------------------------------------------------------
    // Test 5: Product price cannot be manipulated from frontend
    // -------------------------------------------------------------
    const hackedPayload = {
      items: [
        {
          product: testProductId,
          quantity: 1,
          price: 5, // Client attempts to buy for ₹5 instead of ₹600
          weight: '250g'
        }
      ],
      shippingAddress: {
        fullName: 'Hacker Test',
        phone: '9876543210',
        address: 'Test Street',
        city: 'Mumbai',
        postalCode: '400001'
      },
      subtotal: 5, // Fake client subtotal
      total: 54 // Fake client total
    };

    const res5 = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customer1Token}`
      },
      body: JSON.stringify(hackedPayload)
    });
    const data5 = await res5.json();
    const hackedOrder = data5?.data;

    // Subtotal below 999 incurs standard ₹49 shipping: ₹600 + ₹49 = ₹649
    const pass5 =
      res5.status === 201 &&
      hackedOrder?.items[0]?.price === 600 && // Server used ₹600, not ₹5
      hackedOrder?.subtotal === 600 && // Server computed ₹600, not ₹5
      hackedOrder?.shippingFee === 49 &&
      hackedOrder?.total === 649; // Server computed ₹649, not ₹54

    record(
      5,
      'Product price cannot be manipulated by client',
      pass5,
      `Client offered ₹5; Server enforced DB price ₹${hackedOrder?.items[0]?.price} (Total: ₹${hackedOrder?.total})`
    );

    // -------------------------------------------------------------
    // Test 6: Product name/image/price snapshots saved
    // -------------------------------------------------------------
    const snapshotItem = mongoOrder.items[0];
    const pass6 =
      snapshotItem.name === `Imperial Amber Dates ${testSuffix}` &&
      snapshotItem.price === 600 &&
      snapshotItem.image === '/images/pouch_dates.jpg' &&
      snapshotItem.weight === '250g';

    record(
      6,
      'Product name/image/price snapshots saved',
      pass6,
      `Snapshot: "${snapshotItem.name}" at ₹${snapshotItem.price}, weight: ${snapshotItem.weight}`
    );

    // -------------------------------------------------------------
    // Test 7: Stock decreases correctly
    // Initial: 20. Order 1 bought 2. Order 5 bought 1. Current stock must be 17.
    // -------------------------------------------------------------
    const updatedProd7 = await productsColl.findOne({
      _id: new mongoose.Types.ObjectId(testProductId)
    });
    const pass7 = updatedProd7.stock === 17 && updatedProd7.inStock === true;

    record(
      7,
      'Stock decreases correctly',
      pass7,
      `Initial 20 - (2 + 1) = ${updatedProd7.stock} remaining in stock`
    );

    // -------------------------------------------------------------
    // Test 8: Insufficient stock rejected
    // Remaining: 17. Attempt to buy 100.
    // -------------------------------------------------------------
    const overbuyPayload = {
      items: [{ product: testProductId, quantity: 100 }],
      shippingAddress: {
        fullName: 'Overbuy Test',
        phone: '9876543210',
        address: 'Test Street',
        city: 'Mumbai',
        postalCode: '400001'
      }
    };
    const res8 = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customer1Token}`
      },
      body: JSON.stringify(overbuyPayload)
    });
    const data8 = await res8.json();
    const pass8 = res8.status === 400 && data8.success === false;

    record(
      8,
      'Insufficient stock rejected',
      pass8,
      `Requested 100 when 17 available -> HTTP ${res8.status}: "${data8.message}"`
    );

    // -------------------------------------------------------------
    // Test 9: Inactive product rejected
    // -------------------------------------------------------------
    await productsColl.updateOne(
      { _id: new mongoose.Types.ObjectId(testProductId) },
      { $set: { status: 'inactive' } }
    );

    const inactivePayload = {
      items: [{ product: testProductId, quantity: 1 }],
      shippingAddress: {
        fullName: 'Inactive Test',
        phone: '9876543210',
        address: 'Test Street',
        city: 'Mumbai',
        postalCode: '400001'
      }
    };
    const res9 = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customer1Token}`
      },
      body: JSON.stringify(inactivePayload)
    });
    const data9 = await res9.json();
    const pass9 = res9.status === 400 && data9.success === false;

    record(
      9,
      'Inactive product rejected',
      pass9,
      `HTTP ${res9.status}: "${data9.message}"`
    );

    // Re-activate product for further tests
    await productsColl.updateOne(
      { _id: new mongoose.Types.ObjectId(testProductId) },
      { $set: { status: 'active' } }
    );

    // -------------------------------------------------------------
    // Test 10: Empty cart rejected
    // -------------------------------------------------------------
    const emptyPayload = {
      items: [],
      shippingAddress: {
        fullName: 'Empty Cart',
        phone: '9876543210',
        address: 'Test',
        city: 'Mumbai',
        postalCode: '400001'
      }
    };
    const res10 = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customer1Token}`
      },
      body: JSON.stringify(emptyPayload)
    });
    const data10 = await res10.json();
    const pass10 = res10.status === 400 && data10.success === false;

    record(
      10,
      'Empty cart rejected',
      pass10,
      `HTTP ${res10.status}: "${data10.message}"`
    );

    // -------------------------------------------------------------
    // Test 11: Customer sees own orders
    // -------------------------------------------------------------
    const res11 = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${customer1Token}` }
    });
    const data11 = await res11.json();
    const pass11 =
      res11.ok &&
      Array.isArray(data11.data) &&
      data11.data.some((o) => o._id === createdOrderDocId);

    record(
      11,
      'Customer sees own orders',
      pass11,
      `Retrieved ${data11.data?.length} customer orders; includes ${createdOrderId}`
    );

    // -------------------------------------------------------------
    // Test 12: Customer cannot see another customer's order
    // Customer 2 attempts to fetch Customer 1's order
    // -------------------------------------------------------------
    const res12 = await fetch(`${API_BASE_URL}/orders/${createdOrderDocId}`, {
      headers: { Authorization: `Bearer ${customer2Token}` }
    });
    const data12 = await res12.json();
    const pass12 = res12.status === 403 && data12.success === false;

    record(
      12,
      'Customer cannot see another customer order',
      pass12,
      `Customer 2 blocked with HTTP ${res12.status} (Forbidden)`
    );

    // -------------------------------------------------------------
    // Test 13: Admin can list all orders
    // -------------------------------------------------------------
    const res13 = await fetch(`${API_BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data13 = await res13.json();
    const pass13 =
      res13.ok &&
      Array.isArray(data13.data) &&
      data13.data.some((o) => o._id === createdOrderDocId);

    record(
      13,
      'Admin can list all orders',
      pass13,
      `Admin retrieved ${data13.count} total system orders`
    );

    // -------------------------------------------------------------
    // Test 14: Admin can update order status
    // -------------------------------------------------------------
    const res14 = await fetch(`${API_BASE_URL}/orders/${createdOrderDocId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'confirmed', note: 'Payment verified manually by concierge' })
    });
    const data14 = await res14.json();
    const pass14 =
      res14.ok &&
      data14.data?.orderStatus === 'confirmed' &&
      data14.data?.timeline?.some((t) => t.status === 'confirmed');

    record(
      14,
      'Admin can update order status',
      pass14,
      `Status changed to "${data14.data?.orderStatus}" with updated timeline`
    );

    // -------------------------------------------------------------
    // Test 15: Customer cannot update order status
    // -------------------------------------------------------------
    const res15 = await fetch(`${API_BASE_URL}/orders/${createdOrderDocId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customer1Token}`
      },
      body: JSON.stringify({ status: 'delivered' })
    });
    const pass15 = res15.status === 403;

    record(
      15,
      'Customer cannot update order status',
      pass15,
      `Customer mutation rejected with HTTP ${res15.status} (Forbidden)`
    );

    // -------------------------------------------------------------
    // Test 16: Customer cannot update payment status
    // -------------------------------------------------------------
    const res16 = await fetch(`${API_BASE_URL}/orders/${createdOrderDocId}/payment-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customer1Token}`
      },
      body: JSON.stringify({ paymentStatus: 'paid' })
    });
    const pass16 = res16.status === 403;

    record(
      16,
      'Customer cannot update payment status',
      pass16,
      `Customer payment status tamper rejected with HTTP ${res16.status} (Forbidden)`
    );

    // -------------------------------------------------------------
    // Test 17: Customer can cancel eligible order & restore stock
    // Stock before cancel: 17. CreatedOrder had quantity: 2.
    // Stock after cancel should be 17 + 2 = 19.
    // -------------------------------------------------------------
    const res17 = await fetch(`${API_BASE_URL}/orders/${createdOrderDocId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customer1Token}`
      },
      body: JSON.stringify({ reason: 'Changed mind, reordering gift edition.' })
    });
    const data17 = await res17.json();
    const prodAfterCancel = await productsColl.findOne({
      _id: new mongoose.Types.ObjectId(testProductId)
    });

    const pass17 =
      res17.ok &&
      data17.data?.orderStatus === 'cancelled' &&
      prodAfterCancel.stock === 19;

    record(
      17,
      'Customer can cancel eligible order & restore stock',
      pass17,
      `Order status: "${data17.data?.orderStatus}", restored inventory to ${prodAfterCancel.stock}`
    );

    // -------------------------------------------------------------
    // Test 18: Invalid order ID handled
    // -------------------------------------------------------------
    const res18 = await fetch(`${API_BASE_URL}/orders/000000000000000000000000`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const pass18 = res18.status === 404;

    record(
      18,
      'Invalid order ID handled',
      pass18,
      `Non-existent order returned HTTP ${res18.status} (Not Found)`
    );

    // -------------------------------------------------------------
    // Test 19: Invalid product ID handled
    // -------------------------------------------------------------
    const res19 = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customer1Token}`
      },
      body: JSON.stringify({
        items: [{ product: 'not-a-valid-objectid', quantity: 1 }],
        shippingAddress: {
          fullName: 'Test',
          phone: '9876543210',
          address: 'Test',
          city: 'Mumbai',
          postalCode: '400001'
        }
      })
    });
    const pass19 = res19.status === 400;

    record(
      19,
      'Invalid product ID handled',
      pass19,
      `Malformed ObjectId rejected with HTTP ${res19.status} (Bad Request)`
    );

    // -------------------------------------------------------------
    // Test 20: No negative inventory
    // -------------------------------------------------------------
    const prodFinal = await productsColl.findOne({
      _id: new mongoose.Types.ObjectId(testProductId)
    });
    const pass20 = prodFinal.stock >= 0;

    record(
      20,
      'No negative inventory enforced',
      pass20,
      `Final inventory: ${prodFinal.stock} (non-negative)`
    );
  } finally {
    // Cleanup temporary test data
    if (testProductId) {
      await productsColl.deleteOne({
        _id: new mongoose.Types.ObjectId(testProductId)
      });
    }
    if (customer1Id) {
      await usersColl.deleteOne({
        _id: new mongoose.Types.ObjectId(customer1Id)
      });
      await ordersColl.deleteMany({ user: new mongoose.Types.ObjectId(customer1Id) });
    }
    if (customer2Id) {
      await usersColl.deleteOne({
        _id: new mongoose.Types.ObjectId(customer2Id)
      });
    }
    await mongoose.disconnect();
    console.log('\n🧹 [Test Cleanup]: Temporary test users, orders, and products cleaned up.');
  }

  const allPassed = results.every((r) => r.passed);
  console.log(`\n======================================================`);
  console.log(`ORDER SUITE RESULT: ${allPassed ? 'ALL 20 ORDER TESTS PASSED 🎉' : 'FAILURES OCCURRED ⚠️'}`);
  console.log(`Passed: ${results.filter((r) => r.passed).length}/${results.length}`);
  console.log(`======================================================\n`);

  if (!allPassed) {
    process.exit(1);
  }
}

runOrderTests().catch((err) => {
  console.error('Fatal order testing error:', err);
  process.exit(1);
});
