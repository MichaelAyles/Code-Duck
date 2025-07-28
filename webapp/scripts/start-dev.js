const { spawn } = require('child_process');

const PORT = process.env.PORT || 3002;
const IP = '100.79.131.40';

console.log('\n🚀 Starting CodeDuck Web App...\n');
console.log(`📱 Frontend Debug: http://${IP}:${PORT}`);
console.log(`💻 Local Access: http://localhost:${PORT}`);
console.log(`🔌 Backend API: http://${IP}:4001\n`);

// Set the PORT environment variable and start react-scripts
const env = { ...process.env, PORT: PORT.toString() };
const child = spawn('react-scripts', ['start'], { 
  env, 
  stdio: 'inherit',
  shell: true 
});

child.on('error', (error) => {
  console.error('Failed to start:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code);
});