let mongoose = require('mongoose');

// create a model class
let incident = mongoose.Schema({
    incidentID: String,
    inicidentClass: String,
    inicidentDate: Date,
    inicidentDescription: String,
},
{
  collection: "incidents"
});

module.exports = mongoose.model('Incidents', incident);
