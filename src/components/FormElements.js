import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, CircularProgress, Divider, FormControl, FormHelperText, FormLabel, FormGroup, Grid, InputAdornment, MenuItem, Popover, Select, TextField, Typography, FormControlLabel, Radio, RadioGroup, Checkbox } from '@material-ui/core';
import MuiPhoneNumber from 'material-ui-phone-number';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ColorPalette, ColorButton } from 'material-ui-color';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const useStyles = makeStyles((theme) => ({
  formRoot: {
    padding: '1rem'
  },
  disabled:{
    opacity: '0.5'
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

export function FormRow({children, style}) {
  const classes = useStyles();
  let sizingProps = {xs: 12};
  let items = React.Children.count(children);
  let size = parseInt(12 / items);
  size = (size < 2)? 2 : size;
  sizingProps['md'] = size;
  sizingProps['sm'] = size;
  sizingProps['lg'] = size;

  return(
    <Grid container spacing={5} className={classes.formRow} style={style}>
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

export function CustomField({children}) {
  return (
  <div style={{marginTop: '0.25rem'}} className='MuiFormControl-root MuiTextField-root MuiFormControl-fullWidth'>
    <div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-fullWidth MuiInputBase-formControl">{children}
      <fieldset aria-hidden="true" className="PrivateNotchedOutline-root-174 MuiOutlinedInput-notchedOutline" style={{paddingLeft: '8px', top: 0}}><legend className="PrivateNotchedOutline-legend-175" style={{width: '0.01px'}}><span></span></legend></fieldset>
    </div>
  </div>);
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
    <Box style={{display: `${props.sideLabel? 'flex' : ''}`, marginTop: `${props.sideLabel? '0.9rem' : ''}`}}>
      <Box display="flex" style={{alignItems: `${props.sideLabel? 'center' : 'flex-end'}`, marginRight: `${props.sideLabel? '1.18rem' : ''}`}}>
        <FormLabel component={Box} required={props.required} className={classes.formLabel}>
          {props.label}
          {/* style={{opacity: `${props.sideLabel? '0' : '1'}`}} */}
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
      return (typeof value === 'object'? value?.length > 0 : (value !== null && value !== '' && typeof(value) !== 'undefined'));
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

export function FormInputText({InputIcon, errorMsg, required, onChange, label, sideLabel, readOnly, info, ...props}) {
  const classes = useStyles();

  return (
    <FormInput required={required} label={label} sideLabel={sideLabel} info={info}>
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

export function FormInputRadio({errorMsg, required, onChange, label, options, readOnly, disabled, labelKey='label', valueKey='value', ...props}) {
  const classes = useStyles();
  options = options || [];

  return (
    <FormInput required={required} label={label}>
      <FormControl error={Boolean(errorMsg)} fullWidth>
      <RadioGroup row
        aria-label={label}
        name={label}
        onChange={onChange}
        onBlur={onChange}
        variant="outlined"
        className={`${classes.formInput} ${Boolean(disabled) ? classes.disabled : ''}`}
        {...props}>
          {options.map((opt, index)=>{
            let label = '', value = '';

            if(typeof(opt) === 'string') {
              label = value = opt;
            } else {
              label = opt[labelKey];
              value = opt[valueKey];
            }
            return <FormControlLabel key={index} value={value} control={<Radio color="primary" 
            inputProps={{
              'data-label': label,
              'data-required': required,
              disabled: Boolean(disabled),
              readOnly: Boolean(readOnly)
            }} />} label={label} />
          })}
        </RadioGroup>
      <FormHelperText>{errorMsg}</FormHelperText>
      </FormControl>
    </FormInput>
  );
}

export function FormInputCheck({errorMsg, formData, required, onChange, label, options, readOnly, disabled, nameKey='name', labelKey='label', valueKey='value', checked = false, ...props}) {
  const classes = useStyles();
  options = options || [];

  return (
    <FormInput required={required} label={label}>
      <FormControl error={Boolean(errorMsg)}>
        <FormGroup aria-label="position" row>
        {options.map((opt, index)=>{
          let label = '', value = '', name = '';

          if(typeof(opt) === 'string') {
            name = label = value = opt;
          } else {
            name = opt[nameKey];
            label = opt[labelKey];
            value = opt[valueKey];
          }

          if(index > 0 && label === ''){
            return;
          }
          return <FormControlLabel key={index}
            control={<Checkbox
            checked={formData[name] === value}
            name={name}
            onChange={onChange}
            variant="outlined"
            className={`${classes.formInput} ${Boolean(disabled) ? classes.disabled : ''}`}
            {...props}
            />} label={label} />
          })}
          {options.length === 0 && <FormControlLabel
            control={<Checkbox
            checked={checked}
            onChange={onChange}
            variant="outlined"
            readOnly={Boolean(readOnly)}
            {...props}
            className={`${classes.formInput} ${Boolean(disabled) ? classes.disabled : ''}`}
            />} label={''} /> }
        </FormGroup>
        <FormHelperText>{errorMsg}</FormHelperText>
      </FormControl>
    </FormInput>
  );
}

export function FormInputSelect({
    errorMsg, required, onChange, label, options, firstEmpty=false, loading, multiple, hasSearch=false,
    labelKey='label', valueKey='value', ...props}) {
  const classes = useStyles();
  options = options || [];

  const noOptions = (options.length === 0);

  if(hasSearch ) {
    return (
      <FormInput required={required} label={label}>
        <FormControl error={Boolean(errorMsg)} fullWidth>
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
        <FormHelperText>{errorMsg}</FormHelperText>
        </FormControl>
      </FormInput>
    );
  }
  else {
    return (
      <FormInput required={required} label={label}>
        <FormControl error={Boolean(errorMsg)} fullWidth>
          <Select
            onChange={onChange}
            onBlur={onChange}
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