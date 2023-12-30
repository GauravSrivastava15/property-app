import mongoose, { connect } from "mongoose";

const connectDB = async () => {
  try {
    const connnectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/property`
    );
    console.log(
      `\n MongoDB connected!! DB host ${connnectionInstance.connection.host}`
    );
  } catch (err) {
    console.log("MONGODB connection Failed", err);
    process.exit(1);
  }
};

export default connectDB;
