import mongoose from "mongoose";

const { Schema } = mongoose;

const testimonialSchema = new Schema({
    firstName: { type: String},
    lastName: { type: String },
    email: { type: String, required: true },
    file: { type: String, required: true },
    message: { type: String, required: true },
}, {timestamps: true});

testimonialSchema.pre("save", function(next) {
    if(!this.firstName){
        this.firstName = "John"
    }

    if(!this.lastName) {
        this.lastName = "Doe"
    }
    
    next();
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export default Testimonial;