import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Paper, Tab, Tabs } from '@material-ui/core';


function TabPanel({children, className, value, index}) {
  return (
    <Paper hidden={value !== index} style={{height: '100%'}} className={className}>{value === index && children}</Paper>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default function CommonTabs({tabs, panelClasses}) {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box className={classes.root}>
      <Tabs value={tabIndex} onChange={handleChange}>
        {
          Object.keys(tabs).map((key)=>{
            return <Tab label={key} key={key} />
          })
        }
      </Tabs>
      {
        Object.values(tabs).map((comp, i)=>{
          return (
            <TabPanel value={tabIndex} index={i} key={i} className={panelClasses}>
              {comp}
            </TabPanel>
          )
        })
      }
    </Box>
  );
}