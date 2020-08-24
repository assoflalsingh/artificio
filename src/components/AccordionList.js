import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

export default function AccordionList() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Ai App Store</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            item 1
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>Create Model</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            item2
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>Annotation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
             OCR Extraction
          </Typography>
        </AccordionDetails>
        <AccordionDetails>
          <Typography>
            Text Data
          </Typography>
        </AccordionDetails>
        <AccordionDetails>
          <Typography>
            Image Data 
          </Typography>
        </AccordionDetails>
        <AccordionDetails>
          <Typography>
            Audio Data
          </Typography>
        </AccordionDetails>
        <AccordionDetails>
          <Typography>
            Vedio Data
          </Typography>
        </AccordionDetails>
        <AccordionDetails>
          <Typography>
            3D,2D Data
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

