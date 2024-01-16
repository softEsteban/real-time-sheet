// import mongoose from "mongoose";

// const connectMongo = async (): Promise<void> => {
//   const mongoURI: string | undefined = process.env.MONGO_URI;
//   if (!mongoURI) {
//     throw new Error("Mongo URI is not defined.");
//   }
//   try {
//     const connection: any = await mongoose.connect(mongoURI);

//     if (connection.readyState === 1) {
//       console.log("Database connected");
//     }
//   } catch (error) {
//     throw error;
//   }
// };

// export default connectMongo;