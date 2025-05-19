const express = require("express");
const app = express();
const pino = require("pino");
let { toBuffer } = require("qrcode");
const path = require('path');
const fs = require("fs-extra");
const { Boom } = require("@hapi/boom");
const PORT = process.env.PORT || 5000;
const MESSAGE = process.env.MESSAGE || `
┌───⭓『
❒ *ULTRA TITAN MD BOT*
❒ _NOW DEPLOY IT_
└────────────⭓
┌───⭓
❒  • Connect with me •
❒ *GitHub:* _https://github.com/Team-TitanSquad/ULTRA_TITAN-MD_
❒ *Owner:* _https://wa.me/2348039896597_
❒ *Telegram:* _https://t.me/Heartbreak798453_
❒ *Writer's Channel:* _https://whatsapp.com/channel/0029Vb63QCJ9Gv7Q5ec5rt3e_
└────────────⭓
`;

if (fs.existsSync('./auth_info_baileys')) {
    fs.emptyDirSync(__dirname + '/auth_info_baileys');
}

app.use("/", async (req, res) => {
    const { default: UltraTitanSocket, useMultiFileAuthState, Browsers, delay, DisconnectReason, makeInMemoryStore } = require("@whiskeysockets/baileys");
    const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });

    async function ULTRA_TITAN_MD_SESSION() {
        const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys');
        try {
            let bot = UltraTitanSocket({
                printQRInTerminal: false,
                logger: pino({ level: "silent" }),
                browser: [Browsers.Chrome, 'Windows 10', 'Chrome/89.0.4389.82'],
                auth: state
            });

            bot.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect, qr } = s;
                if (qr) {
                    res.end(await toBuffer(qr));
                }

                if (connection == "open") {
                    await delay(3000);
                    let user = bot.user.id;

                    let CREDS = fs.readFileSync(__dirname + '/auth_info_baileys/creds.json');
                    var sessionId = Buffer.from(CREDS).toString('base64');
                    console.log(`
====================  SESSION ID  ==========================                   
SESSION-ID ==> ${sessionId}
-------------------   SESSION CLOSED   -----------------------
`);

                    let msg = await bot.sendMessage(user, { text: sessionId });
                    await bot.sendMessage(user, { text: MESSAGE }, { quoted: msg });
                    await delay(1000);
                    try { await fs.emptyDirSync(__dirname + '/auth_info_baileys'); } catch (e) { }
                }

                bot.ev.on('creds.update', saveCreds);

                if (connection === "close") {
                    let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
                    if (reason === DisconnectReason.connectionClosed) {
                        console.log("Connection closed!");
                    } else if (reason === DisconnectReason.connectionLost) {
                        console.log("Connection Lost from Server!");
                    } else if (reason === DisconnectReason.restartRequired) {
                        console.log("Restart Required, Restarting...");
                        ULTRA_TITAN_MD_SESSION().catch(err => console.log(err));
                    } else if (reason === DisconnectReason.timedOut) {
                        console.log("Connection TimedOut!");
                    } else {
                        console.log('Connection closed with bot. Please run again.');
                        console.log(reason);
                    }
                }
            });
        } catch (err) {
            console.log(err);
            await fs.emptyDirSync(__dirname + '/auth_info_baileys');
        }
    }

    ULTRA_TITAN_MD_SESSION().catch(async (err) => {
        console.log(err);
        await fs.emptyDirSync(__dirname + '/auth_info_baileys');
    });
});

app.listen(PORT, () => console.log(`App listening on port http://localhost:${PORT}`));
