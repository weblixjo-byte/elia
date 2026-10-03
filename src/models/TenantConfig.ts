import mongoose, { Schema, Document } from "mongoose";
import { ITenantConfig } from "@/lib/types";

export interface TenantConfigDocument extends Omit<ITenantConfig, "_id">, Document {}

const TenantConfigSchema = new Schema<TenantConfigDocument>(
  {
    storeName: { type: String, required: true, default: "kukh elia" },
    tagline: { type: String, default: "coffee & baked goods" },
    logoUrl: { type: String, default: "/logo.png" },
    primaryColor: { type: String, default: "#879B59" },
    accentColor: { type: String, default: "#F5F0E5" },
    terracottaColor: { type: String, default: "#879B59" },
    currency: { type: String, default: "JOD" },
    pointsPerUnit: { type: Number, default: 10 },
    discountPer100Pts: { type: Number, default: 1.00 },
    welcomeBonusPts: { type: Number, default: 25 },
  },
  { timestamps: true }
);

export default mongoose.models.TenantConfig ||
  mongoose.model<TenantConfigDocument>("TenantConfig", TenantConfigSchema);
