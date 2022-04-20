import React, { useEffect, useState } from 'react';
import {RefreshIconButton} from './CustomButtons';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, MenuItem, Typography } from '@material-ui/core';
import TextField from "@material-ui/core/TextField";
import FormControl from '@material-ui/core/FormControl';
import IconButton from "@material-ui/core/IconButton";
import FilterListTwoToneIcon from '@material-ui/icons/FilterListTwoTone';
import Select from '@material-ui/core/Select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const useStyles = makeStyles((theme) => ({
    contentColumn: {
      textAlign: "center",
      border: "solid 1px gray",
      borderRadius: "10px",
      height: "40px",
      padding: "0px",
      fontSize: "18px",
      maxWidth: "120px"
    },
    headingColumn:{
      height: "50px",
      color: "gray",
      fontSize: "18px",
      fontWeight: "bold"
    },
    noBorder: {
      border: "none"
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    dateSelector: {
      cursor: "pointer",
      width: 90,
      height: 40,
      margin: 5
    }
  }));
  
export default function TableFilterPanel(props) {
    const [selectedFilters, updateSelectedFilters] = useState({});
    const [sortedColumns, setSortedColumns] = useState([]);
    const [selectedFiltersCount,updateSelectedFiltersCount ] = useState(0);
    const [showFilterPanel, setFilterPanelDisplay] = useState(false);
    const [comparisonOptions] = useState([
      {
        name: "Greater than",
        value: "gt",
      },
      {
        name: "Lesser than",
        value: "lt",
      },
      {
        name: "Equals to",
        value: "eq",
      },
      {
        name: "Contains",
        value: "ct",
      },
      {
        name: "Begins with",
        value: "bw",
      },
      {
        name: "Ends with",
        value: "ew",
      },
      {
        name: "Date Range",
        value: "drange",
      },
    ]);
    
    useEffect(() => {
      let coloumnDetails = props.coloumnDetails.sort(function(a, b){  
        return -(Object.keys(selectedFilters).indexOf(a.name) - Object.keys(selectedFilters).indexOf(b.name));
      });
      setSortedColumns(coloumnDetails)
      }, []);
    useEffect( () => {
      updateSelectedFiltersCount(0);
      updateSelectedFilters({});
    }, [props.refreshCounter])

    const updateFilters = (event,label,type)=> {
    let filtersToUpdate = selectedFilters;
    let {name, value} = event.target;
    filtersToUpdate[label] = filtersToUpdate[label] || {};
    filtersToUpdate[label][name] = value;
    if(typeof filtersToUpdate[label]["fieldValue"] === "object") {
      filtersToUpdate[label]["fieldValue"] = "";
    }
    filtersToUpdate[label]["type"] = type;
    filtersToUpdate[label]["comparison"] = (name==="comparison") ? value : (!filtersToUpdate[label]["comparison"]) ? (label==="timestamp" ? "gt" :"eq") : filtersToUpdate[label]["comparison"];
    updateSelectedFilters(prevState => ({
      ...prevState,           
      ...filtersToUpdate
    }));
  }
  
  const updateFiltersWithDateRange = (selectedDate, label,dateType) => {
    let filtersToUpdate = selectedFilters;
    filtersToUpdate[label] = filtersToUpdate[label] || {};
    filtersToUpdate[label]["fieldValue"] = Object.assign({}, filtersToUpdate[label]["fieldValue"],{
      [dateType]: selectedDate
    })
    filtersToUpdate[label]["type"] = "datetime";
    filtersToUpdate[label]["comparison"]="drange";
    updateSelectedFilters(prevState => ({
      ...prevState,           
      ...filtersToUpdate
    }));

  }

  const resetFilter = (label) => {
    let filtersToUpdate = selectedFilters;
    if(filtersToUpdate[label]) delete filtersToUpdate[label];
    updateSelectedFilters(prevState => ({
      ...prevState,           
      ...filtersToUpdate
    }));
  }

  const onFilterApply = (selectedFilters)=> {
    let selectedFiltersCount = Object.values(selectedFilters).reduce((count, element)=> {if(element.fieldValue)count+=1; return count}, 0)
    updateSelectedFiltersCount(selectedFiltersCount);
    let filteredResult = [];
    if(selectedFilters) {
      props.unFilteredData && props.unFilteredData.forEach((datum)=> {
        let isValidData = true;
        Object.keys(selectedFilters).forEach((filterKey)=> {
          let desiredValue, toDate, fromDate, availableValue;
          if(typeof selectedFilters[filterKey]["fieldValue"] === "object") {
            toDate = Date.parse(selectedFilters[filterKey]["fieldValue"].toDate);
            fromDate = Date.parse(selectedFilters[filterKey]["fieldValue"].fromDate);
            availableValue = Date.parse(datum[filterKey]);
          }
          else{
            desiredValue = selectedFilters[filterKey]["fieldValue"] && selectedFilters[filterKey]["fieldValue"]?.toLowerCase();
            availableValue = datum[filterKey]?.toLowerCase();
          }
          if(datum[filterKey])
          {
           switch (true) {
             case (isValidData && selectedFilters[filterKey]["comparison"] ==="eq" && desiredValue && availableValue !== desiredValue):       
                    isValidData = false
             break;
             case (isValidData && selectedFilters[filterKey]["comparison"] ==="ct" && desiredValue && !availableValue.includes(desiredValue)):       
                    isValidData = false
             break;
             case (isValidData && selectedFilters[filterKey]["comparison"] ==="bw" && desiredValue && !availableValue.startsWith(desiredValue)):
                    isValidData = false
             break;
             case (isValidData && selectedFilters[filterKey]["comparison"] ==="ew" && desiredValue && !availableValue.endsWith(desiredValue)):
                    isValidData = false
             break;
             case (isValidData && selectedFilters[filterKey]["comparison"] ==="gt" && desiredValue && selectedFilters[filterKey]["type"]==="datetime" && Date.parse(availableValue) <= Date.parse(desiredValue)):
                    isValidData = false
             break;
             case (isValidData && selectedFilters[filterKey]["comparison"] ==="lt" && desiredValue && selectedFilters[filterKey]["type"]==="datetime" && Date.parse(availableValue) >= Date.parse(desiredValue)):       
                    isValidData = false
             break;
             case (isValidData && selectedFilters[filterKey]["comparison"] ==="gt" && desiredValue && selectedFilters[filterKey]["type"]!=="datetime" && availableValue <= desiredValue):
                    isValidData = false
             break;
             case (isValidData && selectedFilters[filterKey]["comparison"] ==="lt" && desiredValue && selectedFilters[filterKey]["type"]!=="datetime" && availableValue > desiredValue):       
                    isValidData = false
             break;
             case (isValidData && selectedFilters[filterKey]["comparison"] ==="drange" && selectedFilters[filterKey]["type"]==="datetime" && !(availableValue >=fromDate && availableValue <= toDate)):       
                    isValidData = false
             break;
             default: 
                console.log("no filter applicable..") 
           }
          }
          else{
            isValidData = false
          }
        })
        if(isValidData){
          filteredResult.push(datum)
        }
      })
    }
    props.onApplyFilter(filteredResult)
  }

    const classes = useStyles();
    let {disabled, onResetAllFilters} = props;
    return (
        <>
        <Button disabled= {disabled} variant='outlined' style={{height: '2rem', marginLeft:10, padding: '0px 38px'}} size="small" onClick={()=>setFilterPanelDisplay(true)}>
          <IconButton
                style={{ width: 22, height: 22 }}
                size="small"
                variant="outlined"
              >
                <span style={{fontSize : 14}}>Filter</span>
                {selectedFiltersCount ? <span style={{marginLeft:5,background:"#0575ce", color:"white",fontWeight:"bold",borderRadius:8,fontSize:14,marginTop:-8, padding: "2px 4px"}}>{`${selectedFiltersCount}`}</span> : <></>}
                <FilterListTwoToneIcon style={{ width: 20, height: 30, marginLeft:10 , marginTop: 2 }} />
              </IconButton>
            </Button>
    <Dialog disableBackdropClick disableEscapeKeyDown open={showFilterPanel} scroll={"paper"} onClose={()=>setFilterPanelDisplay(false)} maxWidth="md" fullWidth={true}>
      <DialogContent>
      <Typography variant='h5'>Apply Filters</Typography>
        <table style={{width: '100%', margin: "20px 0px"}}>
          <tr className="header-rows">
            <th className={classes.headingColumn}>Column Name</th>
            <th>Filter</th>
            <th>Value</th>
            <th>Reset</th>
          </tr>
          {
            sortedColumns.map((element, index)=> {
              return (
              <tr key={index}>
                <td className={classes.contentColumn}>{element.label}</td>
                <td className={`${classes.contentColumn} ${classes.noBorder}`}>
                <FormControl variant="filled" className={classes.formControl}>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={selectedFilters[element.name]?.comparison || (element.type==="datetime" ? "gt" : "eq")}
                    name="comparison"
                    onChange={(event)=>updateFilters(event,element.name, element.type)}
                  > 
                    {
                      comparisonOptions.map((comparison, index)=> (element.possibleComparisons.indexOf(comparison.value) > -1) && <MenuItem value={comparison.value}>{comparison.name}</MenuItem>)
                    }
                  </Select>
                </FormControl>
                </td>
                <td className={`${classes.contentColumn} ${classes.noBorder}`}>
                {(element.type==="datetime" && selectedFilters[element.name]?.comparison==="drange") ? 
                <>
                  <DatePicker className={`${classes.dateSelector}`} selected={selectedFilters[element.name]?.fieldValue?.fromDate } placeholderText="select date" onChange={date => updateFiltersWithDateRange(date,"timestamp","fromDate")} />
                  <DatePicker className={`${classes.dateSelector}`} selected={selectedFilters[element.name]?.fieldValue?.toDate } placeholderText="select date" onChange={date => updateFiltersWithDateRange(date,"timestamp", "toDate")} />
                </>
                :
                <TextField
                    placeholder= {element.name!=="timestamp" ? "Enter value.." : "mm/dd/yyyy hh:mm:ss"}
                    title = {element.name!=="timestamp" ? "Enter value.." : "mm/dd/yyyy hh:mm:ss"}
                    variant="outlined"
                    name="fieldValue"
                    onChange={(event)=>updateFilters(event,element.name, element.type)}
                    value={selectedFilters[element.name]?.fieldValue || ""}
                />}
                </td>
                <td className={`${classes.contentColumn} ${classes.noBorder}`}>
                  <RefreshIconButton className={classes.ml1} title="Reset filter value" label="" onClick={()=>{resetFilter(element.name)}}/>
                </td>
              </tr>
              )
            })
          }
        </table>
      </DialogContent>
      <DialogActions>
      <div style={{borderTop: "solid 1px gray", padding: "10px 20px" , width: "100%", textAlign: "right"}}>
      {Object.keys(selectedFilters).length > 0 &&  <Button onClick={()=> {setFilterPanelDisplay(false);onFilterApply(selectedFilters)}} color="primary">
          Apply filter
        </Button>}
        <Button onClick={()=>{setFilterPanelDisplay(false);updateSelectedFiltersCount(0);updateSelectedFilters({});onResetAllFilters()}} color="primary">
          Remove All Filters
        </Button>
        <Button onClick={()=>{setFilterPanelDisplay(false)}} color="primary">
          Cancel
        </Button>
      </div>
      </DialogActions>
    </Dialog>
        </>
            
    )
}