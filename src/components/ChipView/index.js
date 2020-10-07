import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: theme.spacing(2),
    },
    chip: {
        margin: theme.spacing(2),
        fontSize: 12,
        backgroundColor: '#bbe8e2',
    },
});

const ChipView = ({ classes, label }) => (
    <Chip className={classes.chip} label={label} />
);


export default withStyles(styles)(ChipView);
