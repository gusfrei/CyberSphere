const express = require('express');
const router = express.Router();
const Incident = require('../models/incidents');

// GET incidents List page. READ
router.get('/', (req, res, next) => {
  Incident.find({}, (err, incidents) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    res.render('incidents/index', {
      title: 'Incidents',
      incidents: incidents
    });
  });
});

// GET the incident Details page to add a new incident
router.get('/add', (req, res, next) => {
  res.render('incidents/details', {
    title: 'Add Incident',
    incidents: {}
  });
});

// POST process the incident Details page and create a new incident - CREATE
router.post('/add', (req, res, next) => {
  let newIncident = new Incident({
    incidentID: req.body.incidentID,
    incidentClass: req.body.incidentClass,
    incidentDate: req.body.incidentDate,
    incidentDescription: req.body.incidentDescription
  });

  newIncident.save((err, createdIncident) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    res.redirect('/incidents');
  });
});

// GET the incident Details page to edit an existing incident
router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Incident.findById(id, (err, incidentToEdit) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    res.render('incidents/details', {
      title: 'Edit Incident',
      incident: incidentToEdit
    });
  });
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {
  let id = req.params.id;
  let updatedIncident = {
    incidentID: req.body.incidentID,
    incidentClass: req.body.incidentClass,
    incidentDate: req.body.incidentDate,
    incidentDescription: req.body.incidentDescription
  };

  Incident.findByIdAndUpdate(id, updatedIncident, (err) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    res.redirect('/incidents');
  });
});

// GET - process the delete by incident id
router.get('/delete/:id', (req, res, next) => {
  let id = req.params.id;
  Incident.findByIdAndRemove(id, (err) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    res.redirect('/incidents');
  });
});

module.exports = router;