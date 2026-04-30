const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  medicalHistory: String,
  fitnessLevel: { type: Number, default: 1 },
  dateJoined: { type: Date, default: Date.now },
  status: { type: String, default: 'Normal' }
});

const AttendanceSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  date: { type: String, required: true }, // YYYY-MM-DD
  status: { type: String, default: 'Present' }
});

const PaymentSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  amount: Number,
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' }
});

module.exports = {
  Member: mongoose.model('Member', MemberSchema),
  Attendance: mongoose.model('Attendance', AttendanceSchema),
  Payment: mongoose.model('Payment', PaymentSchema)
};
