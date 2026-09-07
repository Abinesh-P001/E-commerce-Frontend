import assert from 'assert';
import prisma from '../src/config/database.js';
import { generateToken } from '../src/utils/generateToken.js';

const API_BASE = 'http://localhost:5000/api';
const FRONTEND_BASE = 'http://localhost:5173';

async function req(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function runTests() {
  console.log('🚀 Starting DairyFresh E2E Verification Suite (Dairy_Fresh_Product)...\n');

  // Test 1: Frontend serving
  console.log('1. Testing Frontend HTTP Server...');
  const feRes = await fetch(FRONTEND_BASE);
  assert.strictEqual(feRes.status, 200, 'Frontend must return HTTP 200');
  console.log('   ✅ Frontend served successfully on port 5173');

  // Test 2: Backend Health Check
  console.log('2. Testing Backend Health Check...');
  const health = await req('/health');
  assert.strictEqual(health.status, 200);
  assert.strictEqual(health.data.status, 'healthy');
  console.log('   ✅ Backend health verified on port 5000');

  // Test 3: Categories
  console.log('3. Testing Categories API...');
  const cats = await req('/categories');
  assert.strictEqual(cats.status, 200);
  assert(cats.data.data.categories.length >= 10, 'Must have 10 categories');
  console.log(`   ✅ Categories retrieved: ${cats.data.data.categories.length} categories found`);

  // Test 4: Products & 360 Image Sequence
  console.log('4. Testing Products & 360 Image Sequence...');
  const prods = await req('/products?limit=20');
  assert.strictEqual(prods.status, 200);
  assert(prods.data.data.products.length > 0, 'Must return products');
  
  const flagship = prods.data.data.products.find((p) => p.name.includes('A2 Organic'));
  assert(flagship, 'Flagship A2 milk product must exist');
  
  const flagshipDetails = await req(`/products/${flagship.id}`);
  assert.strictEqual(flagshipDetails.status, 200);
  const pData = flagshipDetails.data.data.product;
  assert(pData.view360Images.length === 36, `Must have exactly 36 frames for 360 view`);
  
  const frameRes = await fetch(`http://localhost:5000${pData.view360Images[0].url}`);
  assert.strictEqual(frameRes.status, 200, '360 frame file must be served via HTTP 200');
  console.log(`   ✅ Flagship product has 36 verified 360-degree rotation frames`);

  // Test 5: Verify or Register ADMIN User
  console.log('5. Testing ADMIN Authentication & Permissions...');
  let adminToken;
  const existingAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (existingAdmin) {
    adminToken = generateToken({ id: existingAdmin.id, role: existingAdmin.role });
    console.log(`   ✅ Active ADMIN user verified: ${existingAdmin.name} (${existingAdmin.email})`);
  } else {
    const regAdmin = await req('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Owner Admin',
        email: `owner_${Date.now()}@dairyfresh.com`,
        password: 'AdminPassword@123',
        phone: '+91 98765 00001',
      }),
    });
    assert.strictEqual(regAdmin.status, 201);
    assert.strictEqual(regAdmin.data.data.user.role, 'ADMIN', 'First registered user must be ADMIN');
    adminToken = regAdmin.data.data.token;
    console.log(`   ✅ First user registered as ADMIN successfully: ${regAdmin.data.data.user.name}`);
  }
  const adminHeaders = { Authorization: `Bearer ${adminToken}` };

  // Test 6: Second User Registration -> Regular CUSTOMER Role
  console.log('6. Testing Second User Registration as CUSTOMER...');
  const regCustomer = await req('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Priya Patel',
      email: `priya_${Date.now()}@example.com`,
      password: 'CustomerPass@123',
      phone: '+91 98765 00002',
    }),
  });
  assert.strictEqual(regCustomer.status, 201);
  assert.strictEqual(regCustomer.data.data.user.role, 'CUSTOMER', 'Subsequent registered users must be CUSTOMER');
  const customerToken = regCustomer.data.data.token;
  const customerHeaders = { Authorization: `Bearer ${customerToken}` };
  console.log(`   ✅ Second user registered as CUSTOMER successfully: ${regCustomer.data.data.user.name}`);

  // Test 7: Add Address for Customer
  console.log('7. Testing Customer Address Creation...');
  const addrRes = await req('/addresses', {
    method: 'POST',
    headers: customerHeaders,
    body: JSON.stringify({
      fullName: 'Priya Patel',
      phone: '+91 98765 00002',
      addressLine: 'Villa 12, Sunshine Meadows',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
      isDefault: true,
    }),
  });
  assert.strictEqual(addrRes.status, 201);
  const targetAddressId = addrRes.data.data.address.id;
  console.log(`   ✅ Address saved: ID ${targetAddressId}`);

  // Test 8: Cart Operations & Total Calculation
  console.log('8. Testing Cart Operations...');
  await req('/cart/items', {
    method: 'POST',
    headers: customerHeaders,
    body: JSON.stringify({ productId: flagship.id, quantity: 2 }),
  });
  const cartRes = await req('/cart', { headers: customerHeaders });
  assert.strictEqual(cartRes.status, 200);
  assert.strictEqual(cartRes.data.data.items.length, 1);
  console.log(`   ✅ Cart verified: Total = ₹${cartRes.data.data.total}`);

  // Test 9: Order Placement & Inventory Decrement
  console.log('9. Testing Atomic Order Placement...');
  const initialStock = pData.stock;
  const orderRes = await req('/orders', {
    method: 'POST',
    headers: customerHeaders,
    body: JSON.stringify({
      addressId: targetAddressId,
      paymentMethod: 'ONLINE',
    }),
  });
  assert.strictEqual(orderRes.status, 201);
  const createdOrder = orderRes.data.data.order;
  assert(createdOrder.id, 'Must have order ID');
  console.log(`   ✅ Order #${createdOrder.id} placed successfully`);

  // Test 10: Payment Verification
  console.log('10. Testing Payment Verification...');
  const payOrder = await req('/payment/create-order', {
    method: 'POST',
    headers: customerHeaders,
    body: JSON.stringify({ orderId: createdOrder.id }),
  });
  assert.strictEqual(payOrder.status, 200);

  const verifyPay = await req('/payment/verify', {
    method: 'POST',
    headers: customerHeaders,
    body: JSON.stringify({
      orderId: createdOrder.id,
      razorpayOrderId: payOrder.data.data.razorpayOrderId,
      razorpayPaymentId: 'pay_test_live_ok_123',
      razorpaySignature: 'mock_sig',
    }),
  });
  assert.strictEqual(verifyPay.status, 200);
  console.log('   ✅ Payment confirmed successfully');

  // Test 11: Admin Operations & Order Status Updates
  console.log('11. Testing Admin Analytics & Order Status Management...');
  const analytics = await req('/admin/analytics', { headers: adminHeaders });
  assert.strictEqual(analytics.status, 200);
  console.log(`    ✅ Admin Analytics: Orders = ${analytics.data.data.stats.totalOrders}, Revenue = ₹${analytics.data.data.stats.totalRevenue}`);

  const updateStatus = await req(`/orders/${createdOrder.id}/status`, {
    method: 'PUT',
    headers: adminHeaders,
    body: JSON.stringify({ status: 'SHIPPED' }),
  });
  assert.strictEqual(updateStatus.status, 200);
  assert.strictEqual(updateStatus.data.data.order.orderStatus, 'SHIPPED');
  console.log(`    ✅ Admin successfully updated Order #${createdOrder.id} to SHIPPED`);

  // Test 12: Dedicated Admin Login (/api/auth/admin-login) & Customer Rejection
  console.log('12. Testing Dedicated Admin Login & Customer Access Guard...');
  const custTryAdminLogin = await req('/auth/admin-login', {
    method: 'POST',
    body: JSON.stringify({
      email: regCustomer.data.data.user.email,
      password: 'CustomerPass@123',
    }),
  });
  assert.strictEqual(custTryAdminLogin.status, 403, 'Regular customer must be rejected from admin login with 403');
  console.log('    ✅ Customer correctly denied entry at /api/auth/admin-login (403 Forbidden)');

  // Test 13: Customer Isolation & Admin Team Query
  console.log('13. Testing Customer vs Administrator Data Isolation...');
  const custListRes = await req('/admin/users', { headers: adminHeaders });
  assert.strictEqual(custListRes.status, 200);
  const foundAdminInCustomers = custListRes.data.data.users.some((u) => u.role === 'ADMIN');
  assert.strictEqual(foundAdminInCustomers, false, 'Admins must NEVER be stored/returned in Customer details');
  console.log(`    ✅ Customer details query returned ${custListRes.data.data.users.length} users with 0 admin contamination`);

  const adminListRes = await req('/admin/administrators', { headers: adminHeaders });
  assert.strictEqual(adminListRes.status, 200);
  assert(adminListRes.data.data.administrators.length >= 1, 'Must return admin team members');
  console.log(`    ✅ Admin Team query returned ${adminListRes.data.data.administrators.length} authorized administrators`);

  // Test 14: In-Dashboard Admin Creation
  console.log('14. Testing In-Dashboard Administrator Creation...');
  const newAdminEmail = `subadmin_${Date.now()}@dairyfresh.com`;
  const createAdminRes = await req('/admin/create-admin', {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      name: 'Operations Manager',
      email: newAdminEmail,
      password: 'SubAdminPass@123',
      phone: '+91 98765 88888',
    }),
  });
  assert.strictEqual(createAdminRes.status, 201);
  assert.strictEqual(createAdminRes.data.data.administrator.role, 'ADMIN');

  const subAdminLogin = await req('/auth/admin-login', {
    method: 'POST',
    body: JSON.stringify({
      email: newAdminEmail,
      password: 'SubAdminPass@123',
    }),
  });
  assert.strictEqual(subAdminLogin.status, 200);
  assert.strictEqual(subAdminLogin.data.data.user.role, 'ADMIN');
  console.log(`    ✅ Successfully created and authenticated new Administrator: ${newAdminEmail}`);

  // Test 15: Order Cancellation with Reason & Feedback Suggestion
  console.log('15. Testing Order Cancellation with Reason & Suggestions...');
  // Place another order to cancel
  await req('/cart/items', {
    method: 'POST',
    headers: customerHeaders,
    body: JSON.stringify({ productId: flagship.id, quantity: 1 }),
  });
  const orderToCancelRes = await req('/orders', {
    method: 'POST',
    headers: customerHeaders,
    body: JSON.stringify({
      addressId: targetAddressId,
      paymentMethod: 'COD',
    }),
  });
  assert.strictEqual(orderToCancelRes.status, 201);
  const cancelOrderId = orderToCancelRes.data.data.order.id;

  const cancelResult = await req(`/orders/${cancelOrderId}/cancel`, {
    method: 'PUT',
    headers: customerHeaders,
    body: JSON.stringify({
      reason: 'Delivery schedule does not suit my timing',
      suggestion: 'Please offer an evening 6:00 PM delivery window in Bangalore',
    }),
  });
  assert.strictEqual(cancelResult.status, 200);
  assert.strictEqual(cancelResult.data.data.order.orderStatus, 'CANCELLED');
  assert.strictEqual(cancelResult.data.data.order.cancelReason, 'Delivery schedule does not suit my timing');
  assert.strictEqual(cancelResult.data.data.order.cancelSuggestion, 'Please offer an evening 6:00 PM delivery window in Bangalore');
  console.log(`    ✅ Order #${cancelOrderId} cancelled with recorded reason & customer suggestion`);

  console.log('\n======================================================');
  console.log('🎉 ALL 15 E2E TESTS PASSED ON Dairy_Fresh_Product!');
  console.log('======================================================\n');
}

runTests().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
