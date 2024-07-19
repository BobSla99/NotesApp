const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const Note = require("./models/note");
const contact = require("../phonebookBackend/models/contact");

const app = express();
// Note.find({}).then((r) => console.log("co",JSON.stringify(r)));

const errorBody = { error: "Content can't be empty,undefine or null" };
let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: true,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: false,
  },
  {
    id: "22f4",
    content: "a new note...adsf",
    important: false,
  },
  {
    id: "506a",
    content: "asdfg",
    important: true,
  },
  {
    id: "9b9f",
    content: "a new note...",
    important: false,
  },
  {
    id: "2855",
    content: "a new note...af",
    important: false,
  },
  {
    id: "7bee",
    content: "altor",
    important: false,
  },
  {
    id: "d572",
    content: "asdf",
    important: true,
  },
  {
    id: "e66d",
    content: "poii",
    important: true,
  },
  {
    id: "4f26",
    content: "pedro",
    important: true,
  },
  {
    id: "6aac",
    content: "a new note...adsf",
    important: false,
  },
  {
    id: "0f49",
    content: "Esto es un nota nueva",
    important: true,
  },
];

//Declarando middlewares y configurando
const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

const unKnowEndPoint = (req, res) => {
  res.status(404).json({ error: "unknow Endpoint" });
};
morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

//Usando los middlewares.
app.use(express.static("dist"));
app.use(cors());
app.use(express.json());
app.use(morgan(":method :url :res[content-length] :response-time ms :body"));

//Routes
//GET
//Info sobre el server
app.get("/", (req, res) => res.send("<h1>Servidor de notas</h1>"));

//Todas las notas
app.get("/api/notes", (req, res, next) => {
  Note.find({})
    .then((contacts) => res.json(contacts))
    .catch((err) => next(err));
});

//Obtener una nota de la bd.
app.get("/api/notes/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((contact) => {
      if (!contact) {
        res.status(404).json({ error: "the resource could not be found" });
      } else {
        res.status(200).json(contact);
      }
    })
    .catch((err) => {
      // res.status(400).json({error:"malformatedd id"});
      // console.log(err)
      //pasando el error al proximo handler
      next(err);
    });
});

//POST
app.post("/api/notes", (req, res, next) => {
  const body = req.body;

  const newNote = new Note({
    content: body.content,
    important: body.important || false,
  });
  newNote
    .save()
    .then((noteReturned) => {
      // console.log("note guardada es :", noteReturned);
      res.status(201).json(newNote);
    })
    .catch((err) => next(err));
});

//PUT
app.put("/api/notes/:id", (req, res, next) => {
  let id = req.params.id.toString();

  const body = req.body;
  if (!validBody(body)) res.status(400).json(errorBody);
  Note.findByIdAndUpdate(
    id,
    {
      content: body.content,
      important: body.important || false,
    },
    { new: true }
  )
    .then((noteChanged) => {
      console.log(noteChanged);
      if (!noteChanged) {
        res.status(404).json({ error: "The resource could not be found" });
      } else {
        res.status(201).json(noteChanged);
      }
    })
    .catch((err) => next(err));
});

//PATCH
app.patch("/api/notes/:id", (req, res, next) => {
  let id = req.params.id;
  const body = req.body;
  if (!validBody(body)) res.status(400).json(errorBody);

  Note.findByIdAndUpdate(id, body, { new: true })
    .then((re) => {
      res.json(re);
    })
    .catch((err) => {
      // console.log("resource could not be found!", err);
      // res.status(404).json({ error: "the resource could not be found" });
      next(err);
    });
});

//DELETE
app.delete("/api/notes/:id", (req, res, next) => {
  const id = req.params.id;
  Note.findByIdAndDelete(id)
    .then((noteDeleted) => {
      if (!noteDeleted) {
        res.status(404).json({ error: "the resource could not be found" });
      } else {
        //convencion1 204 no content or {}
        res.status(204).end();
        //convencion2 200  dataErased
        // res.status(200).json(noteDeleted);
      }
    })
    .catch((err) => next(err));
});

// app.use(express.json)
app.use(unKnowEndPoint);

app.use(errorHandler);

const validBody = (body) => {
  if (!body || Object.keys(body).length === 0) {
    return false;
  } else {
    return true;
  }
};

const PORT = 3001;

app.listen(PORT, () => {
  console.log("Escuchando en el puerto 3001");
});
