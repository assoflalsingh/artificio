import React, { useEffect, useRef, useState } from 'react';
import { Backdrop, CircularProgress, Dialog, Snackbar, Typography } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
// import ReactImageAnnotate from "react-image-annotate/ImageCanvas";
import Annotator from '../../annotator';
import { URL_MAP } from '../../others/artificio_api.instance';

function processTrainedJson(image_json) {
    let regionValues = [];
    if(typeof(image_json) === 'object') {
        image_json.text_annotations.forEach((one_block)=>{
            one_block.word_details.forEach((word)=>{
            let [tl, tr, br, bl] = word.bounding_box.vertices;
            let xs = word.bounding_box.vertices.map((v)=>v.x);
            let ys = word.bounding_box.vertices.map((v)=>v.y);

            let regionValue = {
                value: word.word_description,
            };

            regionValue.xmin = Math.min(...xs);
            regionValue.ymin = Math.min(...ys);
            regionValue.xmax = Math.max(...xs);
            regionValue.ymax = Math.max(...ys);
            regionValues.push(regionValue);
            });
        });
    }
    return regionValues;
}

function processAnnotatedData({pixelSize, regions, labels_data}) {
  let {w:iw, h:ih} = pixelSize;

  let retJson = {
    "image": {
      w: iw, h: ih
    },
    "labels": []
  }

  regions.map((region)=>{
    if(typeof(labels_data[region.cls]) === "undefined")
      return;

    let {x, y, w, h} = region;
    let label = {
      label_name: region.cls,
      label_value: labels_data[region.cls],
      label_shape: region.type,
      label_points: [
        [x * iw, y * ih],
        [x * iw + w * iw, y * ih],
        [x * iw + w * iw, y * ih + h * ih],
        [x * iw, y * ih + h * ih],
      ]
    };
    retJson['labels'].push(label);
  });

  return retJson;
}

