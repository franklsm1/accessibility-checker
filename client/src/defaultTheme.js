import { createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';

const defaultTheme = createMuiTheme({
    palette: {
        primary: blueGrey,
        secondary: green,
    },
    status: {
        danger: 'orange',
    },
});

export default defaultTheme;
