import bcrypt from "bcryptjs";
import { ITenantConfig, IUser, ITransaction, IReward, INotification } from "./types";

export function seedInitialData() {
  const adminPasswordHash = bcrypt.hashSync("elia@2026", 10);

  const config: ITenantConfig = {
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
    updatedAt: new Date().toISOString(),
  };

  const users: IUser[] = [
    // Super Admin
    {
      _id: "admin_elia",
      role: "super_admin",
      name: "elia",
      username: "elia",
      email: "admin@kukh-elia.com",
      passwordHash: adminPasswordHash,
      pointsBalance: 0,
      lifetimePoints: 0,
      tier: "Gold",
      createdAt: new Date().toISOString(),
    },
    // Cashier
    {
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
      createdAt: new Date().toISOString(),
    },
  ];

  const transactions: ITransaction[] = [];

  const rewards: IReward[] = [];

  const notifications: INotification[] = [];

  return { config, users, transactions, rewards, notifications };
}
