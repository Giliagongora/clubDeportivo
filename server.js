const express = require("express");
const app = express();
const axios = require("axios");
const fs = require("fs");

// app.get("/deportes", (req, res) => {
//     // Definir y asignar la variable deportes
//     const deportes = deportes(); // Por ejemplo, obtener los datos de alguna fuente

//     // Enviar los datos de deportes como respuesta
//     res.json(deportes);
// });

// app.get("/deportes", (req, res) => {
//     // res para enviar el archivo index.html al cliente -__dirname es una variable global en Node.js que contiene la ruta del directorio en el que se encuentra el script actual.
//     res.sendFile(__dirname + "/index.html");
//   });

// app.get("/") indica que estamos creando una ruta de tipo GET (solicitud para obtener datos) en la raíz del servidor
// (req, res) función de devolución de llamada (callback) que se ejecutará cuando se reciba una solicitud GET
app.get("/", (req, res) => {
  // res para enviar el archivo index.html al cliente -__dirname es una variable global en Node.js que contiene la ruta del directorio en el que se encuentra el script actual.
  res.sendFile(__dirname + "/index.html");
});

function validarNombre(nombre) {
  return /^[a-zA-Z]+$/.test(nombre);
}
function validarPrecio(precio) {
  return /^[0-9]+$/.test(precio);
}

//RUTA PARA AGREGAR USUARIO
// app.get("/agregar", (req, res) => { ... }): Define una ruta en el servidor Express para manejar solicitudes GET en la ruta "/agregar".
app.get("/agregar", async (req, res) => {
  // const { nombre, precio } = req.query: Extrae los parámetros de consulta "nombre" y "precio" de la URL de la solicitud GET y los guarda en variables separadas llamadas "nombre" y "precio".
  const { nombre, precio } = req.query;
  if (!validarNombre(nombre)) {
    return res.status(400).json({ error: "El nombre no es válido" });
  }

  if (!validarNombre(precio)) {
    return res.status(400).json({ error: "El precio no es válido" });
  }

  // const deporte = { nombre, precio }: Crea un objeto llamado "deporte" con las propiedades "nombre" y "precio" obtenidas de los parámetros de consulta.
  const deporte = {
    nombre,
    precio,
  };
  // next();
  try {
    // const data = JSON.parse(fs.readFileSync("deportes.json", "utf8")): Lee el contenido del archivo "deportes.json" de manera síncrona y lo convierte en un objeto JavaScript utilizando JSON.parse. Esto guarda el contenido del archivo en la variable "data".
    const data = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
    // if (!data.deportes) { ... }: Verifica si la propiedad "deportes" no está definida en el objeto "data". Si es así, inicializa "deportes" como un arreglo vacío.
    if (!data.deportes) {
      data.deportes = [];
      // Inicializar 'deportes' como un array vacío si es undefined
    }
    // const deportes = data.deportes;: Guarda el arreglo de deportes del objeto "data" en una variable llamada "deportes".
    const deportes = data.deportes;
    // deportes.push(deporte);: Agrega el objeto "deporte" al arreglo "deportes".
    deportes.push(deporte);
    // fs.writeFileSync("deportes.json", JSON.stringify(data)): Convierte el objeto "data" a formato JSON y escribe el contenido en el archivo "deportes.json", sobrescribiendo su contenido anterior de manera síncrona.
    fs.writeFileSync("deportes.json", JSON.stringify(data));
    console.log(data);
    // res.send("deporte almacenado con éxito");: Envía una respuesta al cliente indicando que el deporte ha sido almacenado con éxito.
    return res.send("Deporte almacenado con éxito");
    return res.send({
      status: 200,
      error: "false",
      msg: "Usuario almacenado con éxito",
      datos: deporte,
    });
  } catch (error) {
    res.status(500).send("Algo salió mal...");
  }
});

//RUTA PARA VISUALIZAR DEPORTES TODOS

app.get("/deportes", async (req, res) => {
  try {
    let data = await fs.readFileSync("deportes.json", "utf8");
    // res.send(data);
    return res.send(JSON.parse(data));
  } catch (error) {
    res.status(500).send("Algo salió mal...");
  }
});

//RUTA PARA VISUALIZAR DEPORTES uno
app.get("/deporte/:nombre", async (req, res) => {
  try {
    let nombre = req.params.nombre; 
    console.log(nombre);
    const data = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
    // console.log(data);
    let deportes = data.deportes;
    console.log("valor de deporrtes  :" + deportes[0])
    let busqueda = deportes.findIndex((elem) => elem.nombre == deportes); 

    if (busqueda == -1) {
      console.log("El usuario con nombre: " + nombre + " no existe"); 
      return res.send("El usuario buscado no existe");
    } else {
      console.log("El usuario es: ", usuarios[busqueda]);
      res.send(usuarios[busqueda]); // Devuelve el usuario encontrado
    }
    console.log("El usuario es: ", usuarios[busqueda]);
    res.send(usuarios[busqueda]); // Devuelve el usuario encontrado

    res.send("busqueda finalizada");
  } catch (error) {
    res.status(500).send("Algo salió mal...");
  }
});

//RUTA PARA MODIFICAR DEPORTES
app.get("/modificar/:precio", async (req, res) => {
  const precio = req.params.precio;
  console.log(precio);
  try {
    const data = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
    const deporte = data.deportes.find((d) => d.precio === precio);
    console.log(deporte);
    if (deporte) {
      res.send(deporte);
    } else {
      res.status(404).send("Deporte no encontrado");
    }
  } catch (error) {
    res.status(500).send("Algo salió mal...");
  }
});

//RUTA PARA ELIMINAR DEPORTES
app.get("/eliminar/:nombre", async (req, res) => {
  try {
    const nombre = req.params.nombre;
    // console.log("nombre", nombre);

    const data = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
    // console.log("valor de data: ", data);

    const deportes = data.deportes;
    console.log("deportes: ", deportes);

    let busqueda = deportes.findIndex((elem) => elem.nombre == nombre);

    if (busqueda == -1) {
      console.log("El deporte " + nombre + " no existe");
      return res.send("El deporte buscado no existe");
    } else {
      console.log("El deporte a eliminar es: ", deportes[busqueda]);
      deportes.splice(busqueda, 1);
      fs.writeFileSync("deportes.json", JSON.stringify(data));
    }

    res.send("Eliminación finalizada");
  } catch (error) {
    res.status(500).send("Algo salió mal...");
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});
