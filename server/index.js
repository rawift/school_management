require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const cookieParser = require('cookie-parser');


const app = express();
const port = 8000;


app.use(cookieParser());


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 



const userrouter = require("./routes/userRoutes");
const classrouter = require("./routes/classRoutes")



app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.json());

app.use("/user", userrouter);
app.use("/class", classrouter)






mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("DataBase connected successfully");
        const server = http.createServer(app);
        server.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}`);
        });
    })
    .catch(error => {
        console.log('Invalid database connection:', error);
    });
