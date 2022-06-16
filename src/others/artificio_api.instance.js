import axios from 'axios';
import APP_CONFIGS from '../app-config.js';

export const getInstance = (token) => {
  const artificioApi = axios.create({
    baseURL: 'https://api.artificio.ai',
    // baseURL: 'http://localhost:5000',
  });

  if (token) {
    //applying token
    artificioApi.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

    /* Auth inter ceptor */
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

  CREATE_LABEL: 'label/',
  UPDATE_LABEL: 'label/',
  GET_LABELS: 'label/',
  GET_LABEL_PREQUISITE: 'label/prequisites/',

  CREATE_DATA_GROUP: 'datagroups/',
  UPDATE_DATA_GROUP: 'datagroups/',
  GET_DATAGROUP_PREQUISITES: 'datagroups/prequisites/',
  GET_DATAGROUP_NAMES: 'datagroups/names/',
  GET_DATAGROUPS: 'datagroups/',
  ASSIGN_DATA: 'data-list/assign-data/',

  
  GET_ALL_MODELS:'classification/get-model-details/',

  TRAIN_RETRAIN_MODEL:'classification/prediction-model/',
  TRAIN_MODEL:'ner-model/train/',

  GET_APP_USAGE: 'appusage/',
  GET_DATA_SETS: 'dataset/',
  CREATE_DATA_SETS: 'dataset/',
  GET_DATA_SETS_RESULTS: 'dataset/results/',

  CREATE_STRUCTURE: 'structures/',
  GET_STRUCTURES: 'structures/',
  GET_STRUCTURE_TEMPLATE: 'structures/template/',

  GET_DATASET_EMAILS: 'dataset/emails/',
  GET_THUMBNAILS: 'data-list/thumbnails/',
  GET_DATA_LIST: 'data-list/',
  GET_ANNOTATION_DETAILS: 'data-list/annotation-details/',
  UPDATE_FILE_STATUS: 'data-list/update-file-status/',
  FETCH_MODELS_FOR_DG: 'ner-model/fetch-models/',

  GET_DOWNLOADS_LIST: 'downloads/',
  SCHEDULE_DOWNLOAD_REQUEST: 'downloads/schedule/',

  VERIFY_RULE: 'rules/verify-rule/',
  RULE_PATTERNS: 'rules/patterns/',

  /* ReCaptcha */

  RECAPTCHA_API: `https://www.google.com/recaptcha/api.js?render=${APP_CONFIGS.CAPTCHA_SITE_KEY}`,

  MASS_EXTRACTION_API: `structures/mass-data-extraction/`,

  GET_OCR_DETAILS: 'pre/ocr/',

};
