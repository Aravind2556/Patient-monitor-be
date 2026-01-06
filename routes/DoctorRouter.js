const express = require('express');
const PatientModel = require('../models/User');
const isAuth = require('../middleware/isAuth');
const { default: mongoose } = require('mongoose');
const DoctorRouter = express.Router();


DoctorRouter.get('/doctor/patient-detail', isAuth, async (req, res) => {
    try {
        if (req.session.user.role !== 'doctor') {
            return res.json({ success: false, message: 'Access denied! Not a doctor account.' });
        }
        const user = await PatientModel.find({ role: 'patient' });
        if (!user)

            return res.json({ success: false, message: 'Patient Details not found!' });

        return res.json({ success: true, message: 'Patient Details fetched successfully!', patients: user });

    }
    catch (err) {
        console.log("Trouble in Fetch all Patient Details:", err)
        return res.json({ success: false, message: "Trouble in Fetch all Patient Details! Please contact support Team." })
    }
})

DoctorRouter.get('/patient-detail/:patientId', isAuth, async (req, res) => {
    try {
        const patientId = req.params.patientId
        console.log("patientId:", patientId)
        if (!patientId)
            return res.status(400).json({ success: false, message: "Id are missing" })

        const fetchPatientDetail = await PatientModel.findOne({ _id: new mongoose.Types.ObjectId(patientId), role: 'patient' })

        if (!fetchPatientDetail)
            return res.status(400).json({ success: false, meassage: "Patient Detail Not Found" })

        return res.status(200).json({ success: true, patinetDetail: fetchPatientDetail })
    }
    catch (err) {
        console.log("Trouble in Fetch  Patient Detail:", err)
        return res.send({ success: false, message: "Trouble in Fetch Patient Detail! Please contact support Team." })
    }
})

DoctorRouter.post('/update-patient/:patientId', isAuth, async (req, res) => {
    try {
        if (req.session.user.role !== 'doctor')
            return res.json({ success: false, message: 'Access denied! Not a doctor account.' });

        const { patientId } = req.params

        if (!patientId)
            return res.status(400).json({ success: false, message: "Id are missing" })

        const { fullname, email, contact, password, age, gender } = req.body

        if (!fullname || !email || !contact || !password) {
            return res.send({ success: false, message: 'Please provide all details!' })
        }

        const fetchPatientDetail = await PatientModel.findOne({ _id: new mongoose.Types.ObjectId(patientId), role: 'patient' })

        if (!fetchPatientDetail) {
            return res.status(400).json({ success: false, meassage: "Patient Detail Not Found" })
        }

        const updatePatientDetail = await PatientModel.findOneAndUpdate({ _id: fetchPatientDetail._id }, {
            $set: {

                fullname: fullname,
                email: email,
                contact: contact,
                password: password,
                age: age && age,
                gender: gender && gender,
                role: 'patient'
            },

        },
            {
                new: true
            })

        if (!updatePatientDetail)
            return res.status(400).json({ success: false, message: "PatientDetail Update Failed. Try again" })

        return res.status(200).json({ success: true, message: "Update PatientDetail Data Successfully" })
    }

    catch (err) {
        console.log("Trouble in Update  Patient Detail:", err)
        return res.send({ success: false, message: "Trouble in Update Patient Detail! Please contact support Team." })
    }
})

DoctorRouter.delete('/delete-patient/:patientId', isAuth, async (req, res) => {
    try {
        if (req.session.user.role !== 'doctor')
            return res.json({ success: false, message: 'Access denied! Not a doctor account.' });

        const { patientId } = req.params

        if (!patientId)
            return res.status(400).json({ success: false, message: "Id are missing" })

        // 1. Find the user
        const fetchPatientDetail = await PatientModel.findOne({ _id: patientId });
        if (!fetchPatientDetail) {
            return res.status(404).json({ success: false, message: "Patient not found." });
        }

        const deletePatient = await PatientModel.deleteOne({ _id: fetchPatientDetail._id })

        if (deletePatient.deletedCount < 0)
            return res.status(400).json({ success: false, message: "Patient Not Deleted" });


        return res.status(200).json({ success: true, message: "Patient deleted successfully" });
    }
    catch (err) {
        console.log("Trouble in Delete  Patient Detail:", err)
        return res.send({ success: false, message: "Trouble in Delete Patient Detail! Please contact support Team." })
    }
})

module.exports = DoctorRouter