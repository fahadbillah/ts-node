import { Schema, model } from 'mongoose';
import timestamps = require('mongoose-timestamp');
import * as bcrypt from 'bcryptjs'
import * as uuid from 'uuid'
const SALT_WORK_FACTOR = 10;

let UserSchema: Schema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  contact: {
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    address: {
      permanent: {
        type: String
      },
      current: {
        type: String
      }
    }
  },
  accountStatus: {
    type: String,
    enum: ['not_yet_activated', 'active', 'deactivated', 'banned'],
    default: 'not_yet_activated',
    required: true
  },
  userType: {
    type: String,
    enum: ['user', 'admin', 'superAdmin'],
    default: 'user',
    required: true
  },
  token: {
    type: String,
    default: function() {
        return uuid();
    }
  },
  oldPasswords: [],
  updateHistory: []
});

// UserSchema.path('contact.email').index({ unique: true });
// UserSchema.path('phone.email').index({ unique: true });
UserSchema.index({ userName: 1}, { unique: true })


UserSchema.plugin(timestamps);

UserSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
  });
});

export default model('User', UserSchema)