export function AnnotateTool({open, onClose, api, getAnnotateImages}) {
  const [dataImages, setDataImages] = useState({});
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [imageLabels, setImageLabels] = useState([]);
  const [thumbCalled, setThumbCalled] = useState(false);
  const [processMsg, setProcessMsg] = useState(null);
  const [ajaxMessage, setAjaxMessage] = useState(null);
  useEffect(()=>{
    if(open) {
        let annotateImages = getAnnotateImages();
        let tmpDataImages = {};
        let data_lists = {};
        annotateImages.forEach((img)=>{
          tmpDataImages[`${img._id}:${img.page_no}`] = {
            _id: img._id,
            name: img.img_name,
            regions: [],
            model_regions: null,
            page_no: img.page_no,
            img_thumb: img.img_thumb,
            img_thumb_src: null,
            labels_data: [],
          }
          data_lists[img._id] = data_lists[img._id] || {};
          data_lists[img._id][img.page_no] = img.img_thumb;
        });
        setSelectedImage(undefined);
        setThumbCalled(false);
        setDataImages(tmpDataImages);
    }
  }, [open]);

  useEffect(()=>{
    if(Object.keys(dataImages).length > 0 && !thumbCalled) {
        setThumbCalled(true);
        setProcessMsg('Preparing the annotation tool...');
        let data_lists = {};
        Object.values(dataImages).forEach((img)=>{
            data_lists[img._id] = data_lists[img._id] || {};
            data_lists[img._id][img.page_no] = img.img_thumb;
          });
        api.post(URL_MAP.GET_THUMBNAILS, {'data_lists': data_lists})
        .then((res)=>{
            let data = res.data.data;
            let newDataImages = dataImages;
            for (const _id in data) {
                for(const page_no in data[_id]) {
                    newDataImages[`${_id}:${page_no}`].img_thumb_src = data[_id][page_no];
                }
            }
            setDataImages(newDataImages);
            // setThumbnails(tmp_thumbs);
        }).catch((error)=>{
          if(error.response) {
            setAjaxMessage({
              error: true, text: error.response.data.message,
            });
          } else {
            console.error(error);
          }
        }).then(()=>{
          setProcessMsg(null);
        });
    }
  }, [dataImages]);

//   API: /label/get-image-annotation-details/?document_id=5f9c3594920d9e5fad533c19&page=page_2
// Response:
// {
//     "datetime": "2020-11-03T00:21:00",
//     "message": null,
//     "data": {
//         "document_id": "5f9c3594920d9e5fad533c19",
//         "document_file_name": "skipper_logo.jpg",
//         "image_name": "202010305407-skipper_logo1.jpg",
//         "image_labels": [
//             {
//                 "label_name": "label123_re",
//                 "label_shape": "polygon",
//                 "label_datatype": "character",
//                 "label_color": "green"
//             },
//             {
//                 "label_name": "label123_re2",
//                 "label_shape": "circle",
//                 "label_datatype": "character",
//                 "label_color": "green"
//             }
//         ],
//         "image_json": {
//             "metadata": {
//                 "bucket_details": {
//                     "bucket_name": "artificio-datasets",
//                     "source_folder_name": "un-processed"
//                 },
//                 "image_details": {
//                     "filename": "202010208838-Dynamo-DB.jpg",
//                     "file_extension": "JPG",
//                     "file_size": {
//                         "height": "525",
//                         "width": "830"
//                     }
//                 }
//             },
//             "text_annotations": [
//                 {
//                     "block_details": {
//                         "block_description": "None",
//                         "bounding_box": {
//                             "vertices": [
//                                 {
//                                     "x": 0,
//                                     "y": 0
//                                 },
//                                 {
//                                     "x": 8,
//                                     "y": 0
//                                 },
//                                 {
//                                     "x": 8,
//                                     "y": 3
//                                 },
//                                 {
//                                     "x": 0,
//                                     "y": 3
//                                 }
//                             ]
//                         }
//                     },
//                     "word_details": [
//                         {
//                             "word_description": "None",
//                             "bounding_box": {
//                                 "vertices": [
//                                     {
//                                         "x": 0,
//                                         "y": 0
//                                     },
//                                     {
//                                         "x": 8,
//                                         "y": 0
//                                     },
//                                     {
//                                         "x": 8,
//                                         "y": 3
//                                     },
//                                     {
//                                         "x": 0,
//                                         "y": 3
//                                     }
//                                 ]
//                             }
//                         }
//                     ]
//                 }
//             ]
//         },
//         "image_url": ""
//     },
//     "errors": null
// }

  const onThumbnailClick = (_id, page_no)=>{
    let newSelectedImage = Object.keys(dataImages).indexOf(`${_id}:${page_no}`);

    if(newSelectedImage > -1) {
        let selectedImageData = Object.values(dataImages)[newSelectedImage];
        if(selectedImageData && !selectedImageData.src) {
            /* Get the image src and other data */
            setProcessMsg('Fetching image file information...');
            api.post(URL_MAP.GET_ANNOTATION_DETAILS, {
              "document_id": selectedImageData._id,
              "page_no": selectedImageData.page_no,
            })
            .then((res)=>{
                let data = res.data.data;
                let newDataImages = {
                    ...dataImages
                };
                newDataImages[`${selectedImageData._id}:${selectedImageData.page_no}`].document_file_name = data.document_file_name || 'Unknown';
                newDataImages[`${selectedImageData._id}:${selectedImageData.page_no}`].src = data.image_url;
                newDataImages[`${selectedImageData._id}:${selectedImageData.page_no}`].initial_model_data = data.image_json;
                newDataImages[`${selectedImageData._id}:${selectedImageData.page_no}`].model_regions = processTrainedJson(data.image_json);
                newDataImages[`${selectedImageData._id}:${selectedImageData.page_no}`].image_labels = data.image_labels;
                newDataImages[`${selectedImageData._id}:${selectedImageData.page_no}`].labels_data = data.labels_data || {};
                setImageLabels(data.image_labels);
                setDataImages(newDataImages);
                setSelectedImage(newSelectedImage);
            })
            .catch((error)=>{
              if(error.response) {
                setAjaxMessage({
                  error: true, text: error.response.data.message,
                });
              } else {
                console.error(error);
              }
            })
            .then(()=>{
              setProcessMsg(null);
            });
        } else if(selectedImageData && selectedImageData.src && newSelectedImage != selectedImage) {
            setSelectedImage(newSelectedImage);
        }
    }
  }

  const onSaveAnnotationDetails = (imageIndex, dataImage) => {
    if(Object.values(dataImages)[imageIndex]) {
      let selectedImageData = Object.values(dataImages)[imageIndex];

      setProcessMsg('Saving annotation details...');
      api.post(URL_MAP.UPDATE_FILE_STATUS, {
		  	"document_id": selectedImageData._id,
        "page_no": selectedImageData.page_no,
        "json_data": {
          initial_model_data: selectedImageData.initial_model_data,
          user_annotate_data: processAnnotatedData(dataImage)
        },
        "status": "in-process"
		  })
      .then((res)=>{
        setAjaxMessage({
          error: false, text: 'Annotation details saved successfully !!',
        });
      }).catch((error)=>{
        if(error.response) {
          setAjaxMessage({
            error: true, text: error.response.data.message,
          });
        } else {
          console.error(error);
        }
      }).then(()=>{
        setProcessMsg(null);
      });
    }
  }

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      disableBackdropClick
      disableEscapeKeyDown
    >
      <Backdrop style={{zIndex: 2000}} open={Boolean(processMsg)}>
        <CircularProgress color="inherit" />
        <Typography style={{marginLeft: '0.25rem'}} variant='h5'>{processMsg}</Typography>
      </Backdrop>
      <Snackbar open={Boolean(ajaxMessage)} autoHideDuration={6000} >
        {ajaxMessage && <Alert onClose={()=>{setAjaxMessage(null)}} severity={ajaxMessage.error ? "error" : "success"}>
          {ajaxMessage.error ? "Error occurred: " : ""}{ajaxMessage.text}
        </Alert>}
      </Snackbar>
      <Annotator
        regionClsList={imageLabels}
        images={Object.values(dataImages)}
        selectedImage={selectedImage}
        onThumbnailClick={onThumbnailClick}
        onAnnotatorClose={onClose}
        onSaveAnnotationDetails={onSaveAnnotationDetails}
        />
    </Dialog>
  )
}