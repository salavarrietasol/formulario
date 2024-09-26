const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Configurar multer para manejar la subida de archivos
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/'); // Guardar en la carpeta 'uploads'
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Guardar con un nombre único
  }
});
const upload = multer({ storage: storage });

// Configurar body-parser para procesar datos de formulario
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Servir la carpeta 'uploads' de forma pública para acceder a las fotos
app.use('/uploads', express.static('uploads'));

// Ruta para manejar el envío del formulario
app.post('/submit', upload.single('photo'), (req, res) => {
  const { name, email } = req.body;
  const photo = req.file;

  // Crear un objeto con la información enviada
  const userData = {
    name,
    email,
    photo: photo ? photo.filename : 'No photo uploaded'
  };

  // Leer el archivo JSON existente (o crear uno nuevo si no existe)
  const filePath = path.join(__dirname, 'data.json');
  let data = [];
  
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  // Agregar la nueva información
  data.push(userData);

  // Guardar la información en el archivo JSON
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

 // Enviar una respuesta al cliente (navegador)
res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Gracias</title>
      <link rel="stylesheet" href="/styles.css"> <!-- Archivo CSS -->
    </head>
    <body>
      <div class="mensaje-gracias">
        <h1>¡Gracias por participar!</h1>
        <p>Si esto fuera un ataque real de phishing, tu información y foto estarían en manos de alguien más.</p>
      </div>
    </body>
    </html>
  `);
  
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

