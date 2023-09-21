const mongoose = require("mongoose")
const Schema = mongoose.Schema

const AccountModel = new Schema({
  nickname: { type: String, required: true, index: {unique: true} },
  firstName: { type: String },
  lastName: { type: String },
  timestamp: { type: Number, required: true },
  meta: { type: Object, default: {} },
})

const Account =
  mongoose.models.Account || mongoose.model("Account", AccountModel)

export { Account }


