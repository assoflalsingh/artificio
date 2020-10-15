import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, FormLabel, Grid, InputAdornment, MenuItem, Popover, Select, TextField } from '@material-ui/core';
import MuiPhoneNumber from 'material-ui-phone-number';
import { ColorPalette, ColorButton } from 'material-ui-color';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles((theme) => ({
  formRoot: {
    padding: '1rem'
  },
  formRow: {
    paddingTop: '1rem',
  },
  formLabel: {
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary
  },
  formInput: {
    marginTop: '0.25rem'
  },
  img: {
    maxWidth: '100%',
    height: 'auto'
  }
}));


export function Form({children}) {
  return (
    <form noValidate autoComplete="off">
      {children}
    </form>
  );
}

export function FormRow({children}) {
  const classes = useStyles();
  let sizingProps = {xs: 12};
  let items = React.Children.count(children);
  if(items === 1) {
    sizingProps['md'] = 12;
    sizingProps['sm'] = 12;
    sizingProps['lg'] = 12;
  } else {
    sizingProps['md'] = 6;
    sizingProps['sm'] = 6;
    sizingProps['lg'] = 6;
  }

  return(
    <Grid container spacing={5} className={classes.formRow}>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, sizingProps);
      })}
    </Grid>
  );
}

export function FormRowItem({children, ...props}) {
  return (
    <Grid item {...props}>
      {children}
    </Grid>
  );
}


function FormColorPalette({className, value, onChange}) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  onChange = onChange || (()=>{});
  const palette = {
    red: '#ff0000',
    blue: '#0000ff',
    green: '#00ff00',
    // yellow: 'yellow',
    // cyan: 'cyan',
    // lime: 'lime',
    // gray: 'gray',
    // orange: 'orange',
    // purple: 'purple',
    // black: 'black',
    // white: 'white',
    // pink: 'pink',
    // darkblue: 'darkblue',
  };
  return (
    <>
      <Popover
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={Boolean(anchorEl)}
        onClose={()=>setOpen(false)}
        anchorEl={anchorEl}
      >
        <ColorPalette palette={palette} onSelect={(k, v)=>{
          onChange(v);
          setAnchorEl(null);
        }}/>
      </Popover>
      <ColorButton className={className} color={value} onClick={(e)=>setAnchorEl(e.target)}
        style={{boxShadow: 'none'}}
      />
    </>
  )
}

export function FormInput({children, ...props}) {
  const classes = useStyles();
  return (
    <Box>
      <FormLabel component={Box} required={props.required} className={classes.formLabel}>{props.label}</FormLabel>
      {children}
    </Box>
  );
}

function getDefaultValidator(name) {
  const VALIDATORS = {
    'required': (value)=>{
      return (value != null && value != '' && typeof(value) != 'undefined');
    }
  }

  return VALIDATORS[name] || (()=>true);
}

export function doValidation(value, validators, errorMessages) {
  let errMsg = '';
  validators = validators || [];
  errorMessages = errorMessages || [];

  for(let i=0; i<validators.length; i++) {
    let validator = validators[i];
    if(typeof(validator) === 'string') {
      validator = getDefaultValidator(validator);
    }
    if(!validator(value)) {
      errMsg = errorMessages[i] || 'Invalid';
      break;
    }
  }
  return errMsg;
}

export function FormInputText({InputIcon, errorMsg, required, onChange, label, ...props}) {
  const classes = useStyles();

  return (
    <FormInput required={required} label={label}>
      <TextField
        variant="outlined"
        InputProps={{
          startAdornment: InputIcon && <InputAdornment position="start"><InputIcon fontSize='small' /></InputAdornment>,
        }}
        helperText={errorMsg}
        fullWidth
        className={classes.formInput}
        error={Boolean(errorMsg)}
        data-label={label}
        data-required={required}
        inputProps={{
          'data-label': label,
          'data-required': required
        }}
        onChange={onChange}
        onBlur={onChange}
        {...props}
      />
    </FormInput>
  );
}

