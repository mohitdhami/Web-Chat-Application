import React , { useState, useEffect, useRef}  from "react";
import db from './Firebase';
import { collection, query, onSnapshot, serverTimestamp, addDoc, orderBy  } from "firebase/firestore";
import { Upload } from "upload-js";
import './App.css';
import BasicCard from './mui components/BasicCard';
import BasicButtons from './mui components/BasicButtons';
// import ComposedTextField from "./mui components/ComposedTextField";

function App(){
    const [chats, updateChats] = useState([]);
    const [admin, updateAdmin] = useState("");
    const [input,updateInput] = useState("");
    const upload = new Upload({ apiKey: "free" })
    const [fileuploadprogress, updateFileuploadProgress] = useState(0);

    //Initializing Admin Name at the Start of Application through prompt
    useEffect(()=>{
        let username = prompt("What is Your Name ?");

        // Capitalizing Username
        username = username.toLowerCase();
        username = username.charAt(0).toUpperCase() + username.slice(1);
        for(let i=1;i<username.length;i++){
            if(username.charAt(i-1) === " ")
                username = username.slice(0,i) + username.charAt(i).toUpperCase() + username.slice(i+1);
        }

        updateAdmin(username);
    },[]);

    //Fetching Realtime data from collection messages hosted at Firebase Firestore
        useEffect(()=>{
            const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
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

    //Scrollbar Automatically Scroll Down as New Elements add To chats
    const messagesEndRef = useRef(null)
    useEffect(()=>{
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }, [chats]);

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
        return (regex.test(str)) ? true : false;
    }

    //Cheching Whether The Provided File Extensions is Image or not
    function isImageExtension(ext){
        const imageExtensions = ["jpg","png","jpeg","gif"];
        for(let ie of imageExtensions)
            if(ie === ext)
                return true;
    }
    //Checking Whether The Provide File Extension is Audio or not
    function isSoundExtension(ext){
        const soundExtensions = ["mp3","ogg","amr","mpeg","wav"];
        for(let se of soundExtensions)
            if(se === ext)
                return true; 
        }

    //Function to Check Type of Media in text and Return Suitable Media( Image,Files and Chat Texts)
    function messageMedia(data){
        if(isImageExtension(data.extension) === true)
            return <img className="magnify" src={data.text} width="100" alt="Loading .."/>;
        else if(isSoundExtension(data.extension) === true )
            return <audio className="audio__z-index" controls><source src={data.text} type={("audio/"+data.extension)}/></audio>
        else if(isValidURL(data.text) === true)
            return <button><a href={data.text} target="_black" download>Download File</a></button>;
        else 
            return data.text;
    }

    return (
        <>
            <div className="header">
                <h1>Hello {admin}</h1>
            </div>

            <div className="chats__section">
                <br/><br/><br/><br/><br/>
            { //Embedding JSX by map() Function  Inside JSX Code Block 
                chats.map(
                    (data) =>{
                        return (
                            <p key={data.timestamp}>
                            <BasicCard admin={admin} username={data.username} media={messageMedia(data)}/>
                            </p> 
                        );      
                    } 
                )
            }
            {/*Below Statement is Important to Track New Elements Added to Current Div*/}
            <div ref={messagesEndRef} />
            </div>
            
            <div className="chat-box">
                <form>
                    <label>Enter Message </label><br/>
                    <input type="text"  onChange={updateInputField}/>
                    {/* <ComposedTextField/> */}
                    <button type='submit' onClick={sendMessage}>Send Message</button>
                    {/* <BasicButtons text="Send Message"/> */}
                </form>
                <input type="file" id="upload-File" onChange={onFileSelected} />
                {
                    (fileuploadprogress > 0 && fileuploadprogress !== 100) ?
                    <p>{fileuploadprogress} % Uploaded</p> : null
                }
            </div>

        </>
    );
}
export  default App;