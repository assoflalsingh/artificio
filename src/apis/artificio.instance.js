import axios from 'axios';

export const getInstance = (token) => {
  const artificioApi = axios.create({
    baseURL: 'https://api.artificio.ai'
  });

  if (token) {
    //applying token
    artificioApi.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
  } else {
    //deleting the token from header
    delete artificioApi.defaults.headers.common['Authorization'];
  }
  return artificioApi;
};

export const URL_MAP = {
  UPLOAD_TO_S3: 'upload-to-s3',
  AUTH: 'auth',
};
