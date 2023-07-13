let mongoose = require('mongoose');

// create a model class
let incident = mongoose.Schema({
    incidentID: String,
    incidentClass: String,
    incidentDate: Date,
    incidentDescription: String,
},
{
  collection: "incidents"
});

module.exports = mongoose.model('Incidents', incident);
