import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";

//estos son middlewares
const app = express();
app.use(express.json()); //decirle a express que le enviaremos datos de tipo json para enviar formularios
dotenv.config(); // nos permite usar variables de entorno

conectarDB();

// const dominiosPermitidos = [process.env.FRONTEND_URL];

const dominiosPermitidos = [
  process.env.FRONTEND_URL,
  "https://apv-frontend-veterinaria-mern.netlify.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || dominiosPermitidos.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use("/api/veterinarios", veterinarioRoutes);
app.use("/api/pacientes", pacienteRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto: ${PORT}`);
});
