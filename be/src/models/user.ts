import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    hashPassword: {
        type: String,
        required: true
    },
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project',
        default: []
    }]
})

const User = mongoose.model('User', userSchema)

export default User