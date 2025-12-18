const fetch = require('node-fetch'); // Ensure node-fetch is available or use native fetch in Node 18+

async function testAIEndpoint() {
    console.log('🧪 Testing AI API Endpoint...');

    const baseUrl = process.env.BASE_URL || 'http://localhost:8888/.netlify/functions/api';
    const endpoint = `${baseUrl}/ai/chat`;

    console.log(`Target: ${endpoint}`);

    try {
        // Test 1: Check if endpoint exists (by sending a request without key)
        // We expect 500 (Server Error: Missing Key) or 401 (Unauthorized), but NOT 404
        console.log('\n--- Test 1: Endpoint Existence Check ---');
        const response1 = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [{ role: 'user', content: 'ping' }] })
        });

        console.log(`Status: ${response1.status}`);

        if (response1.status === 404) {
            console.error('❌ FAILED: Endpoint not found (404)');
            console.log('Suggestion: Ensure server-netlify.js is deployed and the redirects in netlify.toml are active.');
        } else if (response1.status === 500 || response1.status === 401) {
            console.log('✅ PASSED: Endpoint exists (Received expected error for missing auth)');
            const data = await response1.json().catch(() => ({}));
            console.log('Response:', data);
        } else if (response1.status === 200) {
            console.log('✅ PASSED: Endpoint exists and worked unexpectedly (Key might be hardcoded?)');
        } else {
            console.log(`⚠️ INDETERMINATE: Received status ${response1.status}`);
        }

    } catch (error) {
        console.error('❌ Error executing test:', error.message);
        console.log('Ensure the server is running (e.g., `netlify dev` or `npm start`).');
    }
}

// Check for Node version to decide on fetch
if (typeof fetch === 'undefined') {
    console.log('Native fetch not found, this script requires Node 18+ or node-fetch package.');
} else {
    testAIEndpoint();
}
