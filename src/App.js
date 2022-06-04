import React , { useState, useEffect}  from "react";
import db from './Firebase';
import { collection, query, onSnapshot, serverTimestamp, addDoc  } from "firebase/firestore";
import { Upload } from "upload-js";

function App(){
    const [chats, updateChats] = useState([]);
    const [admin, updateAdmin] = useState("");
    const [input,updateInput] = useState("");
    const upload = new Upload({ apiKey: "free" })

    //Initializing Admin Name at the Start of Application through prompt
    useEffect(()=>{
        updateAdmin(prompt("What is Your Name ?"))
    },[]);

    //Fetching Realtime data from collection messages hosted at Firebase Firestore
        useEffect(()=>{
            const q = query(collection(db, "messages"));
            onSnapshot(q, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let temp = chats;
                    temp.push(doc.data())
                    updateChats(temp)
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
            //Local Updating chat to chats State
            updateChats([...chats, {username: admin,text: fileUrl }]);

            //Updating new Chat Details to Realtime Firebase Firestore Database
            async function updateFFDatabase(){
                await addDoc(collection(db, "messages"), {
                    text: fileUrl,
                    username: admin,
                    timestamp: serverTimestamp(),
                    caption: "File"
                  });
            }
            updateFFDatabase();
        }
    }

     //Uploading Local Selected File to Upload.io Free Server  (Using upload-js), Limit : 5 MB
    async function onFileSelected(event) {
        const [ file ]    = event.target.files;
        const { fileUrl } = await upload.uploadFile({file});
        console.log(`File uploaded! ${fileUrl}`);
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

            <br/><h2>Select File to Upload</h2>
            <input type="file" onChange={onFileSelected} />
        </>

    );
}

export  default App;