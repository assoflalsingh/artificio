import React from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import NunitoRegular from '../assets/fonts/Nunito-Regular.ttf';

const nunito = {
  fontFamily: 'Nunito',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
    local('Nunito'),
    local('Nunito-Regular'),
    url(${NunitoRegular}) format('truetype')
  `,
};


const defaultTheme = createTheme();
defaultTheme.shadows[1] = '0px 2px 1px -1px rgba(57, 63, 77,0.2),0px 1px 1px 0px rgba(57, 63, 77,0.14),0px 1px 3px 0px rgba(57, 63, 77,0.12)';

const globalTheme = createTheme({
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
        info: {
          main: '#ffb600',
          dark: '#dea414'
        },
        grey: {
          200: '#eff0f0',
        },
        default: {
          main: defaultTheme.palette.common.white,
        },
        background: {
          default: '#f9fafc',
          disabled: '#f0f2f7',
        },
        text: {
          primary: '#383838',
          secondary: '#737373'
        }
    },
    transitions: {
      duration: {
        shortest: 100,
        shorter: 150,
        short: 200,
        standard: 200,
        complex: 300,
        enteringScreen: 150,
        leavingScreen: 175,
      }
    },
    shadows: defaultTheme.shadows,
    spacing: factor => `${0.25 * factor}rem`,
    typography: {
      htmlFontSize: 16,
      fontFamily: ["Nunito", "Arial", "sans-serif"].join(','),
      fontSize: 14,
    }
});

const theme = createTheme({
    typography: {
      ...globalTheme.typography,
    },
    overrides: {
        MuiCssBaseline: {
          '@global': {
            '@font-face': [nunito],
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
          input: {
            borderRadius: 'inherit',
            '&[readonly]': {
              backgroundColor: globalTheme.palette.background.disabled
            }
          }
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
            borderRadius: '3.5rem',
            textTransform: 'none',
            padding: '0.5rem 2rem',
            fontWeight: 'inherit',
          },
          contained: {
            boxShadow: 'none',
          },
          outlined: {
            padding: '0.5rem 2rem',
          },
          startIcon: {
            marginRight: '0.25rem'
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
            minWidth: 0,
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
              boxShadow: globalTheme.shadows[1],
              fontWeight: 'bold'
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
            padding: '0.5rem'
          }
        },
        MuiDialogContent: {
          root: {
            padding: '0.5rem 1rem',
            minWidth: '600px',
          }
        },
        MuiFormLabel: {
          root: {
            fontSize: '0.875rem',
          },
          asterisk: {
            fontSize: '0.8em',
            color: globalTheme.palette.error.main,
          }
        },
        MuiFormControlLabel: {
          root: {
            marginLeft: 0
          }
        },
        MuiAutocomplete: {
          inputRoot: {
            '&[class*="MuiOutlinedInput-root"]': {
              padding: '0.125rem',
            }
          },
          input: {
            '&:first-child': {
              padding: '0.75rem 1.5rem',
            }
          }
        },
        MuiBackdrop: {
          root: {
            color: '#fff'
          }
        },
        MUIDataTable: {
          responsiveScroll: {
            maxHeight: 'none',
          },
        },
        MuiTableCell: {
          head: {
            fontWeight: 'bold'
          }
        }
    }
}, globalTheme);

export const DMUploaderCustomTheme = createTheme({
  typography: {
    ...globalTheme.typography,
  },
  overrides: {
      MuiDropzoneArea: {
        root: {
          minHeight: 150,
          maxHeight: 150,
          borderRadius: '0.125rem',
          borderColor: globalTheme.palette.primary.main,
          backgroundColor: globalTheme.palette.primary.light,
          width: '100%',
          margin: '2rem 0rem'
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
          padding: '0.5rem'
        }
      },
      MuiDialogContent: {
        root: {
          padding: '0.5rem 1rem',
          minWidth: '600px',
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