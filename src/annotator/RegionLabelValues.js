import React from 'react';
import { Box, makeStyles } from "@material-ui/core";
import CommonTabs from '../components/CommonTabs';
import { FormInputText } from '../components/FormElements';

function LabelValues({regions}) {
  return (
    <>
      {regions && regions.filter(r=>r.cls).map((region, i)=>{
        return <>
          <FormInputText label={region.cls} />
          {/* <Box key={i} style={{border: '1px solid', borderColor: region.color}}>{region.cls}</Box> */}
        </>
      })}
    </>
  )
}


const useStyles = makeStyles(()=>({
  root: {
    padding: '0.5rem',
  }
}));
export function RegionLabelValues({regions}) {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Box>
        LABEL/ANNOTATION
      </Box>
      <CommonTabs tabs={
        {
          "Custom OCR": <LabelValues regions={regions} />,
          "Optimal OCR": <h4>Under construction</h4>,
        }
      }/>
    </Box>
  );
}