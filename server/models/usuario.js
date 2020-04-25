const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos ={
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un valor válido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email:{
        type:String,
        unique:true,
        require: [true, 'El email es necesario']
        
    },
    password:{
        type:String,
        require: [true, 'La contraseña es obligatoria']
    },
    img:{
        type:String,
        required:false
    },
    role:{
        type:String,
        default:'USER_ROLE',
        enum: rolesValidos
    },
    estado:{
        type:Boolean,
        default: true
    },
    google:{
        type:String,
        default: false
    },
});

usuarioSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe de eser único'});

module.exports = mongoose.model('Usuario', usuarioSchema);
