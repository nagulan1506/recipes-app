const http = require('http');

console.log('🔍 Verifying Recipes API...\n');

// Test server connection
function testConnection() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/health',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ Server is running successfully!');
        console.log('📍 Base URL: http://localhost:3000');
        console.log('🏥 Health Check: http://localhost:3000/api/health');
        console.log('📚 API Docs: http://localhost:3000/api');
        console.log('🔗 Recipes API: http://localhost:3000/api/v1/recipes');

        try {
          const response = JSON.parse(data);
          console.log('\n📋 Server Status:');
          console.log(`   Environment: ${response.environment || 'unknown'}`);
          console.log(`   Version: ${response.version || 'unknown'}`);
          console.log(`   Timestamp: ${response.timestamp || 'unknown'}`);
        } catch (e) {
          console.log('\n📄 Raw Response:', data);
        }

        console.log('\n🧪 Manual Testing Options:');
        console.log('1. Open browser and visit: http://localhost:3000/api/health');
        console.log('2. Open browser and visit: http://localhost:3000/api/v1/recipes');
        console.log('3. Use Postman with the provided collection');
        console.log('4. Use cURL commands from the API guide');

        console.log('\n📝 Sample cURL Commands:');
        console.log('# Get all recipes');
        console.log('curl "http://localhost:3000/api/v1/recipes"');
        console.log('\n# Get recipe stats');
        console.log('curl "http://localhost:3000/api/v1/recipes/stats"');
        console.log('\n# Search recipes');
        console.log('curl "http://localhost:3000/api/v1/recipes?search=chocolate"');

        console.log('\n🎉 API is ready for testing!');
      } else {
        console.log(`❌ Server responded with status: ${res.statusCode}`);
        console.log('📄 Response:', data);
      }
    });
  });

  req.on('error', (err) => {
    if (err.code === 'ECONNREFUSED') {
      console.log('❌ Server is not running!');
      console.log('\n🚀 To start the server:');
      console.log('1. Open a new terminal');
      console.log('2. Navigate to: C:\\guvi\\New folder\\recipes-app');
      console.log('3. Run: npm start');
      console.log('\n⏳ Then run this verification script again.');
    } else {
      console.log(`❌ Connection error: ${err.message}`);
    }
  });

  req.on('timeout', () => {
    console.log('❌ Connection timeout - server might be starting up');
    req.destroy();
  });

  req.end();
}

testConnection();
