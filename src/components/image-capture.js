import {useEffect, useRef} from 'react';

import { Button } from '@material-ui/core';
import snap from './assets/snap.mp3';
import { useSnackbar } from 'notistack';

export default function ImageCapture({setTableData, tableData}) {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const tableDataCopy = [...tableData];
  const { enqueueSnackbar } = useSnackbar();

  const PhotoCanvas = () => <canvas ref={canvasRef} className="photo" />;
  const VideoPlayer = () => <video ref={videoRef} className="player" />;
  const SnapAudio = () => <audio ref={audioRef} className="snap" src={snap} hidden />;

  function paintToCanvas() {
    let vid = videoRef.current;
    let canvas = canvasRef.current;
    let ctx = canvas.getContext("2d");

    let width = vid.videoWidth;
    let height = vid.videoHeight;

    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
      ctx.drawImage(vid, 0, 0, width, height);
    }, 60);
  }


  const getRawBookData = async (isbn) => {
    // comma separated list of ISBNs aceptable:
    // ISBN:${isbn},${isbn},${isbn}...
    // future-proofing for when I cache multiple ISBNs before querying
    let isbnStr = Array.isArray(isbn) ? isbn.join(',') : isbn;
    let url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbnStr}&jscmd=data&format=json`;

    const res = await fetch(url);
    const data = await res.json();

    return data;
  };

  const shapeBookData = async (data, isbn) => {
    let d = data[`ISBN:${isbn}`];

    return {
      isbn: isbn,
      title: d.title,
      author: d.authors[0].name,
      yearPublished: d.publish_date,
      publisher: d.publishers[0].name,
    };
  };

  function getBookDataFromPhoto() {
    let canvas = canvasRef.current;
    let isbn = null;

    // get img data from canvas and pass to BarcodeDetector
    const data =  canvas.toDataURL('image/jpeg', 1.0);
    const image = document.createElement('img');

    // play the 📸 sound
    audioRef.current.currentTime = 0;
    audioRef.current.play();

    // create and append image to DOM
    image.src = data;
    image.setAttribute('hidden', 'true')
    document.body.appendChild(image);

    image.onload = () => {
      if ( 'BarcodeDetector' in window ) {
        // check supported types & add to formats array
        window.BarcodeDetector.getSupportedFormats()
          .then((supportedFormats) => {
            let formats = [];
            supportedFormats.forEach((format) => formats.push(format));

            return formats;
          })
          .then((formats) => {
            // create new detector with supported formats
            const barcodeDetector = new window.BarcodeDetector({formats: formats});

            try {
              barcodeDetector.detect(image)
                .then((barcodes) => {
                  if (barcodes.length === 0) {
                    enqueueSnackbar('😬 Didn’t find a barcode. Try again!', {
                      autoHideDuration: 7500,
                      variant: 'error',
                    });
                  } else {
                    isbn = barcodes[0].rawValue;

                    // get book data if we actually have an isbn
                    if (isbn) {
                      getRawBookData(isbn)
                        .then((data) => {
                          return shapeBookData(data, isbn);
                        })
                        .then((bookInfo) => {
                          tableDataCopy.push(bookInfo);
                          setTableData(tableDataCopy);
                        });
                    }

                    document.body.removeChild(image);
                  }
                });
            } catch (err) {
            // if the imgData is invalid, a DOMException will be thrown
              console.error('Barcode detection failed:', err);
            }
          });
      }else {
        alert('Barcode Detector is not supported in your browser. 😔');
      }
    }
  }

  const TakePhotoButton = () => {
    return (
      <Button
        variant="contained"
        size="large"
        color="primary"
        type="button"
        onClick={getBookDataFromPhoto}
        style={{ maxWidth: 'calc(50% - 2rem)', margin: '2rem auto' }}
      >
        <span style={{ fontSize: '1.25rem' }} role="img" aria-label="camera flash emoji"> 📸 </span>
        &nbsp;
        Take Photo
      </Button>
    )
  };

  useEffect(() => {
    // get the camera feed going
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        let vid = videoRef.current;
        vid.srcObject = stream;
        vid.addEventListener('canplay', () => {
          vid.play();
          paintToCanvas();
        });
      })
      .catch(err => {
        console.error(`🚨 error getting camera feed!`, err);
      })
  }, [videoRef, canvasRef, tableData]);

  return (
    <div className="image-capture">
      <PhotoCanvas />
      <TakePhotoButton />
      <VideoPlayer />
      <SnapAudio />
    </div>
  );
}