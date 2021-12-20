let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require("passport-local-mongoose");

let userDetails = new Schema({
    admin:   {
        type: Boolean,
        default: false
    }
});
userDetails.plugin(passportLocalMongoose);

module.exports = mongoose.model("userDetails", userDetails);