'use strict';

var conn = require('../lib/connectMongoose.js');
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String,
    age: Number
});