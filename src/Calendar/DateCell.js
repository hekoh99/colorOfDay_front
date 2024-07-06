import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { isSameMonth, isSameDay, addDays } from 'date-fns';
import { format } from 'date-fns';
import { useRef, useState, useEffect } from 'react';

const DateCell = ({isDateOfCurrentMonth, width, height, color}) => {
    const styleTemplate = {
        width:0, height:0, 
        borderBottom:`${height}px solid ${color}`,
        borderTop:`${height}px solid transparent`,
        borderLeft:`${width}px solid transparent`,
        borderRight:`${width}px solid ${color}`
    }
    return (
        <div className='colorlog-color' style={ isDateOfCurrentMonth && color != "" ? styleTemplate : {}}>
        </div>
    );
}

export default DateCell;