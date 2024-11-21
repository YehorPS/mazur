import mongoose from 'mongoose'


const postSchema = new mongoose.Schema({
    rank: { type: String, required: true },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    exercise3: { type: String, required: true },
    exercise14: { type: String, required: true },
    exercise20: { type: String, required: true },
    exercise25: { type: String, required: true }
  }, { versionKey: false });
export default postSchema