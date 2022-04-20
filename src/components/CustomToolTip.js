import React from 'react';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);

export default function CustomToolTip(props) {
  const [open, setOpen] = React.useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
    <div>
    <HtmlTooltip
        title={
          <React.Fragment>
            <Typography color="inherit">{props.toolTipTitle}</Typography>
            {props.toolTipDesc}
          </React.Fragment>
        }
      >
        <Button style={{margin: "25px 15px",fontWeight: "bold"}}>{props.toolTipLabel} <HelpOutlineIcon /></Button>
      </HtmlTooltip>
    </div>
    </ClickAwayListener>
  );
}
