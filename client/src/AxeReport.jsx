import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
    table: {},
    tableContainer: {},
    elementListButton: {
        padding: '0.25rem',
        fontSize: '0.6rem',
    },
});

// eslint-disable-next-line react/prop-types
const AxeReport = ({ results }) => {
    const classes = useStyles();
    const { violations } = results;
    if (violations.length === 0) {
        return <p style={{ color: 'green' }}> 0 violations found!</p>;
    }
    let totalIssueCount = 0;
    const violationReports = violations.map((violation) => {
        const [showElements, setShowElements] = useState(false);
        const toggleShowElements = () => setShowElements(!showElements);
        const buttonVerbiage = showElements ? 'Hide List' : 'Show List';
        const violationValues = {
            impact: violation.impact,
            help: violation.help,
            bestPractice: violation.tags.indexOf('best-practice') !== -1,
            helpUrl: violation.helpUrl,
            count: violation.nodes.length,
        };
        totalIssueCount += violation.nodes.length;
        return (
            <TableRow key={violationValues.impact}>
                <TableCell>
                    <code>{violationValues.help}</code>
                </TableCell>
                <TableCell align="center">
                    <a
                        href={violationValues.helpUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
            Link
                    </a>
                </TableCell>
                <TableCell align="center">
                    <Button
                        className={classes.elementListButton}
                        variant="contained"
                        color="primary"
                        onClick={toggleShowElements}
                    >
                        {buttonVerbiage}
                    </Button>
                    <br />
                    {showElements
            && violation.nodes.map(node => (
                <div>
                    <code>{node.html}</code>
                    <br />
                </div>
            ))}
                </TableCell>
                <TableCell align="center">{violationValues.count}</TableCell>
                <TableCell align="center">{violationValues.impact}</TableCell>
            </TableRow>
        );
    });

    return (
        <div>
            <Typography variant="h5" style={{ color: 'red' }}>
                {totalIssueCount} total violations found.
            </Typography>
            <TableContainer className={classes.tableContainer} component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell align="center">Violation Info</TableCell>
                            <TableCell align="center">Elements</TableCell>
                            <TableCell align="center">Count</TableCell>
                            <TableCell align="center">Severity</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{violationReports}</TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default AxeReport;
