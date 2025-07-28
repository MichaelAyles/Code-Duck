const axios = require('axios');

const checkBackend = async () => {
  console.log('🔍 Checking if backend is running...');
  
  try {
    const response = await axios.get('http://localhost:4001', { timeout: 3000 });
    console.log('✅ Backend is running:', response.data.message);
    return true;
  } catch (error) {
    console.error('\n❌ Backend is not running!');
    console.log('\n📦 Please start the backend first:');
    console.log('   docker-compose up\n');
    console.log('Or run both together:');
    console.log('   npm run dev:all\n');
    return false;
  }
};

module.exports = checkBackend;