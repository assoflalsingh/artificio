import React from "react"
import Select from "react-select"
import Paper from "@material-ui/core/Paper"
import {makeStyles} from "@material-ui/core/styles"
import classnames from "classnames"
import IconButton from "@material-ui/core/IconButton"
import TrashIcon from "@material-ui/icons/Delete"
import {grey} from "@material-ui/core/colors";
import {CanvasEventAttacher} from "./CanvasEventAttacher";
import {CustomEventType} from "../../canvas/core/constants";
import Button from "@material-ui/core/Button";
import CheckIcon from "@material-ui/icons/Check";

const DefaultLabels = [{
	label_name: 'arto_others'
}, {
	label_name: 'Create Label'
}]

const styles = {
	regionInfo: {
		fontSize: 12,
		cursor: "default",
		transition: "opacity 200ms",
		fontWeight: 600,
		color: grey[900],
		padding: 8,
		"& .name": {
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			"& .circle": {
				marginRight: 4,
				boxShadow: "0px 0px 2px rgba(0,0,0,0.4)",
				width: 10,
				height: 10,
				borderRadius: 5
			}
		},
		"& .tags": {
			"& .tag": {
				color: grey[700],
				display: "inline-block",
				margin: 1,
				fontSize: 10,
				textDecoration: "underline"
			}
		}
	}
}

const useStyles = makeStyles(styles)

export class LabelSelector extends CanvasEventAttacher {
	state = {
		show: false,
		position: {x: 0, y: 0}
	}

	showLabelSelector = (value) => {
		this.setState({show: value})
	}

	constructor(props) {
		super(props);
		this.eventListeners = [
			{
				event: CustomEventType.SHOW_LABEL_DROPDOWN,
				func: (event) => {
					this.setState({position: event.detail.position})
					this.showLabelSelector(true)
				}
			},
			{
				event: CustomEventType.HIDE_LABEL_DROPDOWN,
				func: (event) => {
					this.showLabelSelector(false)
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
		const show = this.state.show
		return (
			<>
			{
				show &&
				<div style={{
						height: 'auto',
						position: 'absolute',
						opacity: 1,
						top: this.state.position.y,
						left: this.state.position.x
				}}>
					<Label
						showLabelSelector={this.showLabelSelector}
						deSelectActiveAnnotation={this.props.deSelectActiveAnnotation}
						imageLabels={this.props.imageLabels}
					/>
				</div>
			}
			</>
		)
	}
}

/**
 *
 * imageLabels: {
  "label_name": string,
  "label_shape": string",
  "label_datatype": string",
  "label_color": string
	}
 */

const Label = ({showLabelSelector, deSelectActiveAnnotation, imageLabels}) => {
	const classes = useStyles()
	let labels = Object.assign([], imageLabels)
	labels = labels.concat(DefaultLabels)
	return (
		<Paper className={classnames(classes.regionInfo)}>
			<div style={{width: 200}}>
				<div style={{display: "flex", flexDirection: "row"}}>
					<div
						style={{
							display: "flex",
							backgroundColor: "#888",
							color: "#fff",
							padding: 4,
							paddingLeft: 8,
							paddingRight: 8,
							borderRadius: 4,
							fontWeight: "bold",
							textShadow: "0px 0px 5px rgba(0,0,0,0.4)",
						}}
					>
						BOX
					</div>
					<div style={{flexGrow: 1}}/>
					<IconButton
						onClick={() => {
						}}
						tabIndex={-1}
						style={{width: 22, height: 22}}
						size="small"
						variant="outlined"
					>
						<TrashIcon style={{marginTop: -8, width: 16, height: 16}}/>
					</IconButton>
				</div>
				<br/>
				<Select
					placeholder="Tags"
					value={''}
					onChange={(val) => {
						debugger
					}}
					options={
						labels.map(label => ({
							value: label.label_name,
							label: label.label_name
						}))
					}
				/>
				<div style={{ marginTop: 4, display: "flex" }}>
					<div style={{ flexGrow: 1 }} />
					<Button
						onClick={() => {
							deSelectActiveAnnotation()
							showLabelSelector(false)
						}}
						size="small"
						variant="contained"
						color="primary"
					>
						<CheckIcon />
					</Button>
				</div>
			</div>
		</Paper>
	)
}
