import React, { useEffect, useRef, useState } from 'react';
import { Dialog } from "@material-ui/core";
// import ReactImageAnnotate from "react-image-annotate/ImageCanvas";
import Annotator from '../../annotator';
import { URL_MAP } from '../../others/artificio_api.instance';

function processImageJson(image_json) {
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

export function AnnotateTool({open, onClose, api, getAnnotateImages}) {
  const [dataImages, setDataImages] = useState({});
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [imageLabels, setImageLabels] = useState([]);
  const [thumbCalled, setThumbCalled] = useState(false);

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
            region_values: null,
            page_no: img.page_no,
            img_thumb: img.img_thumb,
            img_thumb_src: null,
          }
          data_lists[img._id] = data_lists[img._id] || {};
          data_lists[img._id][img.page_no] = img.img_thumb;
        });
        setThumbCalled(false);
        setDataImages(tmpDataImages);
    }
  }, [open]);

  useEffect(()=>{
    if(Object.keys(dataImages).length > 0 && !thumbCalled) {
        setThumbCalled(true);
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
                    console.log(`${_id}:${page_no}`)
                    newDataImages[`${_id}:${page_no}`].img_thumb_src = data[_id][page_no];
                }
            }
            setDataImages(newDataImages);
            // setThumbnails(tmp_thumbs);
        }).catch((err)=>{
            console.log(err);
        }).then(()=>{

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
            let url = `${URL_MAP.GET_ANNOTATION_DETAILS}?document_id=${selectedImageData._id}&page=${selectedImageData.page_no}`;
            api.get(url)
            .then((res)=>{
                let data = res.data.data;
                let newDataImages = {
                    ...dataImages
                };
                newDataImages[`${selectedImageData._id}:${selectedImageData.page_no}`].src = data.image_url;
                newDataImages[`${selectedImageData._id}:${selectedImageData.page_no}`].region_values = processImageJson(data.image_json);
                newDataImages[`${selectedImageData._id}:${selectedImageData.page_no}`].image_labels = data.image_labels;
                setImageLabels(data.image_labels);
                setDataImages(newDataImages);
                setSelectedImage(newSelectedImage);
            })
            .catch((err)=>{
                console.log(err);
            })
        } else if(selectedImageData && selectedImageData.src && newSelectedImage != selectedImage) {
            setSelectedImage(newSelectedImage);
        }
    }
  }

  return (
    <Dialog
      fullWidth
      maxWidth='lg'
      open={open}
      onClose={onClose}
      disableBackdropClick={false}
      disableEscapeKeyDown
      PaperProps={{style: {height: '100%'}}}>

      <Annotator
        regionClsList={imageLabels}
        images={Object.values(dataImages)}
        // {[
        //   {
        //     // "src": "https://images.unsplash.com/photo-1561518776-e76a5e48f731?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
        //     "src": "https://img.techpowerup.org/201029/202010236445-ka119f11o0002-9-page-0001.jpg",
        //     "name": "car-image-1",
        //     regions: [],
        //     region_values: regionValues,
        //   }
        // ]}
        // thumbnails={thumbnails}
        selectedImage={selectedImage}
        // selectedImageSrc={selectedImage > -1 ? Object.values(dataImages)[selectedImage].src : null}
        onThumbnailClick={onThumbnailClick}
        />
    </Dialog>
  )
}