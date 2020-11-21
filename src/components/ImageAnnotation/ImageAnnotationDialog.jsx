import * as React from "react";
import {Dialog} from "@material-ui/core";
import ImageAnnotation from "./ImageAnnotation";

export const ImageAnnotationDialog = (props) => {
	const {getImages, api} = props
	return (
		<Dialog
			fullScreen
			open={props.open}
			onClose={props.onClose}
			disableBackdropClick
			disableEscapeKeyDown
		>
			{
				props.open && <ImageAnnotation getImages={getImages} api={api} onClose={props.onClose}/>
			}
		</Dialog>
	)
}

