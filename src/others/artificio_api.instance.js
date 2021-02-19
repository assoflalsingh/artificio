import axios from 'axios';
import APP_CONFIGS from '../app-config.js';

export const getInstance = (token) => {
  const artificioApi = axios.create({
    baseURL: 'https://api.artificio.ai',
    // baseURL: 'http://localhost:6060',
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
  UPLOAD_DATA_SET_FILE: 'api/v2/upload-to-s3/',

  CREATE_LABEL: 'label/post-labels/',
  UPDATE_LABEL: 'label/update-labels/',
  GET_LABELS: 'label/get-labels/',
  GET_LABEL_PREQUISITE: 'label/get-label-prequisites/',

  CREATE_DATA_GROUP: 'label/post-datagroups/',
  UPDATE_DATA_GROUP: 'label/update-datagroups/',
  GET_DATAGROUP_PREQUISITES: 'label/get-datagroup-prequisites/',
  GET_DATAGROUP_NAMES: 'label/get-datagroup-names/',
  GET_DATAGROUPS: 'label/get-datagroups/',
  ASSIGN_DATA: 'label/assign-data/',
  
  GET_APP_USAGE: 'label/get-appusage/',
  GET_DATA_SETS: 'label/get-datasets/',
  CREATE_DATA_SETS: 'label/post-datasets/',

  CREATE_STRUCTURE: 'label/post-structure/',
  GET_STRUCTURES: 'label/get-structures/',
  GET_STRUCTURE_TEMPLATE: 'label/get-structure-template/',

  GET_THUMBNAILS: 'label/get-thumbnails/',
  GET_DATA_LIST: 'label/get-data-list/',
  GET_ANNOTATION_DETAILS: 'label/get-image-annotation-details/',
  UPDATE_FILE_STATUS: 'label/update-file-status/',

  GET_DOWNLOADS_LIST: 'downloads/list/',
  SCHEDULE_DOWNLOAD_REQUEST: 'downloads/schedule/',

  /* ReCaptcha */

  RECAPTCHA_API: `https://www.google.com/recaptcha/api.js?render=${APP_CONFIGS.CAPTCHA_SITE_KEY}`,

  MASS_EXTRACTION_API: `label/mass-data-extraction/`

};
