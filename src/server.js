import express from  "express";
import cors from "cors"; 
import pino from "pino-http";

import Contactcollection from "./db/models/Contact.js";

import { getEnvVar } from "./utils/getEnvVar.js";

export const startServer = ()=> {
    const app = express();

    app.use(cors());
    app.use(express.json());
    // app.use(pino({
    //     transport: {
    //         target: "pino-pretty"
    //     }
    // }));

    app.get("/api/contacts", async (req, res)=> {
        const data = await Contactcollection.find();

        res.json(data);
        
        // res.json({
        //     status: 200,
        //     message: "Successfully find contacts"
        // });
    });

    app.use((req, res)=> {
        res.status(404).json({
            message: `${req.url} not found`
        });
    });

    app.use((error, req, res, next)=> {
        res.status(500).json({
            message: error.message,
        });
    });

    const port = Number(getEnvVar("PORT", 3000));

    app.listen(port, ()=> console.log(`Server running on ${port} port`));

};