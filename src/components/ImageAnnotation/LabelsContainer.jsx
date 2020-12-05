import {Box, Typography} from "@material-ui/core";
import * as React from "react";
import {makeStyles} from "@material-ui/core/styles";
import CommonTabs from "../CommonTabs";
import {CanvasEventAttacher} from "./CanvasEventAttacher";
import {CustomEventType} from "../../canvas/core/constants";
import {findTextAnnotations} from "./utilities";

const styles = {
	labelContainer: {
		background: '#383838',
		color: '#ffffff',
		height: '100%',
	},
	textHead: {
		margin: '0.7rem 0 0.7rem 0.8rem',
		fontWeight: 'bold'
	},
	tabsContainer: {
		height: '87%',
		padding: '0 0.5rem 0 0.8rem',
	},
	scrollableLabelsContainer: {
		padding: '0.5rem',
		height: '100%',
		overflowY: 'scroll',
		overflowX: 'hidden',
		paddingRight: '0.8rem'
	},
	label: {
		margin: '0.1rem 0 0.6rem 0.2rem',
		border: '1px solid #0775ce',
		borderRadius: '4px',
		padding: '0.5rem'
	},
	labelName: {
		marginLeft: '0.5rem',
		fontWeight: 'bold'
	}
}

const useStyles = makeStyles(styles)

/**
 * imageLabels: {
  "label_name": string,
  "label_shape": string",
  "label_datatype": string",
  "label_color": string
	}
 */
export const LabelsContainer = ({getAnnotations, imageLabels, textAnnotations, getAnnotationData}) => {
	const classes = useStyles()
	return (
		<Box className={classes.labelContainer}>
			<Typography className={classes.textHead}>LABEL / ANNOTATION</Typography>
			<Box className={classes.tabsContainer}>
				<CommonTabs tabs={
					{
						"Custom OCR": (
							<Box className={classes.scrollableLabelsContainer}>
								<ScrollableLabelsContainer
									getAnnotations={getAnnotations}
									getAnnotationData={getAnnotationData}
									imageLabels={imageLabels}
									textAnnotations={textAnnotations}
								/>
							</Box>
						),
						"Optimal OCR": <Box className={classes.scrollableLabelsContainer}>Not Implemented</Box>
					}
				}/>
			</Box>
		</Box>
	)
}

class ScrollableLabelsContainer extends CanvasEventAttacher {
	state = {
		labels: []
	}

	constructor(props) {
		super(props);
		this.eventListeners = [
			{
				event: CustomEventType.NOTIFY_LABEL_CREATION,
				func: (event) => {
					const {getAnnotations, imageLabels, textAnnotations, getAnnotationData} = this.props
					const annotations = getAnnotations() || []
					const labels = []
					annotations.forEach(ann => {
						const scaledData = getAnnotationData(ann)
						const words = findTextAnnotations(scaledData.label_points, textAnnotations)
						if (imageLabels.find(label => label.label_name === ann.getLabel())) {
							labels.push(<Label key={ann.id} labelName={ann.getLabel()} color={ann.color}/>)
						}
					})
					this.setState({labels})
				}
			}
		];
	}

	componentDidMount() {
		this.bindEventListeners()
	}

	componentWillUnmount() {
		this.unbindEventListeners()
	}

	renderComponent() {
		return (
			<>
				{this.state.labels}
			</>
		)
	}
}

const Label = ({labelName, color}) => {
	const classes = useStyles()
	return(
		<Box>
			<Box className={classes.labelName}>{labelName}</Box>
			<Box className={classes.label} style={{
				borderLeft: `9px solid ${color}`
			}}>
				Test
			</Box>
		</Box>
	)
}
