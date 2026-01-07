const Compression = require('../models/Compression')
const HeatTherapy = require('../models/HeatTherapy')
const Vibration = require('../models/Vibration')

const ThinkSpeakURL = process.env.ThinkSpeak_URL

const fetchThinkSpeakData = async () => {
    try{
        if(!ThinkSpeakURL) {
            console.error("ThinkSpeak URL is not defined in environment variables.");
            return;
        }
        const res = await fetch(ThinkSpeakURL);
        const data =  await res.json();

        for(let entry of data.feeds) {
            const currentCompressStatus = entry.field6?.match(/\d+/) ? Number(entry.field6) : null;
            const currentHeatStatus = entry.field7?.match(/\d+/) ? Number(entry.field7) : null;
            const currentVibrationStatus = entry.field8?.match(/\d+/) ? Number(entry.field8) : null;

            const patientId = entry.field5?.match(/\d+/) ? Number(entry.field5) : null;
            if(!patientId) continue;

            const currentEntryId = entry.entry_id;
            if (!currentEntryId) continue;

            const currentThinkpSpeakEntry = {
                entryId: currentEntryId,
                temperature: entry.field1.match(/\d+/) ? Number(entry.field1) : 0,
                airPressure: entry.field2.match(/\d+/) ? Number(entry.field2) : 0,
                heartRate: entry.field3.match(/\d+/) ? Number(entry.field3) : 0,
                spo2: entry.field4.match(/\d+/) ? Number(entry.field4) : 0,
            }

            const recentCompressionSession = await Compression.findOne({ patientId }).sort({ 'createdAt': -1 });
            const recentCompressionEntry = recentCompressionSession?.entries?.length > 0 ? recentCompressionSession.entries[recentCompressionSession.entries.length - 1] : null;
            if (currentCompressStatus === 1){
                if (recentCompressionSession && !recentCompressionSession.closedAt) {
                    if (recentCompressionEntry?.entryId < currentEntryId) {
                        recentCompressionSession.entries.push(currentThinkpSpeakEntry);
                        await recentCompressionSession.save();
                    }
                    else if (!recentCompressionEntry) {
                        recentCompressionSession.entries = [currentThinkpSpeakEntry]
                        await recentCompressionSession.save();
                    }
                }
                else {
                    const recentCompressionData = await Compression.find({}).sort({ 'createdAt': -1 });
                    let newId = 1;
                    if (recentCompressionData.length > 0) {
                        newId = recentCompressionData[0].id + 1;
                    }
                    const newCompressionSession = new Compression({
                        id: newId,
                        patientId: patientId,
                        entries: [currentThinkpSpeakEntry]
                    });
                    await newCompressionSession.save();
                } 
            }
            else if(currentCompressStatus === 0){
                if(recentCompressionSession && !recentCompressionSession.closedAt) {
                    recentCompressionSession.closedAt = new Date();
                    await recentCompressionSession.save();
                }
            }

            const recentHeatSession = await HeatTherapy.findOne({ patientId }).sort({ 'createdAt': -1 });
            const recentHeatEntry = recentHeatSession?.entries?.length > 0 ? recentHeatSession.entries[recentHeatSession.entries.length - 1] : null;
            if (currentHeatStatus === 1){
                if (recentHeatSession && !recentHeatSession.closedAt) {
                    if (recentHeatEntry?.entryId < currentEntryId) {
                        recentHeatSession.entries.push(currentThinkpSpeakEntry);
                        await recentHeatSession.save();
                    }
                    else if (!recentHeatEntry) {
                        recentHeatEntry.entries = [currentThinkpSpeakEntry]
                        await recentHeatSession.save();
                    }
                }
                else {
                    const recentHeatData = await HeatTherapy.find({}).sort({ 'createdAt': -1 });
                    let newId = 1;
                    if (recentHeatData.length > 0) {
                        newId = recentHeatData[0].id + 1;
                    }
                    const newHeatSession = new HeatTherapy({
                        id: newId,
                        patientId: patientId,
                        entries: [currentThinkpSpeakEntry]
                    });
                    await newHeatSession.save();
                }
            }
            else if(currentHeatStatus === 0){
                if(recentHeatSession && !recentHeatSession.closedAt) {
                    recentHeatSession.closedAt = new Date();
                    await recentHeatSession.save();
                }
            }

            const recentVibrationSession = await Vibration.findOne({ patientId }).sort({ 'createdAt': -1 });
            const recentVibrationEntry = recentVibrationSession?.entries?.length > 0 ? recentVibrationSession.entries[recentVibrationSession.entries.length - 1] : null;
            if (currentVibrationStatus === 1){
                if (recentVibrationSession && !recentVibrationSession.closedAt) {
                    if (recentVibrationEntry?.entryId < currentEntryId) {
                        recentVibrationSession.entries.push(currentThinkpSpeakEntry);
                        await recentVibrationSession.save();
                    }
                    else if (!recentVibrationEntry) {
                        recentVibrationEntry.entries = [currentThinkpSpeakEntry]
                        await recentVibrationSession.save();
                    }
                }
                else {
                    const recentVibrationData = await Vibration.find({}).sort({ 'createdAt': -1 });
                    let newId = 1;
                    if (recentVibrationData.length > 0) {
                        newId = recentVibrationData[0].id + 1;
                    }
                    const newVibrationSession = new Vibration({
                        id: newId,
                        patientId: patientId,
                        entries: [currentThinkpSpeakEntry]
                    });
                    await newVibrationSession.save();
                }
            }
            else if(currentVibrationStatus === 0){
                if(recentVibrationSession && !recentVibrationSession.closedAt) {
                    recentVibrationSession.closedAt = new Date();
                    await recentVibrationSession.save();
                }
            }
        }
    }
    catch(err) {
        console.error("Error fetching live data:", err);
    }
}

module.exports = { fetchThinkSpeakData}