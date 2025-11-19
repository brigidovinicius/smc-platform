const { spawn } = require('child_process');
const cron = require('node-cron');

const TASK_TIME = process.env.GENERATOR_CRON ?? '0 7 * * *'; // default: 07:00 local time

function runGenerator() {
  console.log(`[${new Date().toISOString()}] Iniciando geração diária de post...`);
  const child = spawn('npm', ['run', 'generate:post'], {
    stdio: 'inherit',
    shell: true
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log(`[${new Date().toISOString()}] Geração concluída com sucesso.`);
    } else {
      console.error(`[${new Date().toISOString()}] Falha na geração (exit code ${code}).`);
    }
  });
}

console.log(`⏰ Agendando geração diária (cron: "${TASK_TIME}")`);
cron.schedule(TASK_TIME, runGenerator, { timezone: process.env.GENERATOR_TZ ?? 'America/Sao_Paulo' });

// Execução imediata opcional (comentada para evitar duplicidade)
// runGenerator();
