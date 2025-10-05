import * as bcrypt from "bcryptjs";
import { model, Schema } from "mongoose";
import { IUser } from "~/interfaces";

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    shareToken: { type: String, unique: true, sparse: true },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1 }, { unique: true });

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

export const User = model<IUser>("User", UserSchema);
