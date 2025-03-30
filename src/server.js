import express from  "express";
import cors from "cors"; 
import pino from "pino-http";

import { getContacts, getContactsById} from "./services/contacts.js";

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

    app.get("/contacts", async (req, res)=> {
        const data = await getContacts();

        // res.json(data);
        
        res.json({
            status: 200,
            message: "Successfully find contacts",
            data,
        });
    });

    app.get("/contacts/:id", async(req, res)=> {
        // console.log(req.params);
        const {id} = req.params;

        const data = await getContactsById(id);

        if(!data) {
            return res.status(404).json({
                status: 404,
                message: `Contact with id=${id} not found`
            });
        }
        res.json({
            status: 200,
            message: `Successfully found contact with id=${id}`,
            data,
        });
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