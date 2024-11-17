import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL, {
      dbName: "crud",
    });
    console.log("*** Database connected Successfully ***");
  } catch (error) {
    console.log(error);
    console.log("### Database Connection Failed ###");
  }
};
