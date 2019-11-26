const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let hospitalSchema = new Schema({
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'usuario' }
}, {
    collection: 'hospitales', versionKey: false
});


module.exports = mongoose.model('hospital', hospitalSchema);