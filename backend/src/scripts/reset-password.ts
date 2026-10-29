// Usage: npm run user:reset-password -- someone@example.com
// Sets a random temporary password and prints it once; change it from the profile page after signing in.
import { randomBytes } from 'node:crypto';
import * as bcrypt from 'bcrypt';
import dataSource from '../database/data-source.js';
import { User } from '../users/user.entity.js';

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error('Usage: npm run user:reset-password -- <email>');
  process.exit(1);
}

const temporaryPassword = randomBytes(9).toString('base64url');

await dataSource.initialize();
try {
  const result = await dataSource
    .getRepository(User)
    .update({ email }, { password: await bcrypt.hash(temporaryPassword, 10) });
  if (result.affected === 0) {
    console.error(`No user with email ${email}.`);
    process.exitCode = 1;
  } else {
    console.log(`Temporary password for ${email}: ${temporaryPassword}`);
    console.log('Sign in with it, then change it under My profile → Change password.');
  }
} finally {
  await dataSource.destroy();
}
