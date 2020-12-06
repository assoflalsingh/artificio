import {Box, Card, CardActionArea, CardMedia, makeStyles} from "@material-ui/core";
import * as React from "react";

const useClasses = makeStyles((theme)=>({
	thumbnail : {
		margin: '0.25rem',
		whiteSpace: 'nowrap'
	},
	thumbnailActive : {
		border: '0.125rem solid',
		borderColor: theme.palette.primary.main,
		margin: '0.25rem',
		whiteSpace: 'nowrap'
	},
}));

const Thumbnails = (props) => {
	const {images, activeImageIndex, fetchImageData} = props
	const classes = useClasses()
	return (
		<Box style={{overflowY: 'hidden', overflowX: 'auto'}} display="flex">
			<Box display="flex">
				{images.map((thumb, i)=>
					<Card key={i} className={i === activeImageIndex ? classes.thumbnailActive : classes.thumbnail}>
						<CardActionArea onClick={() => fetchImageData(i)}>
							<CardMedia style={{height: 50, width: 50}} image={thumb.img_thumb_src}/>
						</CardActionArea>
					</Card>
				)}
			</Box>
		</Box>
	)
}


export default Thumbnails
