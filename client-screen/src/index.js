const QRCode = require('qrcodejs');

const API_URL = 'http://localhost:3000';



createGame();

function createGame() {
    fetch(`${API_URL}/game`, { method: 'POST' })
        .then(response => response.json())
        .then(jsonResponse => {
            const qrCode = new QRCode(document.getElementById('qrcode'), { 
                text: `${jsonResponse.game.id}_${jsonResponse.game.verificationCode}`
             });
            console.log('json', jsonResponse);
        })
}