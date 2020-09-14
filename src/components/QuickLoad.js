
import React, { useState,useEffect,useRef } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import styled from 'styled-components'
import axios from 'axios'






function QuickLoad () {
    const [validFiles, setValidFiles] = useState([]);
    const [unsupportedFiles, setUnsupportedFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const modalImageRef = useRef();
    const modalRef = useRef();
    const fileInputRef = useRef();
    const uploadModalRef = useRef();
    const uploadRef = useRef();
    const progressRef = useRef();

 

    useEffect(() => {
        let filteredArray = selectedFiles.reduce((file, current) => {
            const x = file.find(item => item.name === current.name);
            if (!x) {
                return file.concat([current]);
            } else {
                return file;
            }
        }, []);
        setValidFiles([...filteredArray]);
    
    }, [selectedFiles]);

  const handleFiles = (files) => {
    for(let i = 0; i < files.length; i++) {
        if (validateFile(files[i])) {
            // add to an array so we can display the name of file
            setSelectedFiles(prevArray => [...prevArray, files[i]]);
        } else {
       // add a new property called invalid
         files['invalid'] = true;
         setSelectedFiles(prevArray => [...prevArray, files[i]]);
         setUnsupportedFiles(prevArray => [...prevArray, files[i]]);
         // set error message
         setErrorMessage('File type not permitted');
        }
    }
}

  const dragOver = (e) => {
    e.preventDefault();
}

const dragEnter = (e) => {
    e.preventDefault();
}

const dragLeave = (e) => {
    e.preventDefault();
}

const fileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
        handleFiles(files);
    }
}
const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon'];
    if (validTypes.indexOf(file.type) === -1) {
        return false;
    }
    return true;
}
const fileSize = (size) => {
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
const fileType = (fileName) => {
    return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
}

const removeFile = (name) => {
    // find the index of the item
    // remove the item from array

    const validFileIndex = validFiles.findIndex(e => e.name === name);
    validFiles.splice(validFileIndex, 1);
    // update validFiles array
    setValidFiles([...validFiles]);
    const selectedFileIndex = selectedFiles.findIndex(e => e.name === name);
    selectedFiles.splice(selectedFileIndex, 1);
    // update selectedFiles array
    setSelectedFiles([...selectedFiles]);

    const unsupportedFileIndex = unsupportedFiles.findIndex(e => e.name === name);
    if (unsupportedFileIndex !== -1) {
        unsupportedFiles.splice(unsupportedFileIndex, 1);
        // update unsupportedFiles array
        setUnsupportedFiles([...unsupportedFiles]);
    }
}

const openImageModal = (file) => {
    const reader = new FileReader();
    modalRef.current.style.display = "block";
    reader.readAsDataURL(file);
    reader.onload = function(e) {
        modalImageRef.current.style.backgroundImage = `url(${e.target.result})`;
}
}
const closeModal = () => {
    modalRef.current.style.display = "none";
    modalImageRef.current.style.backgroundImage = 'none';
}
const fileInputClicked = () => {
    fileInputRef.current.click();
}
const filesSelected = () => {
    if (fileInputRef.current.files.length) {
        handleFiles(fileInputRef.current.files);
    }
}
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});
const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n) {
      u8arr[n - 1] = bstr.charCodeAt(n - 1)
      n -= 1 // to make eslint happy
    }
    return new File([u8arr], filename, { type: mime })
  }