export function FormInputPhoneNo({InputIcon, errorMsg, required, onChange, label, ...props}) {
  const classes = useStyles();

  return (
    <FormInput required={required} label={label}>
      <MuiPhoneNumber
        variant="outlined"
        helperText={errorMsg}
        fullWidth
        className={classes.formInput}
        error={Boolean(errorMsg)}
        data-label={label}
        data-required={required}
        inputProps={{
          'data-label': label,
          'data-required': required
        }}
        onChange={onChange}
        {...props}
      />
    </FormInput>
  );
}

export function FormInputSelect({
    errorMsg, required, onChange, label, options, firstEmpty=false, loading, multiple, ...props}) {
  const classes = useStyles();
  const noOptions = (options.length == 0);
  options = options || [];

  if(multiple) {
    return (
      <FormInput required={required} label={label}>
        <Autocomplete
          multiple
          options={options}
          loading={loading}
          filterSelectedOptions
          onChange={onChange}
          className={classes.formInput}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label=""
            />
          )}
          ChipProps={{
            variant:"outlined",
          }}
          {...props}
        />
      </FormInput>
    );
  } else {
    return (
      <FormInput required={required} label={label}>
        <Select
          onChange={onChange}
          variant="outlined"
          className={classes.formInput}
          fullWidth
          {...props}
        >
          {noOptions && <MenuItem value=''><em>{loading ? 'Loading...' : 'None'}</em></MenuItem>}
          {!noOptions && firstEmpty && <MenuItem value=""><em>None</em></MenuItem>}
          {options.map((opt)=>{
            let label = '', value = '';

            if(typeof(opt) === 'string') {
              label = value = opt;
            } else {
              label = opt.label;
              value = opt.value;
            }
            return  <MenuItem key={value} value={value}>{label}</MenuItem>
          })}
        </Select>
      </FormInput>
    );
  }
}

export function FormInputColor({
    errorMsg, required, onChange, label, value}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const palette = {
    C1: "#FF6633",
    C2: "#FFB399",
    C3: "#FF33FF",
    C4: "#FFFF99",
    C5: "#00B3E6",
    C6: "#E6B333",
    C7: "#3366E6",
    C8: "#999966",
    C9: "#99FF99",
    C10: "#B34D4D",
    C11: "#80B300",
    C12: "#809900",
    C13: "#E6B3B3",
    C14: "#6680B3",
    C15: "#66991A",
    C16: "#FF99E6",
    C17: "#CCFF1A",
    C18: "#FF1A66",
    C19: "#E6331A",
    C20: "#33FFCC",
    C21: "#66994D",
    C22: "#B366CC",
    C23: "#4D8000",
    C24: "#B33300",
    C25: "#CC80CC",
    C26: "#66664D",
    C27: "#991AFF",
    C28: "#E666FF",
    C29: "#4DB3FF",
    C30: "#1AB399",
    C31: "#E666B3",
    C32: "#33991A",
    C33: "#CC9999",
    C34: "#B3B31A",
    C35: "#00E680",
    C36: "#4D8066",
    C37: "#809980",
    C38: "#E6FF80",
    C39: "#1AFF33",
    C40: "#999933",
    C41: "#FF3380",
    C42: "#CCCC00",
    C43: "#66E64D",
    C44: "#4D80CC",
    C45: "#9900B3",
    C46: "#E64D66",
    C47: "#4DB380",
    C48: "#FF4D4D",
    C49: "#99E6E6",
  };

  onChange = onChange || (()=>{});

  return (
    <FormInput required={required} label={label}>
      <Popover
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={Boolean(anchorEl)}
        onClose={()=>setAnchorEl(null)}
        anchorEl={anchorEl}
        PaperProps={{
          style: {maxWidth: '200px'}
        }}
      >
        <ColorPalette palette={palette} onSelect={(k, v)=>{
          onChange(v);
          setAnchorEl(null);
        }}/>
      </Popover>
      <ColorButton disableRipple className={classes.formInput} color={value} onClick={(e)=>setAnchorEl(e.target)}
      />
    </FormInput>
  );
}