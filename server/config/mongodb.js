import mongoose from "mongoose";

export default async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("DB connected");
    })
    .catch((error) => {
      console.log(error.message);
    });
}
