import express from 'express';
import path from 'path';
import loginRouter from './Login/LoginRouter';
import mongoose from 'mongoose';
import { prefillAdmin, prefillUser } from './util/prefill';
import userRouter from './User/UserRouter';
import cors from 'cors';


const app = express();
const port = 3000;


app.use(cors({ origin: "*" }))


app.use(express.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend')));


app.use("/api/login/", loginRouter);
app.use("/api/user", userRouter)
app.use('/uploads/', express.static(path.join(__dirname, '/../uploads')));

app.listen(port, () => {
    console.log(`Website Server is running http://localhost:${port}`);
});

mongoose.connect("mongodb://localhost:27017");

mongoose.connection.on("error", (error) => console.log(error));
mongoose.connection.once("open", async () => {
    await prefillAdmin()
    await prefillUser()
    console.log("Erfolgreich mit der Datenbank verbunden!");
});

