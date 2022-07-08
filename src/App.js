import React , { useState, useEffect}  from "react";
import db from './Firebase';
import { collection, query, onSnapshot, serverTimestamp, addDoc, orderBy  } from "firebase/firestore";
import { Upload } from "upload-js";
import './App.css';

function App(){
    const [chats, updateChats] = useState([]);
    const [admin, updateAdmin] = useState("");
    const [input,updateInput] = useState("");
    const upload = new Upload({ apiKey: "free" })
    const [fileuploadprogress, updateFileuploadProgress] = useState(0);

    //Initializing Admin Name at the Start of Application through prompt
    useEffect(()=>{
        updateAdmin(prompt("What is Your Name ?"))
    },[]);

    //Fetching Realtime data from collection messages hosted at Firebase Firestore
        useEffect(()=>{
            const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
            onSnapshot(q, (querySnapshot) => {
                let temp = [];
                querySnapshot.forEach((doc) => {
                    temp.push(doc.data())
                    updateChats(temp)
                    updateChats(temp);
                });
            });
        },[])
        
    //Appending New Messages to List chats via updateChats
    const sendMessage = (e) =>{
        e.preventDefault();
        console.log(chats);
        if(input){
            //Local Updating chat to chats State
            updateChats([...chats, {username: admin,text: input }]);

            //Updating new Chat Details to Realtime Firebase Firestore Database
            async function updateFFDatabase(){
                await addDoc(collection(db, "messages"), {
                    text: input,
                    username: admin,
                    timestamp: serverTimestamp()
                  });
            }
            updateFFDatabase();

            //Resetting input value to Empty String 
            updateInput('');
        }
    }

    //Keep Updating input via updateInput on Every change Occur in InputField
    const updateInputField = e => {
        updateInput(e.target.value);
     }

      //Appending New Media Messages to List chats via updateChats and fileUrl
    const sendMediaInfo = (fileUrl) =>{
        if(fileUrl){
            
            //Extracting File-Format(Extension) of File to be Uploaded from filePath String 
            var fileInput = document.getElementById('upload-File');
            var filePath = fileInput.value;
            var re = /(?:\.([^.]+))?$/;
            var ext = re.exec(filePath)[1];
            ext = ext.toLowerCase(); 

            //Local Updating chat to chats State
            updateChats([...chats, {username: admin,text: fileUrl }]);

            //Updating new Chat Details to Realtime Firebase Firestore Database
            async function updateFFDatabase(){
                await addDoc(collection(db, "messages"), {
                    text: fileUrl,
                    username: admin,
                    timestamp: serverTimestamp(),
                    caption: "File",
                    extension: ext,
                  });
            }
            updateFFDatabase();
        }
    }

    //  Uploading Local Selected File to Upload.io Free Server  (Using upload-js)
    //  File Size Limit : 5 MB,  File Host Limit : 4 Hrs
    async function onFileSelected(event) {
        const [ file ]    = event.target.files;
        const { fileUrl } = await upload.uploadFile({
            file,
            onProgress: ({ progress }) => updateFileuploadProgress(progress)
        });
        sendMediaInfo(fileUrl);
      }

    //Checks if a string is a Link or Not
    function isValidURL(str) {
        var regex = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
        return (regex .test(str)) ? true : false;
    }

    return (
        <>
            <h1>Hello {admin}</h1>
            <form>
                <label>Enter Message </label><br/>
                <input type="text"  onChange={updateInputField}/>
                <button type='submit' onClick={sendMessage}>Send Message</button>
            </form>
         
            { //Embedding JSX by map() Function  Inside JSX Code Block
                chats.map(
                    (data) =>{
                        return <p key={data.timestamp}>{data.username} : 
                        {isValidURL(data.text)?
                         (data.caption +" : "+ data.text) : 
                        data.text}</p>
                    } 
                )
            }

            <div className="fixed__fileMedia">
                <input type="file" id="upload-File" onChange={onFileSelected} />
                {
                    (fileuploadprogress>0 && fileuploadprogress !== 100) ?
                    <p>{fileuploadprogress}% Uploaded</p> : null
                 }
            </div>
        </>

    );
}

export  default App;