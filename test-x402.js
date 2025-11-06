#!/usr/bin/env node

/**
 * Test script for X402 Payment System
 * Run with: node test-x402.js
 */

const BASE_URL = 'http://localhost:3000';
const CLIENT_ID = 'alice123';

async function makeRequest(method, url, data = null, headers = {}) {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);
    const result = await response.json();
    
    console.log(`\n${method} ${url}`);
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    return { status: response.status, data: result };
  } catch (error) {
    console.error('Request failed:', error.message);
    return { status: 0, error: error.message };
  }
}

async function testX402Flow() {
  console.log('🚀 Testing X402 Payment Flow');
  console.log('================================\n');

  // 1. Health check
  console.log('1. Health Check');
  await makeRequest('GET', `${BASE_URL}/health`);

  // 2. Try accessing protected route without balance (should get 402)
  console.log('\n2. Accessing protected route without balance');
  const result1 = await makeRequest('GET', `${BASE_URL}/api/getUserData`, null, {
    'x-client-id': CLIENT_ID
  });

  let invoiceId = null;
  if (result1.status === 402 && result1.data.invoice) {
    invoiceId = result1.data.invoice.id;
    console.log(`📄 Invoice created: ${invoiceId}`);
  }

  // 3. Check balance (should be 0)
  console.log('\n3. Checking initial balance');
  await makeRequest('GET', `${BASE_URL}/x402/balance`, null, {
    'x-client-id': CLIENT_ID
  });

  // 4. Top up balance
  console.log('\n4. Topping up balance');
  await makeRequest('POST', `${BASE_URL}/x402/topup`, {
    clientId: CLIENT_ID,
    amount: 10
  });

  // 5. Check balance again
  console.log('\n5. Checking balance after top-up');
  await makeRequest('GET', `${BASE_URL}/x402/balance`, null, {
    'x-client-id': CLIENT_ID
  });

  // 6. Pay the invoice if we have one
  if (invoiceId) {
    console.log('\n6. Paying the invoice');
    await makeRequest('POST', `${BASE_URL}/x402/pay-invoice`, {
      invoiceId: invoiceId,
      payerClientId: CLIENT_ID
    });

    // 7. Check invoice status
    console.log('\n7. Checking invoice status');
    await makeRequest('GET', `${BASE_URL}/x402/invoice/${invoiceId}`);
  }

  // 8. Try accessing protected route again (should work now)
  console.log('\n8. Accessing protected route with balance');
  await makeRequest('GET', `${BASE_URL}/api/getUserData`, null, {
    'x-client-id': CLIENT_ID
  });

  // 9. Get products (another protected route)
  console.log('\n9. Getting products');
  await makeRequest('GET', `${BASE_URL}/api/products`, null, {
    'x-client-id': CLIENT_ID
  });

  // 10. Check final balance
  console.log('\n10. Checking final balance');
  await makeRequest('GET', `${BASE_URL}/x402/balance`, null, {
    'x-client-id': CLIENT_ID
  });

  console.log('\n✅ X402 Payment Flow Test Complete!');
}

// Run the test
testX402Flow().catch(console.error);
