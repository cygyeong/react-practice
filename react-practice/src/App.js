import React, { useEffect, useState, useRef} from "react";
import {Routes, Route} from 'react-router-dom'

import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

import html2canvas from 'html2canvas'
import Cropper from 'react-cropper';
import CanvasDraw from "react-canvas-draw";

import TreeShakingApp from './routes/DDtest/drag-drop-test.component'

import { flushSync } from "react-dom";

import Moveable from "react-moveable";


// import Example from "./components/example/example.component";
import 'cropperjs/dist/cropper.css';



const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    textAlign: "center"
  },
  imgBox: {
    maxWidth: "80%",
    maxHeight: "80%",
    margin: "10px"
  },
  img: {
    height: "inherit",
    maxWidth: "inherit"
  },
  input: {
    display: "none"
  }
}));



function App() {
  const classes = useStyles();

  let localstream;

  useEffect(() => {
    let vid = document.getElementById("vid");
    if (navigator.mediaDevices.getUserMedia !== null) {
      var options = {
        video: true,
        // audio: true
      };
      navigator.mediaDevices.getUserMedia(
        options,
        function (stream) {
          vid.srcObject = stream; 
          localstream = stream;
          vid.play();
          console.log(stream, "streaming");
        },
        function (e) {
          console.log("background error : " + e.name);
        }
      );
    }
  });

  const capOff = () => {
    let vid = document?.getElementById("vid");
    if (vid) {
      vid.pause();
      vid.src = "";
    }
    localstream?.getTracks()?.forEach((x) => x.stop());
    console.log("all capture devices off");
  };

  const camON = () => {
    let vid = document.getElementById("vid");
    if (navigator.mediaDevices.getUserMedia !== null) {
      var options = {
        video: true,
        // audio: true
      };
      navigator.getUserMedia(
        options,
        function (stream) {
          vid.srcObject = stream;
          localstream = stream;
          vid.play();
          console.log(stream, "streaming");
        },
        function (e) {
          console.log("background error : " + e.name);
        }
      );
    }
  };

  const cropperRef = useRef(null);
  // ????????? ????????? ?????????
  const [inputImage, setInputImage] = useState('null');
  // ????????? ????????? ???????????? ????????? ?????????
  const [croppedImage, setCroppedImage] = useState(null);

  const [drawWidth, setDrawWidth] = useState(400)
  const [drawHeight, setDrawHeight] = useState(400)


  const onCapture = () =>{
    console.log('onCapture')
    html2canvas(document.getElementById('vid'))
      .then(canvas=>{
      document.body.appendChild(canvas) // ????????? ?????????
      // onSaveAs(canvas.toDataURL('image/png'), 'image-download/png')
      setInputImage(canvas.toDataURL('image/png'))
    })
  }

  // ??????????????? ????????????
  const onCrop = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    setCroppedImage(cropper.getCroppedCanvas().toDataURL());
  };

  // ?????? ????????? ?????? ?????? ?????? 
  const onSaveAs = (uri, filename)=> {  
    console.log('onSave')
    let link = document.createElement('a')
    document.body.appendChild(link)
    link.href = uri
    link.download = filename
    link.click()
    document.body.removeChild(link)
  }
  
  const canvasRef = useRef(null)
  // ?????????????????? ???????????? ?????? ??????
  useEffect(()=>{ 
    if (croppedImage){
      console.log(croppedImage)
      // onSaveAs(croppedImage, 'image-download/png')
      // const ctx = canvasRef.current.getContext("2d")
      // ctx.clearRect(0, 0, 500, 500)

      const image = new Image();
      image.src = croppedImage
      console.log(image.width)

      setDrawWidth(image.width)
      setDrawHeight(image.Heigth)

      // image.onload = function() {
      //   ctx.drawImage(image, 0, 0);
      // };
    }
  }, [croppedImage])


  return (
  
    <div className={classes.root}>
      <Routes>
        <Route path='/dd' element={<TreeShakingApp/>} />
      </Routes>
      <Grid container>
        <Grid item xs={12}>
          <video id="vid" height="500" width="500" autoPlay></video>
          <br />
          <button onClick={capOff}>Turn Capture Off</button>
          <button onClick={camON}>Turn Capture ON</button>
          <button onClick={onCapture}>????????????</button>
        </Grid>
      </Grid>
          <Cropper src={inputImage} crop={onCrop} ref={cropperRef} />
          <img src={croppedImage} />
          {/* <canvas
          ref={canvasRef}
          width={500}
          hegith={500}
          /> */}
          {/* <button onClick={}>?????????</button> */}
      {/* <OnHtmlToPng/> */}
      <CanvasDraw  
        imgSrc={croppedImage}
        brushColor={'white'}
        hideGridX={true}
        hideGridY={true}
        hideInterface={true}
        ref={canvasRef}
        canvasWidth={drawWidth}
        canvasHeight={drawHeight}
      />

    <button
        onClick={() => {
          canvasRef.current.undo();
        }}
      >
        UNDO
      </button>
      <button
        onClick={() => {
          canvasRef.current.clear();
        }}
      >
        CLEAR
      </button>
    </div>
  );
}
export default App;
