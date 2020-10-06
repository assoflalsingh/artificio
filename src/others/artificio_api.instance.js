import axios from 'axios';

export const getInstance = (token) => {
  const artificioApi = axios.create({
    baseURL: 'https://api.artificio.ai',
  });

  if (token) {
    //applying token
    artificioApi.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
  } else {
    //deleting the token from header
    delete artificioApi.defaults.headers.common['Authorization'];
  }
  artificioApi.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  return artificioApi;
};

export const URL_MAP = {
  UPLOAD_TO_S3: 'upload-to-s3',
  VALID: 'valid/',
  AUTH: 'login/',
  ACTIVATE: 'activate',
  SIGN_UP: 'auth/signup/'
};
