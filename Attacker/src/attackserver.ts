import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';

const app = express();
const port = 4000; // Wählen Sie einen beliebigen freien Port

// Middleware für das Parsen von JSON-Daten
app.use(bodyParser.json());

// Endpunkt zum Empfangen des bösartigen Payloads
app.post('/xss-payload', (req, res) => {
    const payload = req.body.payload;
    console.log('Received XSS payload:', payload);
    res.sendStatus(200);

});


app.get("/", (_, res) => { res.send('Attacker Server'); });

// Server starten
app.listen(port, () => {
    console.log(`Attacker server is running on port http://localhost:${port}`);
});

