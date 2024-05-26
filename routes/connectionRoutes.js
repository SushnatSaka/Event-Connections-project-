const express = require('express');
const controller = require('../controllers/connectionController.js');
const {isLoggedIn, isHost, isNotHost} = require('../middlewares/auth.js');
const {validateId, validateRsvp, validateResult, validateConnection} = require('../middlewares/validator.js');

const router = express.Router();

//get /connections send all the connections to the user
router.get('/',controller.index);

//get /connections/new send html form to create a new connection
router.get('/new',isLoggedIn, controller.new);

//post /connections create a new connection
router.post('/',isLoggedIn, validateConnection, validateResult, controller.create);

//get /connections/:id send details of connection identified by id
router.get('/:id', validateId, controller.show);

//get /connections/:id/edit send html form for editing an existing story
router.get('/:id/edit', validateId, isLoggedIn, isHost, controller.edit);

//put /connections/:id update the connection identified by id
router.put('/:id', validateId, isLoggedIn, isHost, validateConnection, validateResult, controller.update);

//delete /connections/:id delete the connection identified by id
router.delete('/:id', validateId, isLoggedIn, isHost, controller.delete);

//post /connections/:id/rsvp
router.post('/:id/rsvp', validateId, isLoggedIn, isNotHost, validateRsvp, validateResult, controller.editRsvp);

module.exports = router;