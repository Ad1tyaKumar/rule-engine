import mongoose from "mongoose";

const connDB = () => {
    mongoose.connect(process.env.MONGO_URI,{dbName:"Rule-AST"}).then((data) => {
        console.log(`MongoDB connected with server: ${data.connection.host}`);
    })
}

export default connDB