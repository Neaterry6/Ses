const PastebinAPI = require('pastebin-js'),
pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const {
    default: UltraTitanMD,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require("@whiskeysockets/baileys");

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;
    
    async function ULTRA_TITAN_MD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
            let Pair_Code_By_UltraTitan = UltraTitanMD({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: ["Chrome (Linux)", "", ""]
            });

            // ✅ Force a new pairing request every time
            await delay(1500);
            num = num.replace(/[^0-9]/g, '');
            const code = await Pair_Code_By_UltraTitan.requestPairingCode(num + Date.now()); // Ensures unique requests
            
            console.log("Generated Pair Code:", code);

            if (!res.headersSent) {
                await res.send({ code });
            }

            Pair_Code_By_UltraTitan.ev.on('creds.update', saveCreds);
            Pair_Code_By_UltraTitan.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection == "open") {
                    await delay(5000);
                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    await delay(800);
                    let b64data = Buffer.from(data).toString('base64');
                    let session = await Pair_Code_By_UltraTitan.sendMessage(Pair_Code_By_UltraTitan.user.id, { text: '' + b64data });

                    console.log("Sending session notification...");
                    
                    let ULTRA_TITAN_MD_TEXT = `
*_Pair Code Connected by ULTRA TITAN MD BOT_*
*_Made With ❤️_*
______________________________________
╔════◇
║ *『 CONGRATULATIONS, YOU'VE CHOSEN ULTRA TITAN MD BOT! 』*
║ _You have completed the first step to deploying a WhatsApp bot._
╚════════════════════════╝
╔═════◇
║  『••• CONNECT WITH ME •••』
║❒ *GitHub:* _https://github.com/Team-TitanSquad/ULTRA_TITAN-MD_
║❒ *LinkedIn:* _https://www.linkedin.com/in/akewushola-abdulbakri-659458365_
║❒ *Facebook:* _https://www.facebook.com/profile.php?id=61575627958849_
║❒ *Telegram:* _https://t.me/Heartbreak798453_
║❒ *WhatsApp:* _https://wa.me/2348039896597_
║❒ *Writer's Channel:* _https://whatsapp.com/channel/0029Vb63QCJ9Gv7Q5ec5rt3e_
╚════════════════════════╝
_____________________________________

⭐ _Don't forget to star my GitHub repo!_
`;

                    await Pair_Code_By_UltraTitan.sendMessage(
                        Pair_Code_By_UltraTitan.user.id, 
                        { text: ULTRA_TITAN_MD_TEXT }, 
                        { quoted: session }
                    );

                    await delay(100);
                    await Pair_Code_By_UltraTitan.ws.close();
                    return await removeFile('./temp/' + id);
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    ULTRA_TITAN_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("Service restarted");
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "Service Unavailable" });
            }
        }
    }

    return await ULTRA_TITAN_MD_PAIR_CODE();
});

module.exports = router;
