import mongoose from 'mongoose';

const discordSchema = mongoose.Schema({
    channelName : String,
    conversation: [
        {
            message: String,
            timestamp: String,
            users:{
                displayName: String,
                email: String,
                photo: String,
                uid: String
            }
        }
    ]
})

export default mongoose.model('conversation', discordSchema);