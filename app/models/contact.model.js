module.exports = mongoose =>{
    const schema = mongoose.Schema(
        {
            name:{
                type: String,
                require: [true, "Contact name is require"],
            },
            email:{
                type: String,
                trim: true,
                lowercase: true,
            },
            address: String,
            phone: String,
            favorite: Boolean,
        },
        {timestamp: true}
    )

    schema.method('toJSON', function (){
        const {__v, _id, ...object} = this.toObject()
        object.id = _id
        return object
    })

    return mongoose.model('contact', schema)
}