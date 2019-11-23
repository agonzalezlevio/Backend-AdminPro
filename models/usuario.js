let moongose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');

let Schema = moongose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}


let usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos}
},
{
    versionKey: false
});


usuarioSchema.plugin(uniqueValidator, {message: ' {PATH} debe de ser único'});

module.exports = moongose.model('usuario', usuarioSchema);