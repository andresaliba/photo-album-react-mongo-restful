import React from 'react';
import './Jump.scss';
import { JumpProps, Photo } from "../tools/photos.model";


const Jump = ({photos, setCurrentPhoto}:JumpProps) => {

    const changePhoto = (e:any) => {
        setCurrentPhoto(Number(e.target.id));
        console.log(Number(e.target.id));
    }

    return (
        <div className="nav--jump">
            {photos.map((photos:Photo, index:number) => (
                <div className="jump--thumbnails" >
                    <img className="thumbnail--photo" src={"/images/photos/" + photos.source}  id={index.toString()} onClick={changePhoto}></img>
                </div>
            ))}
        </div>
    );
};

export default Jump;