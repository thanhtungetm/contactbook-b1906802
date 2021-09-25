const { Contact} = require('../models')
const {BadRequestError, handle} = require('../helpers/errors')

exports.create = async (req, res, next)=>{
    //Validate req
    // console.log(req.body)
    if(!req.body.name){
        return next(new BadRequestError(400, "Name can not be empty."))
    }

    //Create a contact
    const contact = new Contact({
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        favorite: String(req.body.favorite).toLowerCase() ==="true"
    })

    //Save contact in the database
    const [error, document] = await handle(contact.save())
    if (error){
        return next(new BadRequestError(500, "An error occurred while creating the  contact"))
    }

    return res.send(document)
}

exports.findAll = async (req, res,next)=>{
    const condition = { }
    const name = req.query.name;
    if(name){
        condition.name = {
            $reqgex : new RegExp(name),
            $options: 'i'
        }
    }

    const [error, document] = await handle(Contact.find(condition))

    if(error){
        return next(new BadRequestError(500,'An error occurred while retrieving contacts'))
    }
    return res.send(document)

}

exports.findOne = async (req, res,next)=>{
    const condition = { 
        _id : req.params.id
    }

    const [error, document] = await handle(Contact.find(condition))

    if(error){
        return next(new BadRequestError(500,`An retrieving contacts with id=${req.params.id}`))
    }

    if(document.length==0){
        return next(new BadRequestError(404, 'Contact not found'))
    }

    return res.send(document)
}

exports.update = async (req, res,next)=>{

    if(Object.keys(req.body).length==0){
        return next(new BadRequestError(400, 'Data to update can not be empty'))
    }

    const condition = {
        _id : req.params.id,
    }
    const [error, document] = await handle(
        Contact.findOneAndUpdate(condition, req.body, {
            new : true,
        })
    )
    if(error){
        return next(new BadRequestError(500, `
        Error updating conatct with id=${req.params.id}`))
    }

    if(!document){
        return next(new BadRequestError(404, 'Contact not found'))
    }

    return res.send({ message : 'Contact was updated successfully'})
}

exports.delete = async (req, res,next)=>{
    const condition = {
        _id : req.params.id,
    }

    const [error, document] = await handle(
        Contact.findOneAndDelete(condition)
    )
    if(error){
        return next(new BadRequestError(500,
            `Could not delete contact with id=${req.params.id}`)) 
    }

    if(!document){
        return next(new BadRequestError(404, 'Contact not found'))
    }
    return res.send({ message: 'Contact was deleted successfully'})
}

exports.deleteAll = async (req, res, next)=>{
    const [error, data] = await handle(
        Contact.deleteMany({ })
    )

    if(error){
        return next(new BadRequestError(500,
            'An error occurred while removing all contacts')) 
    }   

    return res.send({ message: `${data.deletedCount} contacts  were deleted successfully`
    })
}

exports.findAllFavorite = async (req, res, next)=>{
    const [error, documents] = await handle(
        Contact.find({favorite:true})
    )
    if(error){
        return next(new BadRequestError(500, 'An error occurred while retrieving favorite conntacts'))
    }

    return res.send(documents)
}