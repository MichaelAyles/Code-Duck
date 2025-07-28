const { spawn } = require('child_process');
const checkBackend = require('./check-backend');

const startBackend = () => {
  console.log('🐳 Starting backend with Docker Compose...\n');
  
  const backend = spawn('docker-compose', ['up'], { 
    stdio: 'inherit',
    shell: true 
  });

  backend.on('error', (error) => {
    console.error('Failed to start backend:', error);
    process.exit(1);
  });

  // Give backend time to start
  setTimeout(() => {
    startFrontend();
  }, 5000);
};

const startFrontend = () => {
  console.log('\n🚀 Starting frontend...\n');
  
  const frontend = spawn('npm', ['run', 'dev:frontend'], { 
    stdio: 'inherit',
    shell: true 
  });

  frontend.on('error', (error) => {
    console.error('Failed to start frontend:', error);
    process.exit(1);
  });
};

const startDev = async () => {
  const backendRunning = await checkBackend();
  
  if (!backendRunning) {
    console.log('\n📦 Backend not running. Starting it now...\n');
    startBackend();
  } else {
    startFrontend();
  }
};

startDev();