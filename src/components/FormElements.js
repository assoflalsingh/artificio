import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, CircularProgress, Divider, FormControl, FormHelperText, FormLabel, Grid, InputAdornment, MenuItem, Popover, Select, TextField, Typography } from '@material-ui/core';
import MuiPhoneNumber from 'material-ui-phone-number';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ColorPalette, ColorButton } from 'material-ui-color';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

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
  },
  info: {
    color: theme.palette.info.main,
    marginLeft: '0.25rem',
    fontSize: '1.2rem',
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

export function FormInput({children, info, ...props}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <Box>
      <Box display="flex" style={{alignItems: 'flex-end'}}>
        <FormLabel component={Box} required={props.required} className={classes.formLabel}>
          {props.label}
        </FormLabel>
          {info &&
            <>
            <HelpOutlineIcon className={classes.info} onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}/>
            <Popover
              style={{pointerEvents: 'none'}}
              open={open}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'center',
                horizontal: 'left',
              }}
              onClose={handlePopoverClose}
              disableRestoreFocus
            >
              {info}
            </Popover>
            </>
          }
      </Box>
      {children}
    </Box>
  );
}

function getDefaultValidator(name) {
  const VALIDATORS = {
    'required': (value)=>{
      return (value != null && value != '' && typeof(value) != 'undefined');
    },
    'email': (value)=>{
      return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(value);
    },
    'password': (value)=>{
      return /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{8,40})/.test(value);
    },
    'regex': (value, exp)=>{
      const checker = new RegExp(exp);
      return checker.test(value);
    }
  }

  return VALIDATORS[name] || (()=>true);
}

export function doValidation(value, validators, errorMessages) {
  let errMsg = '';
  let validatorParam = null;
  validators = validators || [];
  errorMessages = errorMessages || [];

  for(let i=0; i<validators.length; i++) {
    let validator = validators[i];
    if(typeof(validator) === 'string') {
      validator = getDefaultValidator(validator);
    } else if(typeof(validator) === 'object') {
      validatorParam = validator.param;
      validator = getDefaultValidator(validator.type);
    }

    if(!validator(value, validatorParam)) {
      errMsg = errorMessages[i] || 'Invalid';
      break;
    }
  }
  return errMsg;
}

export function FormInputText({InputIcon, errorMsg, required, onChange, label, readOnly, info, ...props}) {
  const classes = useStyles();

  return (
    <FormInput required={required} label={label} info={info}>
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
          'data-required': required,
          readOnly: Boolean(readOnly)
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
        onBlur={onChange}
        {...props}
      />
    </FormInput>
  );
}

export function FormInputSelect({
    errorMsg, required, onChange, label, options, firstEmpty=false, loading, multiple, hasSearch=false,
    labelKey='label', valueKey='value', ...props}) {
  const classes = useStyles();
  options = options || [];

  const noOptions = (options.length == 0);

  if(hasSearch) {
    return (
      <FormInput required={required} label={label}>
        <Autocomplete
          multiple={multiple}
          options={options}
          loading={loading}
          filterSelectedOptions
          onChange={onChange}
          className={classes.formInput}
          getOptionLabel={(option) => typeof(option) === 'string' ? option : option[labelKey]}
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
        <FormControl error={Boolean(errorMsg)} fullWidth>
          <Select
            onChange={onChange}
            onBlur={onChange}
            variant="outlined"
            className={classes.formInput}
            fullWidth
            helperText={errorMsg}
            {...props}
          >
            {noOptions && <MenuItem value=''><em>{loading ? 'Loading...' : 'None'}</em></MenuItem>}
            {!noOptions && firstEmpty && <MenuItem value=""><em>None</em></MenuItem>}
            {options.map((opt)=>{
              let label = '', value = '';

              if(typeof(opt) === 'string') {
                label = value = opt;
              } else {
                label = opt[labelKey];
                value = opt[valueKey];
              }
              return  <MenuItem key={value} value={value}>{label}</MenuItem>
            })}
          </Select>
          <FormHelperText>{errorMsg}</FormHelperText>
        </FormControl>
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

export function FormHeader({title, hasTopDivider, loadingText}) {
  return (
    <>
      {hasTopDivider && <Divider style={{marginTop: '1rem', marginBottom: '1rem'}} variant="middle" />}
      <Box display="flex">
      <Typography variant="h6" color="primary">{title}</Typography>
      {loadingText &&
      <>
      <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} />
      <Typography style={{alignSelf:'center'}}>&nbsp;{loadingText}</Typography>
      </>}
      </Box>
    </>
  );
}

export function PasswordPolicy() {
  return (
    <Box style={{padding: '0.5rem'}}>
      <Typography>
      * Must contain one digit from 0-9<br/>
      * Must contain one lowercase characters<br/>
      * Must contain one uppercase characters<br/>
      * Must contain one special symbols in the list "@#$%"<br/>
      * Length at least 8 characters and maximum of 40<br/>
      </Typography>
    </Box>
  )
}