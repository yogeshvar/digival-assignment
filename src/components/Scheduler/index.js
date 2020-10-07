import React from 'react';
import TableDragSelect from 'react-table-drag-select';
import 'react-table-drag-select/style.css';
import { Button, withStyles } from '@material-ui/core';
import scheduleAM from './schedule_AMICON.svg';
import schedulePM from './schedule_PMICON.svg';
import PreviewTable from '../PreviewTable';
import './scheduler.css';

const dayMap = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
];


const styles = () => ({
    scheduleImage: {
        width: '14px',
        padding: '2px',
    },
    alignImg: {
        marginRight: '12px',
        marginTop: '0px',
    },
});

class Scheduler extends React.Component {
    constructor(props) {
        super(props);
        this.rowCount = 1 * ((24 - 0) - (24 - 24));
        this.reset = this.reset.bind(this);
        this.state = {
            showPreview: false,
            cells: new Array(1 + this.rowCount)
                .fill(1)
                .map(() => new Array(dayMap.length + 1).fill(false))
        }
    }

    reset() {
        this.setState({
            cells: new Array(1 + this.rowCount)
                .fill(1)
                .map(() => new Array(dayMap.length + 1).fill(false))
        })
    }

    joinHours = (start, end) => [
        `${this.getHour(start)} - ${this.getHour(end)}`,
        (end - start) / 2, // difference
    ];

    transpose = arr => arr[0].map((col, i) => arr.map(row => row[i]));

    handlePreview() {
        this.setState({ showPreview: !this.state.showPreview });
    }


    showPreview() {
        const preference = {};
        dayMap.forEach(day => {
            preference[day] = {
                preferred: [],
            }
        });
        const dayWiseCal = this.transpose(this.state.cells);
        const startHour = 0;
        for (let i = 1; i < dayWiseCal.length; i += 1) {
            let start = null;
            let end = null;
            for (let j = 1; j < dayWiseCal[0].length; j += 1) {
                if (dayWiseCal[i][j]) {
                    if (end !== j) {
                        if (end) {
                            preference[dayMap[i - 1]].preferred.push(
                                this.joinHours(startHour + start - 1, startHour + end - 1),
                            );
                        }
                        start = j;
                    }
                    end = j + 1;
                }
            }
            if (start && end) {
                preference[dayMap[i - 1]].preferred.push(
                    this.joinHours(startHour + start - 1, startHour + end - 1),
                );
            }
        }
        return preference;
    }

    handleChange = cells => {
        console.log({ cells });
        this.setState({ cells });
    }

    renderHeader() {
        return (
            <tr className="row-header">
                <td disabled className="column-header">
                </td>
                {dayMap.map(day => (
                    <td disabled key={day}>
                        {day === 'MONDAY' && 'Monday'}
                        {day === 'TUESDAY' && 'Tuesday'}
                        {day === 'WEDNESDAY' && 'Wednesday'}
                        {day === 'THURSDAY' && 'Thursday'}
                        {day === 'FRIDAY' && 'Friday'}
                        {day === 'SATURDAY' && 'Saturday'}
                        {day === 'SUNDAY' && 'Sunday'}
                    </td>
                ))}
            </tr>
        )
    }

    renderDummyHeader() {
        return (
            <tr style={{ display: 'none' }}>
                <td disabled>Time</td>
                {dayMap.map(day => (
                    <td disabled key={day}>
                        {day.toLowerCase()}
                    </td>
                ))}
            </tr>
        );
    }

    renderTime = time => {
        const { classes } = this.props;
        switch (time) {
            case '12 AM':
                return (
                    <React.Fragment>
                        <img
                            className="img"
                            src={scheduleAM}
                            className={classes.scheduleImage}
                            alt="am"
                        />
                        <span className={classes.alignImg}>{time}</span>
                    </React.Fragment >
                );
            case '12 PM':
                return (
                    <React.Fragment>
                        <img
                            className="img"
                            src={schedulePM}
                            className={classes.scheduleImage}
                            alt="pm"
                        />
                        <span className={classes.alignImg}>{time}</span>
                    </React.Fragment>
                );
            default:
                return time;
        }
    };

    renderRow(time) {
        return (
            <tr key={time}>
                <td disabled className="column-header">
                    {this.renderTime(time.toString())}
                </td>
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
            </tr>
        );
    }

    addZero = num => (num > 9 ? num : `0${num}`);

    getHour = num => {
        const meridian = num < 12 || num === 24 ? 'AM' : 'PM';
        let hour = num > 12 ? num - 12 : num;
        return `${this.addZero(hour === 0 ? 12 : hour)} ${meridian}`;
    };

    renderRows() {
        return new Array(this.rowCount)
            .fill(1)
            .map((_, index) =>
                this.renderRow(this.getHour(2 * 0 + index)),
            );
    }

    render() {
        const showState = this.state.showPreview;
        const preference = this.showPreview();
        const preferred = new Map();
        Object.keys(preference).forEach(day => {
            preferred.set(day, preference[day].preferred);
        });
        return (
            <React.Fragment>
                <div className="scheduler">
                    <table className="table-header">
                        <tbody>{this.renderHeader()
                        }</tbody >
                    </table >
                    <div id="scheduler-table">
                        <TableDragSelect
                            value={this.state.cells}
                            onChange={this.handleChange}
                        >
                            {this.renderDummyHeader()}
                            {this.renderRows()}
                        </TableDragSelect>
                    </div>
                    <div>
                        <Button variant="contained" style={{ margin: '8px' }} onClick={() => { this.reset() }}>D E L E T E </Button>
                        <Button variant="contained" style={{ margin: '8px' }}>S A V E</Button>
                        <Button variant="contained" style={{ margin: '8px' }} onClick={() => { this.handlePreview() }}>{showState ? 'Hide Preview' : 'P R E V I E W'}</Button>
                    </div>
                </div>
                { showState && <PreviewTable preference={this.showPreview()} />}
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(Scheduler);