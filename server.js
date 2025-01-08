// import express and body-parser
import express from "express";
import bodyParser from "body-parser";
import { getAll,getById,create,updateById,deleteById } from "./store.js";
// initiate the server using express
const app = express();
// add the static files
app.use(express.static("public"));

// use the body parser middleware
app.use(bodyParser.json());

app.set('view engine','ejs')

app.get('/about', async (req, res) => {
  const whispers = await getAll()
  res.render('about', { whispers })
})



// send all the whispers
app.get("/api/v1/whisper/", async (req, res) => {
  const data = await getAll()
  res.json(data);
});
// send the request by id
app.get("/api/v1/whisper/:id",async (req, res) => {
  const id = parseInt(req.params.id);
  const data = await getById(id)
  if(!data){
    res.sendStatus(404)
  }else{
    res.json(data)
  }
});

// recieve a whisper
app.post("/api/v1/whisper", async (req, res) => {
  const message = req.body.message
  if (!message){
    res.sendStatus(400)
  }else {
    const whisper = await create(message)
    res.status(201).json(whisper)
  }
});

// update a whisper
app.put("/api/v1/whisper/:id", async (req, res) => {
   const id =  parseInt(req.params.id)
   const {message} =req.body
   if(!message){
    res.sendStatus(400)
   }else{
    const whisper = await getById(id)
    if(!whisper){
      res.sendStatus(404)
    }else{
      await updateById(id,message)
      res.sendStatus(200)
    }
   }
});

// delete a whisper
app.delete("/api/v1/whisper/:id", async (req, res) => {
  const id = parseInt(req.params.id)
  const whisper = await getById(id)
  if(!whisper){
    res.sendStatus(404)
    return
  }
  await deleteById(id);
  res.sendStatus(200);
});
export { app };

