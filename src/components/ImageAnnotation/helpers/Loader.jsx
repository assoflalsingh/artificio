import {Box, CircularProgress, makeStyles} from "@material-ui/core";
import * as React from "react";

const useClasses = makeStyles(() => ({
	container : {
		width: '71%',
		height: '78%',
		background: '#383838',
		opacity: '0.8',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		zIndex: '1000'
	},
	loader : {
		position: 'absolute',
		color: '#0775ce'
	},
}));

const Loader = () => {
	const classes = useClasses()
	return (
		<Box className={classes.container}>
			<CircularProgress className={classes.loader} color="inherit"/>
		</Box>
	)
}

export default Loader
