import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import { CardContent } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import AxeReport from './AxeReport';

const styles = () => ({
    root: {
        flexGrow: 1,
    },
    appbar: {
        alignItems: 'center',
        backgroundColor: '#0033a0',
    },
    card: {
        textAlign: 'center',
        padding: '1rem',
    },
    textField: {
        width: '80%',
    },
});


// eslint-disable-next-line react/prop-types
const App = ({ classes }) => {
    const [report, setReport] = useState('nothing checked yet');
    const [host, setHost] = useState('');

    const checkAccessibility = () => {
        setReport('Analyzing Page...');

        fetch(`/ada?host=${host}`)
            .then(response => response.json())
            .then((responseText) => {
                setReport(<AxeReport results={responseText} />);
            })
            .catch(() => {
                setReport('There was an error loading Page, please double check the URL');
            });
    };

    return (
        <div className={classes.root}>
            <AppBar className={classes.appbar} position="static">
                <Toolbar>
                    <Typography variant="h6">
                        Accessibility Checker UI
                    </Typography>
                </Toolbar>
            </AppBar>
            <Grid
                style={{ marginTop: '1rem' }}
                container
                direction="column"
                spacing={3}
                justify="center"
                alignItems="center"
            >
                <Grid item style={{ minWidth: '700px' }}>
                    <Card variant="outlined" className={classes.card}>
                        <CardContent>
                            <Grid container direction="column" spacing={3}>
                                <Grid item>
                                    <Typography variant="subtitle1">
                                        Make all selections and submit to check connectivity
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="hostInput"
                                        className={classes.textField}
                                        label="Host"
                                        placeholder="host"
                                        value={host}
                                        onChange={(event => setHost(event.target.value))}
                                    />
                                </Grid>
                                <Grid item>
                                    <Button id="checkAccessibility" variant="contained" onClick={checkAccessibility}>
                                Check Connection
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <div>
                                        {report}
                                    </div>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default withStyles(styles)(App);
