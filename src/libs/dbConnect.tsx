import mongoose from "mongoose";

const { MONGODB_URI } = process.env;

let conn : any = {};

export const dbConnect = async () => {
    conn = await mongoose.connect(MONGODB_URI as string).catch(err => console.log(err));
    console.log("Database is connected.");
    return conn;
}
