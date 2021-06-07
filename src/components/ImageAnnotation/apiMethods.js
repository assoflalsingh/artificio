import { URL_MAP } from "../../others/artificio_api.instance";

export async function getImageData(api, imageId, pageNo, inReview) {
  // setProcessMsg('Fetching image file information...');
  try {
    const response = await api.post(URL_MAP.GET_ANNOTATION_DETAILS, {
      document_id: imageId,
      page_no: pageNo,
      status: inReview ? ["in-process"] : ["ready"],
    });
    // setProcessMsg(null);
    return response.data.data;
  } catch (error) {
    if (error.response) {
      // setAjaxMessage({
      // 	error: true, text: error.response.data.message,
      // });
    } else {
      console.error(error);
    }
  }
}

export async function saveAnnotationData(
  api,
  documentId,
  pageNo,
  imageMetadata,
  textAnnotations,
  userAnnotatedData,
  reviewMode = false,
  table_annotations
) {
  // Changes for passing table_annotations to the API.
  return api.post(URL_MAP.UPDATE_FILE_STATUS, {
    document_id: documentId,
    page_no: pageNo,
    json_data: {
      initial_model_data: {
        text_annotations: textAnnotations,
        table_annotations: table_annotations,
        metadata: imageMetadata,
      },
      user_annotate_data: userAnnotatedData,
    },
    status: reviewMode ? "completed" : "in-process",
  });
}

export async function saveStructure(api, payload) {
  return api.post(URL_MAP.CREATE_STRUCTURE, payload);
}

export async function assignData(api, payload) {
  return api.post(URL_MAP.ASSIGN_DATA, payload);
}

export async function getStructuresList(api) {
  return api.get(URL_MAP.GET_STRUCTURES);
}

export async function getStructureTemplate(api, id) {
  return api.post(URL_MAP.GET_STRUCTURE_TEMPLATE, {
    _id: id,
  });
}
