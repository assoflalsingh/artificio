import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import HelveticaRegular from '../assets/fonts/HelveticaNowDisplay-Regular.ttf';

const helvetica = {
  fontFamily: 'Helvetica',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
    url(${HelveticaRegular}) format('truetype')
  `,
};

const defaultTheme = createMuiTheme();
defaultTheme.shadows[1] = '0px 2px 1px -1px rgba(57, 63, 77,0.2),0px 1px 1px 0px rgba(57, 63, 77,0.14),0px 1px 3px 0px rgba(57, 63, 77,0.12)';

const globalTheme = createMuiTheme({
    palette: {
        primary: {
            main: '#0575ce',
            light: '#eff8fe',
        },
        secondary: {
          main: '#04b66d',
          contrastText: '#fff',
        },
        success: {
          main: '#04b66d',
        },
        grey: {
          200: '#eff0f0',
        },
        default: {
          main: defaultTheme.palette.common.white,
        },
        background: {
          default: '#f9fafc'
        },
        text: {
          primary: '#383838',
          secondary: '#737373'
        }
    },
    shadows: defaultTheme.shadows,
    spacing: factor => `${0.25 * factor}rem`,
});

const theme = createMuiTheme({
    typography: {
      // fontFamily: ['Helvetica', 'Arial'].join(','),
      fontSize: 14,
    },
    overrides: {
        MuiCssBaseline: {
          '@global': {
            html: {
              margin: 0,
            },
            body: {
              margin: 0,
              position: 'absolute',
              height: '100%',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0
            },
            '#root': {
              height: '100%',
            },
          },
        },
        MuiInputBase:{
          root: {
            backgroundColor: globalTheme.palette.default.main,
          },
        },
        MuiListItemIcon :{
          root: {
            minWidth: '40px',
          }
        },
        MuiOutlinedInput: {
          root: {
            borderRadius: '0.5rem',
          },
          input: {
            padding: '0.75rem 1.5rem',
          },
          adornedStart: {
            paddingLeft: '0.5rem',
          }
        },
        MuiButton: {
          root: {
            borderRadius: '0.5rem',
            textTransform: 'none',
            padding: '0.5rem 0.75rem',
            fontWeight: 'inherit',
            padding: '0.5rem 0.75rem',
          },
          contained: {
            boxShadow: 'none',
          },
          outlined: {
            padding: '0.5rem 0.75rem',
          }
        },
        MuiButtonGroup: {
          root: {
            '& .MuiButton-root': {
              borderRadius: '2rem',
            }
          }
        },
        MuiPaper: {
          rounded: {
            borderRadius: '0.25rem',
          }
        },
        MuiTabs: {
          root: {
            minHeight: '2.5rem',
          },
          indicator: {
            display: 'none',
          }
        },
        MuiTab: {
          root: {
            borderTopLeftRadius: '1rem',
            borderTopRightRadius: '1rem',
            marginRight: '0.75rem',
            minHeight: '2.5rem',
          },
          textColorInherit: {
            textTransform: 'none',
            color: globalTheme.palette.primary.contrastText,
            backgroundColor: globalTheme.palette.primary.main,
            opacity: 1,
            '&.Mui-selected': {
              border: 'none',
              color: globalTheme.palette.primary.main,
              backgroundColor: globalTheme.palette.primary.contrastText,
              boxShadow: globalTheme.shadows[1]
            }
          }
        },
        MuiTypography: {
          body1: {
            fontSize: globalTheme.typography.fontSize,
          },
        },
        MuiDropzoneArea: {
          root: {
            minHeight: 'unset',
            borderRadius: '0.125rem',
            borderColor: globalTheme.palette.primary.main,
            backgroundColor: globalTheme.palette.primary.light,
            width: '50%',
            margin: '2rem 0rem'
          },
          icon: {
            display: 'none',
          },
          text: {
            fontSize: globalTheme.typography.fontSize,
            fontFamily: globalTheme.typography.fontFamily,
            margin: '0.75rem 5rem'
          }
        },
        MuiDropzonePreviewList: {
          root: {
            margin: '0rem',
          }
        },
        MuiDialogTitle: {
          root: {
            padding: '1rem'
          }
        },
        MuiDialogContent: {
          root: {
            padding: '0.5rem 1rem',
            minWidth: '600px',
          }
        },
        MuiFormLabel: {
          asterisk: {
            fontSize: '0.8em',
            color: globalTheme.palette.error.main,
          }
        },
        MuiFormControlLabel: {
          root: {
            marginLeft: 0
          }
        }
    }
}, globalTheme);

export default function Theme(props) {
    return (
        <ThemeProvider theme={theme}>
            {props.children}
        </ThemeProvider>
    )
}