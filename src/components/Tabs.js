import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import QuickLoad  from './QuickLoad';
import React, { useEffect } from 'react'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


const bold = <span style={{fontWeight:'bold'}}>Dashboard</span>;


export default () => (
    <div>
     <Card  variant="outlined" style={{marginTop:'2%',marginBottom:'2%'}}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
            {bold}  {'>'} Data Extraction 
        </Typography>
    </CardContent>
    </Card>
    <Tabs>
      <TabList>
        <Tab>Quick Start</Tab>
        <Tab>Create Data Set</Tab>
        <Tab>Data List</Tab>
        <Tab>Results</Tab>
      </TabList>
   
      <TabPanel>
        <QuickLoad/>
      </TabPanel>
      <TabPanel>
        <h2>Any content 2</h2>
      </TabPanel>
    </Tabs>
    </div>
  );