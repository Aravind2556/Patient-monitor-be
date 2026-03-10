const Express = require('express')
const UserModel = require('../models/User')
const isAuth = require('../middleware/isAuth')
const router = Express.Router()

router.get('/fetch-predict', async (req, res) => {
    try {

        const response = await fetch('http://localhost:8000/predict', {
            method: 'GET'
        })

        const data = await response.json()

        console.log("befor predict" , data)

        if (!data) {
            return res.json({ success: false, message: "No prediction returned from AI-ML API" })
        }

        return res.json({
            success: true,
            prediction: data
        })

    } catch (err) {
        console.log("Error in fetch AI-ML predict", err)

        return res.json({
            success: false,
            message: "Trouble in fetch AI-ML predict! contact support team"
        })
    }
})

module.exports = router