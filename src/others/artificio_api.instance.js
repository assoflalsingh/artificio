import axios from 'axios';

export const getInstance = (token) => {
  const artificioApi = axios.create({
    // baseURL: 'https://api.artificio.ai',
    baseURL: 'http://localhost:6060',
  });

  if (token) {
    //applying token
    artificioApi.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

    /* Auth interceptor */
    artificioApi.interceptors.response.use(response=>response,
      error=>{
        if (error.response && error.response.status === 401) {
          console.log('Session expired...');
          localStorage.removeItem('token', null);
          window.location.reload();
        } else {
          return Promise.reject(error);
        }
      }
    );
  } else {
    //deleting the token from header
    delete artificioApi.defaults.headers.common['Authorization'];
  }
  artificioApi.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

  return artificioApi;
};

export const APP_WEBSITE = 'https://www.artificio.ai';

export const URL_MAP = {
  /* auth */
  VALID: 'valid/',
  AUTH: 'login/',
  ACTIVATE: 'auth/activate-user/',
  SIGN_IN: 'auth/login/',
  SIGN_UP: 'auth/signup/',
  USER_INFO: 'auth/user-info/',
  USERS_LIST: 'auth/users-list/',
  USER_PREQUISITE: 'auth/user-prequisite/',
  ADD_USER: 'auth/add-user/',
  UPDATE_USER: 'auth/update-user/',
  UPDATE_PASSWORD: 'auth/change-password/',
  FORGOT_PASSWORD: 'auth/forgot-password/',
  RESET_PASSWORD: 'auth/reset-password/',

  /* annotation */
  UPLOAD_TO_S3: 'upload-to-s3/',

  CREATE_LABEL: 'label/post-labels/',
  GET_LABEL_PREQUISITE: 'label/get-labels/',

  CREATE_DATA_GROUP: 'label/post-datagroups/',
  CREATE_DATA_GROUP: 'label/post-datagroups/',
  GET_DATAGROUP_PREQUISITES: 'label/get-datagroup-prequisites/',
  GET_DATAGROUPS: 'label/get-datagroups/',
  GET_DATAGROUPS_LIST: 'label/get-datagroups-list/',
  ASSIGN_DATAGROUP: 'label/assign-datagroup/',

  GET_THUMBNAILS: 'label/get-thumbnails/',
  GET_DATA_LIST: 'label/get-data-list/',
  GET_ANNOTATION_DETAILS: 'label/get-image-annotation-details/',
  UPDATE_FILE_STATUS: 'label/update-file-status/',
};
