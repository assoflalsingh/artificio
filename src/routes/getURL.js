const BASE_URL = 'https://api.artificio.ai';

const URL_MAP = {
  UPLOAD_TO_S3: 'upload-to-s3',
};

/* Return the URL for the requested key */
export default function getURL(key) {
  if(URL_MAP[key]) {
    return `${BASE_URL}/${URL_MAP[key]}`;
  }
  return null;
}