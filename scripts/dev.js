import { spawn } from 'child_process';

console.log('✨ Starting QAMRAH Full Stack Development Environment...');

const isWindows = process.platform === 'win32';
const npxCmd = isWindows ? 'npx.cmd' : 'npx';
const nodeCmd = isWindows ? 'node.exe' : 'node';

const backend = spawn(nodeCmd, ['backend/server.js'], {
  stdio: 'inherit',
  shell: isWindows
});

const frontend = spawn(npxCmd, ['vite'], {
  stdio: 'inherit',
  shell: isWindows
});

const cleanup = () => {
  try { backend.kill(); } catch (_) {}
  try { frontend.kill(); } catch (_) {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
