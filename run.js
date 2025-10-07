const express = require('express');
const app = express();
const http = require('http').createServer(app);
const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname);

app.use(express.static(__dirname));

for (let i = 0; i < files.length; i++) {
    if (files[i].endsWith('.html')) {
        let file = files[i].replace('.html', '');
        app.get(`/${file}`, (req, res) => {
            res.sendFile(path.join(__dirname, files[i]));
        });
    }
}

http.listen(3000, "0.0.0.0", () => {
    console.log('Server is active on http://localhost:3000');
});