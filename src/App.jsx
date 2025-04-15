 
 import React, {useState} from "react";

 import { Button } from "@mui/material";

  // here i will import progess component;
    

  const App = () => {
    return (
      <div>
        <FileUpload />
      </div>
    )
  }


  const FileUpload = () => {
    const [selectedFile, setSelectFile ] = useState(null);
    const [status, setStatus] = useState('');
    const [progress, setProgress] = useState(0);

      const handleFileChange = (event) => {
        const file = event.target.files[0];
             setSelectFile(file)
      };
      const handleFileUpload = () => {
        

       if (!selectedFile) {
           alert('sir pls selecte the file to upload');
            return
          }
          const chunkSize = 2 * 1024 * 1024;
          const totalChunks = Math.ceil(selectedFile.size / chunkSize);
          const chunkProgress = 100/ totalChunks;
           let chunkNumber = 0;
           let start = 0;
           let end = chunkSize;
         
         const uploadNextChunk = async () => {
               if (end <= selectedFile.size){
                const chunk = selectedFile.slice(start, end);
                const formData = new FormData();
                formData.append("file", chunk);
                formData.append("chunkNumber", chunkNumber);
                formData.append("totalChunks", totalChunks);
                formData.append("originalname", selectedFile.name);


                fetch("http://localhost:3000/upload", {
                  method: "POST",
                  body: formData
                })
                 .then((response) => response.json())
                 .then((data) => {
                   console.log({ data});
                   const temp = `chunk ${chunkNumber + 1}/${totalChunks} upload successfully`;
                   setStatus(temp);
                   end = start + chunkSize;
                   setProgress(Number(( chunkNumber + 1) * chunkProgress));
                   console.log(temp);
                    chunkNumber++;
                     start = end;
                     uploadNextChunk();
                 })
                 .catch((err) => {
                   console.error("Error uploading chunk::", err);
                 })
               }

               else {
                   setProgress(100);
                   setSelectFile(null);
                   setStatus("File uploaded successfully");
               }
              
          };
          uploadNextChunk();
      }     
      
  
                 return (
                  <div>
                    <h2>Resumable File upload</h2>
                    <h3>
                      {status}
                    </h3>
                    <input type = "file" onChange={handleFileChange} />
                    {progress? <progress value={progress} />: <progress value={0} /> }    
                    <Button onClick={handleFileUpload}>Upload File</Button>
                  </div>
                 );
  };



 
 export default App;