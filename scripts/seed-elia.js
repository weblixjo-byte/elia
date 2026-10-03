const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI || 'mongodb+srv://mohammadus003_db_user:SJpSWSzaAJrzpsA8@elia.vsvexnu.mongodb.net/?retryWrites=true&w=majority';

// Mongoose Schemas
const TenantConfigSchema = new mongoose.Schema({
  _id: { type: String, default: "config_elia_default" },
  storeName: { type: String, required: true },
  tagline: { type: String, default: "" },
  logoUrl: { type: String, default: "/logo.png" },
  primaryColor: { type: String, default: "#879B59" },
  accentColor: { type: String, default: "#F5F0E5" },
  terracottaColor: { type: String, default: "#879B59" },
  currency: { type: String, default: "JOD" },
  pointsPerUnit: { type: Number, default: 10 },
  discountPer100Pts: { type: Number, default: 1.0 },
  welcomeBonusPts: { type: Number, default: 25 },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  role: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  pin: { type: String },
  qrSecret: { type: String },
  pointsBalance: { type: Number, default: 0 },
  lifetimePoints: { type: Number, default: 0 },
  tier: { type: String, default: "Member" },
  username: { type: String },
  branchName: { type: String },
  staffPin: { type: String },
  passwordHash: { type: String },
  isActive: { type: Boolean, default: true },
  email: { type: String },
  googleId: { type: String },
  avatarUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const TransactionSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  type: { type: String, required: true },
  customerId: { type: String, required: true },
  customerName: { type: String },
  customerPhone: { type: String },
  cashierId: { type: String },
  cashierName: { type: String },
  branchName: { type: String },
  billAmount: { type: Number },
  currency: { type: String, default: "JOD" },
  points: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  rewardTitle: { type: String },
  referenceCode: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const RewardSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  pointsRequired: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  imageUrl: { type: String },
  claimedCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const NotificationSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  customerId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: "SYSTEM" },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

async function runSeed() {
  console.log("Connecting to MongoDB Atlas for kukh elia...");
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  console.log("Connected successfully to Atlas cluster!");

  const TenantConfig = mongoose.models.TenantConfig || mongoose.model('TenantConfig', TenantConfigSchema);
  const User = mongoose.models.User || mongoose.model('User', UserSchema);
  const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
  const Reward = mongoose.models.Reward || mongoose.model('Reward', RewardSchema);
  const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

  // 1. Wipe all customers, transactions, rewards, notifications to guarantee 100% clean zero state
  console.log("Cleaning customer, transaction, rewards, and old account collections...");
  await User.deleteMany({});
  await Transaction.deleteMany({});
  await Reward.deleteMany({});
  await Notification.deleteMany({});
  await TenantConfig.deleteMany({});
  try {
    await mongoose.connection.db.collection('pushsubscriptions').deleteMany({});
  } catch (e) {
    // collection may not exist yet
  }

  // 2. Upsert TenantConfig
  const configData = {
    _id: "config_elia_default",
    storeName: "kukh elia",
    tagline: "coffee & baked goods",
    logoUrl: "/logo.png",
    primaryColor: "#879B59",
    accentColor: "#F5F0E5",
    terracottaColor: "#879B59",
    currency: "JOD",
    pointsPerUnit: 10,
    discountPer100Pts: 1.0,
    welcomeBonusPts: 25,
    updatedAt: new Date(),
  };
  await TenantConfig.create(configData);
  console.log("Seeded TenantConfig:", configData.storeName, "-", configData.tagline);

  // 3. Upsert Super Admin (username=elia, password=elia@2026)
  const adminHash = bcrypt.hashSync("elia@2026", 10);
  await User.create({
    _id: "admin_elia",
    role: "super_admin",
    name: "elia",
    username: "elia",
    email: "admin@kukh-elia.com",
    passwordHash: adminHash,
    pointsBalance: 0,
    lifetimePoints: 0,
    tier: "Gold",
    isActive: true,
  });
  console.log("Seeded Super Admin: username=elia, password=elia@2026, email=admin@kukh-elia.com");

  // 4. Upsert Cashier (username=elia, PIN=2026)
  await User.create({
    _id: "cashier_elia",
    role: "cashier",
    name: "elia",
    username: "elia",
    staffPin: "2026",
    branchName: "Main Branch",
    isActive: true,
    pointsBalance: 0,
    lifetimePoints: 0,
    tier: "Member",
  });
  console.log("Seeded Cashier: username=elia, PIN=2026, Branch=Main Branch");

  // 5. Verification queries
  const cols = await mongoose.connection.db.listCollections().toArray();
  console.log("\n================ VERIFIED COLLECTIONS STATS ================");
  for (const c of cols) {
    const count = await mongoose.connection.db.collection(c.name).countDocuments();
    console.log(`Collection [${c.name}]: ${count} documents`);
  }
  const custCount = await User.countDocuments({ role: "customer" });
  const txCount = await Transaction.countDocuments();
  const notifCount = await Notification.countDocuments();
  console.log(`\nVerified Customer Accounts (MUST BE ZERO): ${custCount}`);
  console.log(`Verified Transactions (MUST BE ZERO): ${txCount}`);
  console.log(`Verified Notifications (MUST BE ZERO): ${notifCount}`);
  console.log("============================================================\n");

  if (custCount !== 0 || txCount !== 0) {
    throw new Error("Sanity check failed: Collections are not zero clean state!");
  }

  console.log("ALL KUKH ELIA SEEDING COMPLETED SUCCESSFULLY WITH ZERO CLEAN STATE!");
  process.exit(0);
}

runSeed().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
