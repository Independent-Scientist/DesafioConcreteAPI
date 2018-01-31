// Requires
const express = require('express')
const usuarioController = require('../controllers/usuario')
const router = express.Router()
const model = require('../models/index')

// Routes
router.post('/signup', usuarioController.inserirUsuario.bind(null, model.models))
router.post('/signin', usuarioController.logarUsuario.bind(null, model.models))
router.get('/:user_id', usuarioController.buscarUsuario.bind(null, model.models))

module.exports = router
