// OpenClaw Gateway - Cloud Entry Point
// This starts the OpenClaw gateway for cloud deployment

const { start } = require('openclaw');

const PORT = process.env.PORT || 3000;

async function main() {
  console.log('Starting OpenClaw Gateway...');
  console.log(`Port: ${PORT}`);
  
  // Start the gateway
  await start({
    port: parseInt(PORT),
    host: '0.0.0.0',
  });
  
  console.log(`OpenClaw Gateway running on port ${PORT}`);
}

main().catch(err => {
  console.error('Failed to start gateway:', err);
  process.exit(1);
});
