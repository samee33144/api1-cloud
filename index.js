const knexFactory = require('knex');

const requiredVariables = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingVariables = requiredVariables.filter((name) => !process.env[name]);

if (missingVariables.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVariables.join(', ')}`);
}

const port = Number(process.env.DB_PORT || 3306);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('DB_PORT must be an integer between 1 and 65535');
}

const db = knexFactory({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    port,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

async function testConnection() {
  try {
    await db.raw('SELECT 1');
    console.log('Connected to MySQL successfully.');
  } finally {
    await db.destroy();
  }
}

if (require.main === module) {
  testConnection().catch((error) => {
    console.error('Failed to connect to MySQL:', error.message);
    process.exitCode = 1;
  });
}

module.exports = db;