var express = require('express')
var router = express.Router()

/* GET cool in users */
router.get('/', (req,res,next) => {
	res.render('cool', {
		title: "cool"
	})
})

module.exports = router