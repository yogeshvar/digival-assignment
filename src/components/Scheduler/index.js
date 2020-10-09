import React, { useState } from 'react';
import TableDragSelect from 'react-table-drag-select';
import 'react-table-drag-select/style.css';
import { Button } from '@material-ui/core';
import scheduleAM from './schedule_AMICON.svg';
import schedulePM from './schedule_PMICON.svg';
import PreviewTable from '../PreviewTable';
import { toViewModel, getHour, toTimeSlots } from './utils';
import './scheduler.css';
import DialogBox from '../DialogBox';

const dayMap = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
];

const DummyHeader = () => {
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

const RenderTime = (time) => {
    switch (time) {
        case '12 AM':
            return (
                <React.Fragment>
                    <img
                        src={scheduleAM}
                        alt="am"
                    />
                    <span >{time}</span>
                </React.Fragment >
            );
        case '12 PM':
            return (
                <React.Fragment>
                    <img
                        src={schedulePM}
                        alt="pm"
                    />
                    <span>{time}</span>
                </React.Fragment>
            );
        default:
            return time;
    }
}

const Header = () => {
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

function RenderRow(time) {
    return (
        <tr key={time}>
            <td disabled className="column-header">
                {RenderTime(time.toString())}
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

const RenderRows = () => {
    return new Array(24)
        .fill(1)
        .map((_, index) =>
            RenderRow(getHour(2 * 0 + index)),
        );
}

const Scheduler = () => {
    const [cells, setCells] = useState(new Array(1 + 24)
        .fill(1)
        .map(() => new Array(dayMap.length + 1).fill(false)))
    const [preview, showPreview] = useState(false);
    const [confirmation, showConfirmation] = useState(false);

    function reset() {
        setCells(new Array(1 + 24)
            .fill(1)
            .map(() => new Array(dayMap.length + 1).fill(false)))
    }

    function handlePreview() {
        showPreview(!preview);
    }

    function handleCells(cells) {
        setCells(cells);
    }

    const preference = toViewModel(cells)
    const preferred = new Map();
    Object.keys(preference).forEach(day => {
        preferred.set(day, preference[day].preferred);
    });

    function handleSave() {
        showConfirmation(!confirmation);
    }

    function handleSlots() {
        var timeSlots = toTimeSlots(cells);
        console.log({ timeSlots });
        showConfirmation(!confirmation);
    }

    return (
        <React.Fragment>
            {confirmation && <DialogBox handleClose={handleSave} handleSlots={handleSlots} />}
            <div className="scheduler">
                <table className="table-header">
                    <tbody>
                        <Header />
                    </tbody>
                </table>
                <div id="scheduler-table">
                    <TableDragSelect
                        value={cells}
                        onChange={handleCells}
                    >
                        <DummyHeader />
                        {RenderRows()}
                    </TableDragSelect>
                </div>
                <div className="scheduler">
                    <Button variant="outlined" color="primary" style={{ margin: '8px' }} onClick={reset}>D E L E T E </Button>
                    <Button variant="outlined" color="primary" style={{ margin: '8px' }} onClick={handleSave}>S A V E</Button>
                    <Button variant="outlined" color="primary" style={{ margin: '8px' }} onClick={handlePreview}>{preview ? 'Hide Preview' : 'P R E V I E W'}</Button>
                </div>
                {preview && <PreviewTable preference={toViewModel(cells)} />}
            </div >
        </React.Fragment >
    )
}



export default Scheduler;