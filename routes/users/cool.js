var express = require('express')
var router = express.Router()

/* GET cool in users */
router.get('/', (req,res,next) => {
	// res.render('')
	res.send("You're so cool")
})

module.exports = router