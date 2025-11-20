import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import { emailRegistro } from "../helpers/emailRegistro.js";
import { emailOlvidePassword } from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
  const { email, nombre } = req.body;

  //prevenir usuario duplicados
  const existeUsuario = await Veterinario.findOne({ email });

  if (existeUsuario) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    //guardar un nuevo veterinario
    const veterinario = new Veterinario(req.body);
    const veterinarioGuardado = await veterinario.save(); //metodo de mongoose para crear un nuevo registro

    //enviar el email
    emailRegistro({
      email,
      nombre,
      token: veterinarioGuardado.token,
    });

    res.json(veterinarioGuardado);
  } catch (error) {
    console.log(error.message);
  }
};

const perfil = (req, res) => {
  const { veterinario } = req;

  res.json({ veterinario });
};

const confirmar = async (req, res) => {
  const token = req.params.token; //esto lo extraemos de la url del dato que estaos pasando en el routing co el :token

  const usuarioConfirmar = await Veterinario.findOne({ token });

  if (!usuarioConfirmar) {
    const error = new Error("Token no valido");
    return res.status(400).json({ msg: error.message });
  }

  try {
    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado = true;

    await usuarioConfirmar.save();

    res.json({ msg: "Usuario Confirmado Correctamente" });
  } catch (error) {
    console.log(error.message);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;
  //combromar si el usuario existe
  const usuario = await Veterinario.findOne({ email });

  if (!usuario) {
    const error = new Error("El usuario no existe!");
    return res.status(404).json({ msg: error.message });
  }

  //comprobar si el usuario esta confirmado o no
  if (!usuario.confirmado) {
    const error = new Error("El usuario no esta confirmado!");
    return res.status(403).json({ msg: error.message });
  }

  //verificar que la contraseña sea correcta
  if (await usuario.comprobarPassword(password)) {
    //autenticar
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario.id),
    });
  } else {
    const error = new Error("Credenciales no validas!");
    return res.status(403).json({ msg: error.message });
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  const existeVeterinario = await Veterinario.findOne({ email });
  if (!existeVeterinario) {
    const error = new Error("El usuario no existe!");
    return res.status(400).json({ msg: error.message });
  }

  try {
    existeVeterinario.token = generarId();
    await existeVeterinario.save();

    //enviar el email
    emailOlvidePassword({
      email,
      nombre: existeVeterinario.nombre,
      token: existeVeterinario.token,
    });

    res.json({ msg: "Hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  const token = req.params.token;
  const tokenValido = await Veterinario.findOne({ token });
  if (tokenValido) {
    //el token es valid el usuari existe
    res.json({ msg: "Token valido y el usuario existe" });
  } else {
    const error = new Error("Token no valido!");
    return res.status(400).json({ msg: error.message });
  }
};

const nuevoPassword = async (req, res) => {
  const token = req.params.token;
  const { password } = req.body;

  const veterinario = await Veterinario.findOne({ token });
  //si no existe el veterinario
  if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  //si encontramos el veterinario guardamos el nuevo password y eliminamos el token;
  try {
    veterinario.token = null;
    veterinario.password = password;
    await veterinario.save();
    res.json({ msg: "Password modificado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const actualizarPerfil = async (req, res) => {
  const veterinario = await Veterinario.findById(req.params.id);
  //si no hay un veterinario mandamos error
  if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  //verificar que el email sea unico
  const { email } = req.body;
  if (veterinario.email !== email) {
    const existeEmail = await Veterinario.findOne({ email });
    if (existeEmail) {
      const error = new Error("El email ya esta en uso");
      return res.status(400).json({ msg: error.message });
    }
  }

  //si no existe un email ya tomado lo encuentra
  try {
    veterinario.nombre = req.body.nombre || veterinario.nombre;
    veterinario.email = req.body.email || veterinario.email;
    veterinario.web = req.body.web;
    veterinario.telefono = req.body.telefono;

    const veterinarioActualizado = await veterinario.save();
    res.json(veterinarioActualizado);
  } catch (error) {
    console.log(error);
  }
};

const actualizarPassword = async (req, res) => {
  //leer los datos
  const { id } = req.veterinario;
  const { pwd_actual, pwd_nuevo } = req.body.password;
  //comprobar que el veterinario exista
  const veterinario = await Veterinario.findById(id);
  if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }
  //comprobar el password
  if (await veterinario.comprobarPassword(pwd_actual)) {
    //almacenar el nuevo password
    veterinario.password = pwd_nuevo;
    await veterinario.save();
    res.json({ msg: 'Password Almacenado correctamente', error: false });
  } else {
    const error = new Error("El password actual es incorrecto");
    return res.status(400).json({ msg: error.message });
  }
};

export {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword,
};
