const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'static')));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'paginas', 'index.html'));
});

// Rutas para las otras páginas
app.get('/dulces.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'paginas', 'dulces.html'));
});

app.get('/salados.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'paginas', 'salados.html'));
});

app.get('/contactanos.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'paginas', 'contactanos.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});