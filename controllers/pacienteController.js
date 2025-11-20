import Paciente from "../models/Pacientes.js";

const agregagrPaciente = async (req, res) => {
  //sacamos el _id del body porque si no, la respuesta enviada al frontend sera un _id null que es el que viene en el body
  //al sacarlo del body entonces moongose dice: okey no viene un _id entonces lo voy a crear y lo envia aunque en el 
  //backend si se estaba gaurdando correctamente el _id
  const { _id, ...data } = req.body;
  const paciente = new Paciente(data);
  paciente.veterinario = req.veterinario._id;
  try {
    const pacienteGuardado = await paciente.save();
    res.json({ pacienteGuardado });
  } catch (error) {
    console.log(error);
  }
};

const obtenerPacientes = async (req, res) => {
  const pacientes = await Paciente.find().where({
    veterinario: req.veterinario,
  }); //hace referencia a _id de veterinario
  res.json({ pacientes });
};

const obtenerPaciente = async (req, res) => {
  const id = req.params.id;
  const paciente = await Paciente.findById(id);

  if (!paciente) {
    return res.status(404).json({ msg: "Paciente no encontrado" });
  }

  //cuando comparo 2 id de MongoDb convertirlo a string para poder compararlos
  if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
    return res.json({ msg: "Accion no valida" });
  }

  res.json({ paciente });
};

const actualizarPaciente = async (req, res) => {
  const id = req.params.id;
  const paciente = await Paciente.findById(id);

  if (!paciente) {
    return res.status(404).json({ msg: "Paciente no encontrado" });
  }

  //cuando comparo 2 id de MongoDb convertirlo a string para poder compararlos
  if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
    return res.json({ msg: "Accion no valida" });
  }

  //actualizar paciente
  paciente.nombre = req.body.nombre || paciente.nombre;
  paciente.propietario = req.body.propietario || paciente.propietario;
  paciente.email = req.body.email || paciente.email;
  paciente.fecha = req.body.fecha || paciente.fecha;
  paciente.sintomas = req.body.sintomas || paciente.sintomas;
  try {
    const pacienteActulizado = await paciente.save();

    res.json({ pacienteActulizado });
  } catch (error) {
    const e = new Error("Error al guardar");
    return res.status(403).json({ msg: e.message });
  }
};

const eliminarPaciente = async (req, res) => {
  const { id } = req.params;
  const paciente = await Paciente.findById(id);

  if (!paciente) {
    return res.status(404).json({ msg: "Paciente no encontrado" });
  }

  //cuando comparo 2 id de MongoDb convertirlo a string para poder compararlos
  if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
    return res.json({ msg: "Accion no valida" });
  }

  try {
    await paciente.deleteOne();
    res.json({ msg: "Paciente eliminado" });
  } catch (error) {
    console.log(error);
  }
};

export {
  agregagrPaciente,
  obtenerPacientes,
  obtenerPaciente,
  actualizarPaciente,
  eliminarPaciente,
};
