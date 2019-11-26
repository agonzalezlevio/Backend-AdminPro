const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let medicoSchema =	new Schema({
				nombre: {	type: String,	required: [true,	'El	nombre	es	necesario']	},
				img: {	type: String,	required: false },
				usuario: {	type: Schema.Types.ObjectId,	ref: 'usuario',	required: true },
				hospital: {	type: Schema.Types.ObjectId,	ref: 'hospital',	required: [true,	'El	id	hospital	es	un	campo	obligatorio']	}
}, 
{
	versionKey: false
});

module.exports = mongoose.model('medico', medicoSchema);