import mongoose from 'mongoose';

const BadgeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    rule: { type: String, required: true },
    icon: { type: String, required: true }
});

export default mongoose.models.Badge || mongoose.model('Badge', BadgeSchema);
