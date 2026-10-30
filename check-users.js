const mongoose = require('mongoose');
const fs = require('fs');

// Read .env.local manually to ensure no dependency issues
const envFile = fs.readFileSync('.env.local', 'utf-8');
const match = envFile.match(/MONGODB_URI=["']?([^"'\r\n]+)["']?/);
if (!match) {
  console.error("No MONGODB_URI found in .env.local");
  process.exit(1);
}
const uri = match[1];
console.log("Connecting to:", uri.replace(/:([^:@]+)@/, ':****@'));

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

async function run() {
  try {
    mongoose.connection.on('error', err => console.error('Mongoose connection error:', err));
    console.log("Connecting with mongoose (forcing IPv4)...");
    await mongoose.connect(uri, {
      dbName: 'cinestop',
      serverSelectionTimeoutMS: 15000,
      family: 4,
    });
    console.log("Connected successfully!\n");

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`📂 CURRENT DATABASE: '${db.databaseName}'`);
    console.log(`Collections: [${collections.map(c => c.name).join(', ')}]`);

    let totalUsersFound = 0;

    // Check current target database first
    const currentUsers = await db.collection('users').find({}).toArray();
    if (currentUsers.length > 0) {
      totalUsersFound += currentUsers.length;
      console.log(`\n==============================================`);
      console.log(`✅ USERS IN '${db.databaseName}' (${currentUsers.length} found)`);
      console.log(`==============================================`);
      currentUsers.forEach((u, idx) => {
        console.log(`[${idx + 1}] Name:     ${u.name}`);
        console.log(`    Email:    ${u.email}`);
        console.log(`    Role:     ${u.role || 'user'}`);
        console.log(`    ID:       ${u._id}`);
        console.log(`    Watchlist:${u.watchlist ? u.watchlist.length : 0} items`);
        console.log(`    Favorites:${u.favorites ? u.favorites.length : 0} items`);
        console.log(`    Joined:   ${u.createdAt || 'N/A'}`);
        console.log(`----------------------------------------------`);
      });
    }

    if (totalUsersFound === 0) {
      console.log("\n⚠️ No registered users found yet in your database.");
      console.log("👉 Run `npm run seed` to insert sample users and admins automatically!");
    } else {
      console.log("\n🚀 Sample logins are ready to use:");
      console.log("🛡️ Admin: admin@cinestop.com | admin123");
      console.log("👤 User:  user@cinestop.com  | user123");
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    if (err.reason && err.reason.servers) {
      for (const [server, desc] of err.reason.servers.entries()) {
        console.log(`Server: ${server}`);
        console.log(`  Error:`, desc.error ? desc.error.message : 'No error');
        console.log(`  Type:`, desc.type);
      }
    } else {
      console.error("Connection Detailed Error:", err);
    }
    process.exit(1);
  }
}

run();
