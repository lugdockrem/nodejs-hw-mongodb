import mongoose from "mongoose";

import { getEnvVar } from "../utils/getEnvVar.js";

export const initMongoConnection = async()=> {
    try {
        
        const user = getEnvVar("MONGODB_USER");
        const password = getEnvVar("MONGODB_PASSWORD");
        const url = getEnvVar("MONGODB_URL");
        const name = getEnvVar("MONGODB_DB");
        

        // await mongoose.connect(`mongodb+srv://${user}:${password}@${url}/${name}?retryWrites=true&w=majority&appName=Cluster0`);

        // await mongoose.connect("mongodb+srv://Ihor:1z8fQb8UvISQXjIh@cluster0.muglqoa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

        await mongoose.connect(`mongodb+srv://${user}:${password}@${url}/${name}?retryWrites=true&w=majority&appName=Cluster0`);

        console.log("Successfully connection to database");

    }
    catch(error) {
        console.log(error.message);
        throw error;
    }
};