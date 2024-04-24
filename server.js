const express = require("express");
const app = express();
const axios = require("axios");
const fs = require("fs");
const { Console } = require("console");

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
  return /^[a-zA-Z ]+$/.test(nombre);
}
function validarPrecio(precio) {
  return /^[0-9]+$/.test(precio);
}

//RUTA PARA AGREGAR USUARIO
// app.get("/agregar", (req, res) => { ... }): Define una ruta en el servidor Express para manejar solicitudes GET en la ruta "/agregar".
app.get("/agregar", async (req, res) => {
  // const { nombre, precio } = req.query: Extrae los parámetros de consulta "nombre" y "precio" de la URL de la solicitud GET y los guarda en variables separadas llamadas "nombre" y "precio".
  const { nombre, precio } = req.query;
  if (nombre === "" || precio === "") {
    return res.send("No puedes dejar los campos vacios");
  }

  if (!validarNombre(nombre)) {
    return res.send("No puedes ingresar números en el campo Nombre");
  }

  if (!validarPrecio(precio)) {
    return res.send("No puedes ingresar letras en el campo Precio");
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

    let deportes = data.deportes;

    // Iterar sobre cada objeto de deporte en el arreglo
    let busqueda = deportes.filter((elem) => elem.nombre.includes(nombre)).map((elem) => elem.nombre);


    // let busqueda1 = deportes.filter((elem) => elem.nombre == nombre);
    // const result = deportes.filter((nombre) => nombre == nombre);
    console.log("Índice de la búsqueda:", busqueda);

    // console.log("Índice de la búsqueda elemt:", elem);
    // console.log("resultado:", result);
    if (busqueda == nombre) {
      return res.send("El deporte con nombre: " + busqueda + " ya existe");
    } else {
    // deportes.push(deporte);: Agrega el objeto "deporte" al arreglo "deportes".
    deportes.push(deporte);
        // fs.writeFileSync("deportes.json", JSON.stringify(data)): Convierte el objeto "data" a formato JSON y escribe el contenido en el archivo "deportes.json", sobrescribiendo su contenido anterior de manera síncrona.
        fs.writeFileSync("deportes.json", JSON.stringify(data));
    
        // res.send("deporte almacenado con éxito");: Envía una respuesta al cliente indicando que el deporte ha sido almacenado con éxito.
        return res.send("Deporte almacenado con éxito");
        return res.send({
          status: 200,
          error: "false",
          msg: "Usuario almacenado con éxito",
          datos: deporte,
        });

        console.log("El deporteeeeeeeee :", busqueda, " se agregó");
        // return res.json("El deporte :"+ busqueda + " se agregó"); // Devuelve el deporte encontrado
        return res.send("El deporteeeeeeee :"+ busqueda + " se agregó"); // Devuelve el deporte encontrado
    }

    // const deportes = data.deportes;: Guarda el arreglo de deportes del objeto "data" en una variable llamada "deportes".
    // console.log("el resultado de la búsqueda : ", busqueda);




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
    const data = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
    let deportes = data.deportes;

    // Iterar sobre cada objeto de deporte en el arreglo
    let busqueda = deportes.findIndex((elem) => elem.nombre == nombre);
    console.log("Índice de la búsqueda:", busqueda);

    if (busqueda == -1) {
      return res.send("El deporte con nombre: " + nombre + " no existe");
    } else {
      console.log("El deporte es:", deportes[busqueda]);
      return res.json(deportes[busqueda]); // Devuelve el deporte encontrado
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Algo salió mal...");
  }
});

//RUTA PARA MODIFICAR DEPORTES
app.get("/modificar/:precio", async (req, res) => {
  try {
    const precio = req.params.precio;
    console.log("valor input", precio);
    const data = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
    let precios = data.deportes;
    console.log("acá que pasa: ", precios);
    const busquedaPrecio = precios.find((d) => d.precio == precio);
    console.log("acá se regleja", busquedaPrecio);

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
