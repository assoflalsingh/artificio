import { URL_MAP } from "../../others/artificio_api.instance";

export async function getImageData(api, imageId, pageNo) {
  // setProcessMsg('Fetching image file information...');
  try {
    const response = await api.post(URL_MAP.GET_ANNOTATION_DETAILS, {
      document_id: imageId,
      page_no: pageNo,
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
  reviewMode = false
) {
  return api.post(URL_MAP.UPDATE_FILE_STATUS, {
    document_id: documentId,
    page_no: pageNo,
    json_data: {
      initial_model_data: {
        text_annotations: textAnnotations,
        metadata: imageMetadata,
      },
      user_annotate_data: userAnnotatedData,
    },
    status: reviewMode ? "completed" : "in-process",
  });
}
