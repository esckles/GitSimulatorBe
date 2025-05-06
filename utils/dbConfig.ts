import { connect } from "mongoose";
import env from "dotenv";
env.config();

export const dbConfig = async () => {
  try {
    await connect(process.env.MONGODB as string).then(() => {
      console.clear();
      console.log("Connected❤️🚀");
    });
  } catch (error) {
    return error;
  }
};
