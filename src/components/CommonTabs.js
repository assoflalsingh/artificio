import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Paper, Tab, Tabs, Typography } from "@material-ui/core";

function TabPanel({ children, className, value, index }) {
  return (
    <Typography
      style={{ height: "100%" }}
      component="div"
      hidden={value !== index}
    >
      <Paper style={{ height: "100%" }} className={className}>
        {children}
      </Paper>
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
}));

export default function CommonTabs({
  tabs,
  panelClasses,
  hanldeTabChange,
  selectedTab,
}) {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    if (hanldeTabChange) {
      hanldeTabChange(newValue);
      setTabIndex(newValue);
    } else {
      setTabIndex(newValue);
    }
  };
  useEffect(() => {
    setTabIndex(selectedTab ?? tabIndex);
  }, [selectedTab, tabIndex]);

  return (
    <Box className={classes.root}>
      <Tabs value={tabIndex} onChange={handleChange}>
        {Object.keys(tabs).map((key) => {
          return (
            <Tab
              label={key}
              key={key}
              icon={tabs?.[key]?.icon}
              disabled={tabs?.[key]?.disabled}
            />
          );
        })}
      </Tabs>
      {Object.values(tabs).map((comp, i) => {
        comp = comp?.componentDetails ? comp.componentDetails : comp;
        return (
          <TabPanel value={tabIndex} index={i} key={i} className={panelClasses}>
            {comp}
          </TabPanel>
        );
      })}
    </Box>
  );
}
