let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

let userDetails = new Schema({
    firstname: {
        type: String,
        default: ""
    },
    lastname: {
        type: String,
        default: ""
    },
    admin:   {
        type: Boolean,
        default: false
    }
});
userDetails.plugin(passportLocalMongoose);

module.exports = mongoose.model("userDetails", userDetails);