import express from 'express';
import { connectDb } from './dataBase/connectDb.js';
import bodyParser from  'body-parser'
import cors from 'cors' ;
import { upload, uploadFile } from './controller/uplpadController.js';

const app = express();


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false}))
app.use(express.json());


const PORT = 3000;
 
app.post("/upload", upload.single("file"), uploadFile)


app.listen(PORT, connectDb(),(err)=> {
     if(err){
        console.log(`serevr is doesnt started`);
     }
     else{
        console.log(`server is listening on ${PORT}`)
     }
});



