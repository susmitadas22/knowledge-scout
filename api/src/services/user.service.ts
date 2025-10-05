import { User } from "@knowledgescout/schemas";
import * as crypto from "node:crypto";
import { CreateUserInput } from "~/validators";

export const userService = {
  async createUser(payload: CreateUserInput) {
    const { email, password } = payload;
    const user = new User({ email, password });
    const apiKey = await this.generateApiKey(user._id.toString());
    user.shareToken = `share_${apiKey}`;
    await user.save();
    return {
      shareToken: user.shareToken,
      id: user._id.toString(),
      email: user.email,
    };
  },

  async generateApiKey(userId: string) {
    const apiKey = crypto.randomBytes(32).toString("hex") + userId;
    return apiKey;
  },
};
