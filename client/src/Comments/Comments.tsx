import React, { useState } from 'react';
import './Comments.scss';
import { CommentProps } from "../tools/photos.model";

// Toolkit
import { sendJSONData } from "../tools/Toolkit";

const SEND_SCRIPT: string = "http://localhost/addComment.php";

const Comments = ({photos, currentPhoto, refreshJSON, setLoading}:CommentProps) => {

    const updateAuthor = (e:any) => {
        setUserAuthor(e.target.value);
    };
    
    const updateComment = (e:any) => {
        setUserComment(e.target.value);
    };

    const isEmptyOrSpaces= (input:string) => {
        return !input || input.trim().length < 1;
    }
    
    const sendComment = (e:any) => {
        if (isEmptyOrSpaces(userComment)) {
            setUserAuthor("");
            setUserComment("");
            setErrorMsg(true);
            return 
        };
        setErrorMsg(false);
        let comment = {
            "photoId": photos[currentPhoto].id,
            "author": userAuthor,
            "comment": userComment
        };
        
        // converting the json to a string
        let sendString = JSON.stringify(comment);
        
        // sending the collected data to the server
        sendJSONData(SEND_SCRIPT, sendString, onSuccess, onSendError);

        setUserAuthor("");
        setUserComment("");
        setLoading(true);
    }
    
    const onSuccess = (e:any) => {
        refreshJSON();
    };

    const onSendError = (e:any) => {
        refreshJSON();
    };

    const [userComment, setUserComment] = useState<string>("");
    const [userAuthor, setUserAuthor] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<boolean>(false);

    return (
        <div className="nav--comment">
            <label>Author:</label> <br></br>
            <input className="nav--textbox" type="text" onChange={updateAuthor} value={userAuthor}></input> <br></br>
            <label>Comment (200 Characters):</label> <br></br>
            <textarea className="nav--textbox" onChange={updateComment} value={userComment} maxLength={200} rows={10} cols={25}></textarea> <br></br>
            <input className="comment--submit" type="submit" value="Submit Comment" disabled={userComment !== "" ? false : true } onClick={sendComment}/> <br></br>
            <label style={{display : (errorMsg ? "block" : "none" )}}>Please input a valid text and try again</label>
        </div>
    );
};

export default Comments;