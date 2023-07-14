let mongoose = require('mongoose');

// create a model class
let incident = mongoose.Schema({
    incidentID: String,
    incidentClass: String,
    incidentDate: String,
    incidentDescription: String,
},
{
  collection: "incidents"
});

module.exports = mongoose.model('Incidents', incident);
