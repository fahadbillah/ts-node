import * as bcrypt from "bcryptjs";
import { model, Schema } from "mongoose";
import timestamps = require("mongoose-timestamp");
import * as uuid from "uuid";
const SALT_WORK_FACTOR = 10;

const UserSchema: Schema = new Schema({
  accountStatus: {
    default: "not_yet_activated",
    enum: ["not_yet_activated", "active", "deactivated", "banned"],
    required: true,
    type: String,
  },
  address: {
    current: {
      type: String,
    },
    permanent: {
      type: String,
    },
  },
  contact: {
    email: {
      required: true,
      type: String,
      unique: true,
    },
    phone: {
      required: true,
      type: String,
      unique: true,
    },
  },
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  oldPasswords: [],
  password: {
    required: true,
    type: String,
  },
  token: {
    default: () => {
        return uuid();
    },
    type: String,
  },
  updateHistory: [],
  userName: {
    required: true,
    type: String,
    unique: true,
  },
  userType: {
    default: "user",
    enum: ["user", "admin", "superAdmin"],
    required: true,
    type: String,
  },
});

// UserSchema.path("contact.email").index({ unique: true });
// UserSchema.path("phone.email").index({ unique: true });
UserSchema.index({ userName: 1}, { unique: true });

UserSchema.plugin(timestamps);

UserSchema.pre("save", function(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (error, salt) => {
    if (error) {
      return next(error);
    }

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
  });
});

export default model("User", UserSchema);
