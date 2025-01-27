import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import appRoutes from './routes/appRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import usuariosRoutes from './routes/usuarioRoutes.js';
import propiedadesRoutes from './routes/propiedadesRoutes.js';
import db from './config/db.js';

const app = express();
const port = process.env.PORT || 5000;

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.urlencoded({ extended: true }));
app.use( cookieParser() );
app.use(csrf({cookie: true}));
// Función para conectar a la base de datos
const connectDB = async () => {
    try {
        await db.authenticate();
        await db.sync();
        console.log('Conexión exitosa a la base de datos');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1); // Salir del proceso si hay un error de conexión
    }
};

// Llamar a la función para conectar a la base de datos
connectDB();

// Configuración del motor de plantillas
app.set('view engine', 'pug');
app.set('views', './views');

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Rutas
app.use('/', appRoutes);
app.use('/auth', usuariosRoutes);
app.use('/', propiedadesRoutes);
app.use('/api', apiRoutes);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`El servidor está funcionando en el puerto: ${port}`);
});
