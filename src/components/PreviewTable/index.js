import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ChipView from '../ChipView';


const CustomTableCell = withStyles(theme => ({
    head: {
        backgroundColor: '#01273C',
        color: theme.palette.common.white,
        fontSize: 14,
        textAlign: 'center',
    },
    body: {
        fontSize: 14,
        textAlign: 'left',
    },
}))(TableCell);

const styles = theme => ({
    root: {
        marginTop: theme.spacing(2) * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 450,
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
    cellWidth: {
        width: 130,
        padding: '4px 30px',
        borderRight: '0.5px solid #878787',
        borderBottom: '0.5px solid #878787',
    },
    timing: {
        borderBottom: '0.5px solid #878787',
    },
    leftIcon: {
        marginRight: theme.spacing(2),
    },
    infoBox: {
        borderBottom: '0.5px solid #878787',
        textAlign: 'right',
    },
    infoText: {
        fontSize: 16,
        textAlign: 'left',
    },
});

const dayMap = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
];

class PreviewTable extends React.Component {
    edit = () => {
        this.props.handleBack();
    };

    handleClose = () => {
        this.props.handleClose();
    }

    render() {
        const { classes, preference } = this.props;
        const preferred = new Map();
        Object.keys(preference).forEach(day => {
            preferred.set(day, preference[day].preferred);
        });
        return (
            <div className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell className={classes.cellWidth}>
                                Day
                            </CustomTableCell>
                            <CustomTableCell className={classes.cellWidth}>
                                Duration
                            </CustomTableCell>
                            <CustomTableCell className={classes.timing}>
                                TimeSlot
                            </CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dayMap.map(row => {
                            const hoursOnDay = preferred
                                .get(row)
                                .reduce((count, arr) => count + arr[1], 0);
                            return (
                                <TableRow key={row} className={classes.row}>
                                    <CustomTableCell
                                        component="th"
                                        scope="row"
                                        className={classes.cellWidth}
                                    >
                                        {row === 'MONDAY' && (
                                            'Monday'
                                        )}
                                        {row === 'TUESDAY' && (
                                            'Tuesday'
                                        )}
                                        {row === 'WEDNESDAY' && (
                                            'Wednesday'
                                        )}
                                        {row === 'THURSDAY' && (
                                            'Thursday'
                                        )}
                                        {row === 'FRIDAY' && (
                                            'Friday'
                                        )}
                                        {row === 'SATURDAY' && (
                                            'Saturday'
                                        )}
                                        {row === 'SUNDAY' && (
                                            'Sunday'
                                        )}
                                    </CustomTableCell>
                                    <CustomTableCell className={classes.cellWidth}>
                                        {hoursOnDay === 0
                                            ? '---'
                                            : hoursOnDay === 1
                                                ? `${hoursOnDay * 2} Hour`
                                                : `${hoursOnDay * 2} Hours`}
                                    </CustomTableCell>
                                    <CustomTableCell className={classes.timing}>
                                        {preferred.get(row) <= 0 ? (
                                            'No Slots Selected'
                                        ) : (
                                                preferred.get(row).map(time => {
                                                    const timeStr = time.slice(0, 1)[0];
                                                    return <ChipView key={btoa(timeStr)} label={timeStr} />;
                                                })
                                            )}
                                    </CustomTableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div >
        );
    }
}
export default withStyles(styles)(PreviewTable);
