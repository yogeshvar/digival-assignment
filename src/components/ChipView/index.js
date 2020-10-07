import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: theme.spacing(1),
    },
    chip: {
        margin: theme.spacing(1),
        fontSize: 12,
        backgroundColor: '#bbe8e2',
    },
});

const ChipView = ({ classes, label }) => (
    <Chip className={classes.chip} label={label} />
);


export default withStyles(styles)(ChipView);
