// Usage: npm run user:promote -- someone@example.com
// Runs outside Nest (like the TypeORM CLI), so it reuses the CLI data source.
import dataSource from '../database/data-source.js';
import { User } from '../users/user.entity.js';

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error('Usage: npm run user:promote -- <email>');
  process.exit(1);
}

await dataSource.initialize();
try {
  const result = await dataSource.getRepository(User).update({ email }, { role: 'admin' });
  if (result.affected === 0) {
    console.error(`No user with email ${email}. Sign up on the website first, then run this again.`);
    process.exitCode = 1;
  } else {
    console.log(`${email} is now an admin.`);
  }
} finally {
  await dataSource.destroy();
}
