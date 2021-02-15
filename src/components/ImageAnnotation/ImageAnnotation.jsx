import * as React from "react";
import { URL_MAP } from "../../others/artificio_api.instance";
import {
  Backdrop,
  CircularProgress,
  Snackbar,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { generateImagesData } from "./utilities";
import AnnotationTool from "./AnnotationTool";

export default class ImageAnnotation extends React.Component {
  state = {
    images: {},
    processMsg: null,
    ajaxMessage: null,
  };

  fetchThumbnails() {
    this.setState({ processMsg: "Preparing the annotation tool..." });
    const dataImages = generateImagesData(this.props.getImages());
    const data_lists = {};
    Object.values(dataImages).forEach((img) => {
      data_lists[img._id] = data_lists[img._id] || {};
      data_lists[img._id][img.page_no] = img.img_thumb;
    });
    this.props.api
      .post(URL_MAP.GET_THUMBNAILS, { data_lists: data_lists })
      .then((res) => {
        const data = res.data.data;
        const newDataImages = dataImages;
        for (const _id in data) {
          for (const page_no in data[_id]) {
            newDataImages[`${_id}:${page_no}`].img_thumb_src =
              data[_id][page_no];
          }
        }
        this.setState({ images: newDataImages });
        // setThumbnails(tmp_thumbs);
      })
      .catch((error) => {
        if (error.response) {
          this.setState({
            ajaxMessage: { error: true, text: error.response.data.message },
          });
        } else {
          console.error(error);
        }
      })
      .then(() => {
        this.setState({ processMsg: null });
      });
  }

  componentDidMount() {
    this.fetchThumbnails();
  }

  render() {
    return (
      <>
        <Backdrop
          style={{ zIndex: 2000 }}
          open={Boolean(this.state.processMsg)}
        >
          <CircularProgress color="inherit" />
          <Typography style={{ marginLeft: "0.25rem" }} variant="h5">
            {this.state.processMsg}
          </Typography>
        </Backdrop>
        <Snackbar
          open={Boolean(this.state.ajaxMessage)}
          autoHideDuration={6000}
        >
          {this.state.ajaxMessage && (
            <Alert
              onClose={() => {
                this.setState({ ajaxMessage: null });
                this.props.onClose();
              }}
              severity={this.state.ajaxMessage.error ? "error" : "success"}
            >
              {this.state.ajaxMessage.error ? "Error occurred: " : ""}
              {this.state.ajaxMessage.text}
            </Alert>
          )}
        </Snackbar>
        {Object.values(this.state.images).length > 0 && (
          <AnnotationTool
            api={this.props.api}
            images={Object.values(this.state.images)}
            onAnnotationToolClose={this.props.onClose}
            onAnnotationSavedSucces= {this.props.onSuccessSave}
            inReview={this.props.inReview}
          />
        )}
      </>
    );
  }
}
