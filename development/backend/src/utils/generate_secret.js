// generate-secret.js
import { randomBytes } from 'crypto';

// Generate a random string of 32 bytes (256 bits) and convert it to hex
const secret = randomBytes(32).toString('hex');

console.log('Your new JWT_SECRET:');
console.log(secret);
console.log('\nCopy this string and paste it into your .env file.');
console.log('Example: JWT_SECRET=YOUR_GENERATED_SECRET_HERE');