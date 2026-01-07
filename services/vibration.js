const cron = require("node-cron");
const fetch = require("node-fetch");
const Vibration = require("../models/Vibration");

const THINGSPEAK_URL =
    "https://api.thingspeak.com/channels/3219392/feeds.json?api_key=96J95CYVNMTEQPUN&results=1";

let isRecording = false;
let activePatientId = null;

cron.schedule("*/5 * * * * *", async () => {
    try {
        const response = await fetch(THINGSPEAK_URL);
        const data = await response.json();

        if (!data.feeds || data.feeds.length === 0) return;

        const feed = data.feeds.slice(-1)[0];

        const vibrationStatus = Number(feed.field8); // 1 = ON, 0 = OFF
        const patientId = Number(feed.field5);

        //OFF → stop recording
        if (vibrationStatus === 1) {
            if (isRecording) {
                console.log("Recording stopped for patient:", activePatientId);
            }
            isRecording = false;
            activePatientId = null;
            return;
        }

        //ON → start / continue recording
        if (vibrationStatus === 0) {

            const lastRecord = await Vibration
                .findOne({})
                .sort({ id: -1 });

            const userId = lastRecord ? lastRecord.id + 1 : 1;

            // 🆕 NEW SESSION (first ON after OFF)
            if (!isRecording) {
                isRecording = true;
                activePatientId = patientId;

                await Vibration.create({
                    id: userId,
                    patientId,
                    entries: []
                });

                console.log("New patient session started:", patientId);
            }

            //PUSH DATA into ACTIVE session
            const record = await Vibration.findOne({ patientId: activePatientId });

            if (!record) return;

            record.entries.push({
                temperature: Number(feed.field1),
                airPressure: Number(feed.field2),
                heartRate: Number(feed.field3),
                spo2: Number(feed.field4)
            });

            await record.save();
            console.log("Vibration saved for", activePatientId);
        }

    } catch (err) {
        console.error("Cron error:", err);
    }
})