const uploadFiles = async() => {
   
    uploadModalRef.current.style.display = 'block';
    uploadRef.current.innerHTML = 'File(s) Uploading...';
    for (let i = 0; i < validFiles.length; i++) {
        let randSeq= Math.floor(Math.random() * 100000000);
        let date = new Date();
        let dataSetId='';


       let base64file=await toBase64(validFiles[i]);
        dataSetId=date.toISOString().substring(0,10).replace(/\-/g, '') + randSeq
        const formData = new FormData();
        //formData.append('file',base64file); 
       formData.append('file',validFiles[i]); 
        
        console.log("validFiles",validFiles[i]);
        console.log("formData",formData);
        console.log("base64 ::",base64file)
        
        // formData.append('key', 'add your API key here');
        axios.post('https://q4zw8vpl77.execute-api.us-west-2.amazonaws.com/upload-s3-final/', formData,{
            headers :{
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*',
                'user_name': 'sharat',
                'data_set_id': dataSetId,
                 'file_name':validFiles[i].name
              }
      
        }).then((response)=>{
          console.log(response);
          console.log("formData",formData);
          let uploadPercentage = Math.floor((1 / 2) * 100);
           uploadPercentage = Math.floor((2 / 2) * 100);
          progressRef.current.innerHTML = `${uploadPercentage}%`;
          progressRef.current.style.width = `${uploadPercentage}%`;
          if (response.status === 200 && uploadPercentage === 100 ) {
            uploadRef.current.innerHTML = 'File(s) Uploaded';
            validFiles.length = 0;
            setValidFiles([...validFiles]);
            setSelectedFiles([...validFiles]);
            setUnsupportedFiles([...validFiles]);
           // closeUploadModal();
        }
        })
        .catch(() => {
            // If error, display a message on the upload modal
            uploadRef.current.innerHTML = `<span className="error">Error Uploading File(s)</span>`;
            // set progress bar background color to red
            progressRef.current.style.backgroundColor = 'red';
        });
    }
}

const closeUploadModal = () => {
    uploadModalRef.current.style.display = 'none';
}
  
  return (
    <OutlinedContainer>
    <Container>
      {unsupportedFiles.length === 0 && validFiles.length ? <button className="file-upload-btn" onClick={() => uploadFiles()}>Upload Files</button> : ''} 
{unsupportedFiles.length ? <p>Please remove all unsupported files.</p> : ''}
       <div className="modal" ref={modalRef}>
            <div className="overlay"></div>
            <span className="close" onClick={(() => closeModal())}>X</span>
            <div className="modal-image" ref={modalImageRef}></div>
        </div>
        <div className="upload-modal" ref={uploadModalRef}>
            <div className="overlay"></div>
            <div className="close" onClick={(() => closeUploadModal())}>X</div>
            <div className="progress-container">
                <span ref={uploadRef}></span>
                <div className="progress">
                    <div className="progress-bar" ref={progressRef}></div>
                </div>
            </div>
        </div>
        <DropContainer onDragOver={dragOver}
                    onDragEnter={dragEnter}
                    onDragLeave={dragLeave}
                    onDrop={fileDrop}
                    onClick={fileInputClicked}>
      <div className="file-display-container">
    {
       validFiles.map((data, i) => 
            <div className="file-status-bar" key={i} >
                <div onClick={!data.invalid ? () => openImageModal(data) : () => removeFile(data.name)}>
                    <div className="file-type-logo"></div>
                    <div className="file-type">{fileType(data.name)}</div>
                    <span className={`file-name ${data.invalid ? 'file-error' : ''}`}>{data.name}</span>
                    <span className="file-size">({fileSize(data.size)})</span> {data.invalid && <span className='file-error-message'>({errorMessage})</span>}
                </div>
                <div className="file-remove" onClick={() => removeFile(data.name)}>X</div>
            </div>
        )
    }
</div>
            <DropMessage className="drop-message">
            <UploadBox className="upload-icon"></UploadBox>
             Drag & Drop files here or click to upload
            </DropMessage>
            <input
                ref={fileInputRef}
                className="file-input"
                type="file"
                multiple
                onChange={filesSelected}
            />
            </DropContainer>
       </Container>
       </OutlinedContainer>
  )
}



export default QuickLoad


const OutlinedContainer = styled.div`
background-color: white;
min-height: 100vh;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center`
const Container = styled.div`
transform: translateY(-100%);

.container p {
    color: red;
    text-align: center;
}
`

const DropContainer = styled.div`
display: flex;
align-items: center;
justify-content: center;
margin: 0;
width: 800px;
height: 200px;
border: 4px dashed #4aa1f3;
`

const UploadBox = styled.div`
    width: 50px;
    height: 50px;
    
    background-size: 100%;
    text-align: center;
    margin: 0 auto;
    padding-top: 30px;
`
const DropMessage = styled.div`

    text-align: center;
    color: #4aa1f3;
    font-family: Arial;
    font-size: 20px;
`