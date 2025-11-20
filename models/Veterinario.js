import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import generarId from '../helpers/generarId.js';

const veterinarioShema = mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    password: {
        type: String,
        require: true,        
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarId()
    },
    confirmado: {
        type: Boolean,
        default: false
    }
});

//esto ejecuta el hasheo del password antes de almacenarlo en la DB
veterinarioShema.pre('save', async function (next) {//le pasamos next
    if(!this.isModified('password')) {//esto es para que un password que ya esta hasheado no lo vuelva a hash
        next();//si el password ya esta hashado entonces dice, que se valla al siguiente middleware
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//rejistramos funciones que se ejecutan solamente en este modelo con el .methods.nuestraFuncion
veterinarioShema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare( passwordFormulario, this.password );
};


const Veterinario = mongoose.model('Veterinario', veterinarioShema);
export default Veterinario;
