import axios from 'axios';

export const getInstance = (token) => {
  const artificioApi = axios.create({
    // baseURL: 'https://api.artificio.ai',
    baseURL: 'http://localhost:6060',
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
  /* auth */
  VALID: 'valid/',
  AUTH: 'login/',
  ACTIVATE: 'auth/activate-user/',
  SIGN_UP: 'auth/signup/',
  /* annotation */
  UPLOAD_TO_S3: 'upload-to-s3',
  CREATE_LABEL: 'label/post-label/',
  GET_LABEL_PREQUISITE: 'label/get-labels/',
  CREATE_DATA_GROUP: 'create-dg/',
  CREATE_DG_PREQUISITE: 'create-dg-dropdowns/',
};
