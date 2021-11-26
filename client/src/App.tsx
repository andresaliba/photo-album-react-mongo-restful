
// React
import React from 'react';

// Hooks
import { useState, useEffect, useRef } from 'react';

// Stylesheet
import "./App.scss";

// Toolkit
import { getJSONData } from "./tools/Toolkit";

// Components
import LoadingOverlay from "./LoadingOverlay/LoadingOverlay";
import Content from "./Content/Content";
import Comments from "./Comments/Comments";
import Jump from "./Jump/Jump";

// model
import { PhotosData, Photo } from "./tools/photos.model";


// -------------------------------------------------------------------------------------------------

// WEB API
const PHOTOS_WEB_API: string = "http://localhost:8080/get";


const App = () => {
  
  // --------------------------------------------------------------------- event handers
  const onResponse = (result: PhotosData) => {
    // store received JSON samples array in state variable since samples is used heavily in JSX of App and SelectedView
    setPhotos(result.photos);
    setLoading(false);
  };

  const onError = (message: string) => console.log("*** Error has occured during AJAX data transmission: " + message);

  // previous button
  const getPrevious = (e:any) => {
    if (currentPhoto == 0) return
    setCurrentPhoto(currentPhoto - 1);
    // console.log("The current photo is: " + currentPhoto);
  };


  // next button
  const getNext = (e:any) => {
    if (currentPhoto > photos.length) return
    setCurrentPhoto(currentPhoto + 1);
    // console.log("The current photo is: " + currentPhoto);
  };
  
  // jump button
  const getJump = (e:any) => {  
    setJump(!toggleJump);
  };  
  
  // comment button
  const getComment = (e:any) => {
    setComment(!toggleComment);
  };

  // refreshJSON for data receival
  const refreshJSON = () => {
    getJSONData(PHOTOS_WEB_API, onResponse, onError);
  };

  // --------------------------------------------------------------------- state variables
  const [loading, setLoading] = useState<boolean>(true);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentPhoto, setCurrentPhoto] = useState<number>(0);
  const [toggleJump, setJump] = useState<boolean>(false);
  const [toggleComment, setComment] = useState<boolean>(false);

  // --------------------------------------------------------------------- lifecycle hooks
  useEffect(() => {
    // getJSONData(PHOTOS_WEB_API, onResponse, onError);
    // component mounted - loading JSON data when root component mounts
    refreshJSON();
  }, []);

  // --------------------------------------------------------------------- render to DOM
  return (
    <div className="main">
      {/* Loading Overlay */}
       <LoadingOverlay bgColor="#035074" spinnerColor="#FFFFFF" enabled={loading} />

      {/* Site Header */}
      <div className="header">
        <div className="header header--title">_Photo.Album</div>
        <div className="header header--subtitle">Full Stack Programming Project 1 - React - Andre Saliba - November 2021</div>
      </div>

      {/* Navegation Buttons */}
      <div className="nav">
        <div className="nav--controls">
            <button className="btn btn-round btn-blue" type="button" id="btnPrevious" onClick={getPrevious} disabled={photos.length == 0 ? true : currentPhoto !== 0 ? false : true}>Previous</button>
            <button className="btn btn-blue" type="button" id="btnNext" onClick={getNext} disabled={photos.length == 0 ? true : currentPhoto !== photos.length - 1 ? false : true }>Next</button>
            <button className="btn btn-yellow" type="button" id="btnJump" onClick={getJump} disabled={photos.length == 0 ? true : false}>Jump</button>
            <button className="btn btn-yellow" type="button" id="btnComment" onClick={getComment} disabled={photos.length == 0 ? true : false}>Comment</button>
            <div className="nav--counter" id="lblCounter">Photo {currentPhoto + 1} of {photos.length}</div>
        </div>

        {/* Jump toggle  */}
        <div className="nav--album" style={{display: (toggleJump ? "block" : "none")}}>
          <Jump  photos={photos} setCurrentPhoto={setCurrentPhoto} />
        </div>


        {/* Comment toggle */}
        <div className="nav--comment" style={{display: (toggleComment ? "block" : "none")}}>
          <Comments 
            currentPhoto={currentPhoto} 
            photos={photos}
            refreshJSON={refreshJSON}
            setLoading={setLoading}
          />
        </div>
      </div>

      {/* If JSON is empty, let user know that database is empty */}
      {photos.length > 0 ? (
        <Content 
          id={photos[currentPhoto].id} 
          title={photos[currentPhoto].title} 
          caption={photos[currentPhoto].caption} 
          source={photos[currentPhoto].source} 
          comments={photos[currentPhoto].comments} 
        />
        // <Content 
        //   id={photos[currentPhoto].id} 
        //   title={photos[currentPhoto].title} 
        //   caption={photos[currentPhoto].caption} 
        //   source={photos[currentPhoto].source} 
        //   comments={photos[currentPhoto].comments} 
        // />
      ) : (
        //  Display warning
        <div className="warning">
          <div className="warning--message">There are no photos in the database :( </div>
        </div>
      )}
    </div>
  );
};

export default App;
