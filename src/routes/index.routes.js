const express = require("express")
const router = express.Router()

// Home page
router.get('/', (req, res, next) => {
     res.send('Hello Word')
})

module.exports = router