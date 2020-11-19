import React from "react"
import {makeStyles} from "@material-ui/core/styles"
import styles from "react-image-annotate/ImageCanvas/styles"


const useStyles = makeStyles(styles)

const KonvaCanvasContainer = () => {
	return (
		<div className={'konva-canvas-container'}>
			<canvas/>
		</div>
	)
}

export default KonvaCanvasContainer;
