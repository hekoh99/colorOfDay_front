import React, { useState } from 'react';
import CalendarNav from "./CalendarNav";
import DayHeader from "./DayHeader";
import DateCell from './DateCell';
import { addMonths, subMonths } from 'date-fns';
import { useNavigate } from "react-router-dom";

const Calender = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const navigate = useNavigate();

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };
    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };
    const onDateClick = (day) => {
        setSelectedDate(day);
    };
    const showTargetDate = (date) => {
        // Extract year, month, and day
        const year = date.getFullYear(); // Get the full year (YYYY)
        const month = date.getMonth() + 1; // Get the month (0-11); adding 1 to convert to (1-12)
        const day = date.getDate(); // Get the day of the month (1-31)
        navigate(`/${year}/${month}/${day}`);
    }

    return (
        <div className="calendar">
            <CalendarNav
                currentMonth={currentMonth}
                prevMonth={prevMonth}
                nextMonth={nextMonth}
            />
            <DayHeader />
            <DateCell
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                onDateClick={showTargetDate}
            />
        </div>
    );
};

export default Calender