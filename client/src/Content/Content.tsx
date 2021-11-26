import React, { useState } from 'react';
import "./Content.scss";
import { PhotoProps, Photo, Comment } from "../tools/photos.model";

const Content = ({id,title,caption,source,comments}:PhotoProps) => {

    // const [path, setPath] = useState<string>(`"/photos + {source}`);

    // return to dOM
    return (
        <div className="Content">
            <div>
                <img className="content--photo" id="imgPhoto" src={"/images/photos/" + source} ></img>
                <div className="content--title" id="lblTitle">{title}</div>
                <div className="content--caption" id="lblCaption">{caption}</div>
                {comments.map((word:Comment, i:number) => ( 
                    <div key={i} className="content--comments">
                        <div className="content--author" id="lblAuthor">Submitted by: {word.author}</div>
                        <div className="content--comment" id="lblComment">{word.comment}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Content;