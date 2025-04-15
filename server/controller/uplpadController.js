import multer from  'multer';
import fs from 'fs';
import { error } from 'console';
import  { fileURLToPath} from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)



const storage = multer.memoryStorage();
export const upload = multer({ storage: storage});


export const uploadFile = async (req,res) =>{

     const chunk = req.file.buffer;
     const chunkNumber = Number(req.body.chunkNumber);
     const totalChunks = Number(req.body.totalChunks);
     const fileName = req.body.originalname;

     const chunkDir = __dirname + "/chunks";

     if(!fs.existsSync(chunkDir)) {
        fs.mkdirSync(chunkDir)
     }

     const chunkFilePath =`${chunkDir}/${fileName}.part_${chunkNumber}`;


     async function mergeChunks (fileName, totalChunks){
          const chunkDir = __dirname + "/chunks";
          const mergedFilePath = __dirname + "/merged_files";

            if(!fs.existsSync(mergedFilePath)) {
                 fs.mkdirSync(mergedFilePath)
            }


            const writeStream = fs.createWriteStream(`${mergedFilePath}/${fileName}`);
              for(let i =0; i < totalChunks; i++) {
                const chunkFilePath = `${chunkDir}/${fileName}.part_${i}`;
                const chunkBuffer = await fs.promises.readFile(chunkFilePath);
                 writeStream.write(chunkBuffer);
                  fs.unlinkSync(chunkFilePath);
              }
              
                 writeStream.end();
                 console.log("chunk merged sucessfully");
        }
        try{
             await fs.promises.writeFile(chunkFilePath, chunk);
             console.log(`chunk ${chunkNumber}/${totalChunks} saved`);

               if (chunkNumber === totalChunks -1) {
                // here we merge all chunk, if the chunk is last
                   await mergeChunks(fileName, totalChunks);
                     console.log("File merged succesfully")
               }

                 res.status(200).json({
                     message: "chunk uploadede successfully"
                 })
        }
          catch(err) {
            console.error("Error saving chunk:", err);
            res.status(500).json({ error: "Error saving chunk"})
            }
}