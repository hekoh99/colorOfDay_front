import React, { useState, useEffect } from 'react';
import CalendarNav from "./CalendarNav";
import DayHeader from "./DayHeader";
import DateCells from './DateCells';
import { addMonths, subMonths } from 'date-fns';
import { useNavigate, useLocation } from "react-router-dom";

const Calender = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const navigate = useNavigate();
    const { state } = useLocation();

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
        navigate(`/${year}/${month}/${day}`, {state : date});
    }
    const showGallery = () => {
        navigate(`/gallery`, {});
    }

    useEffect(() => {
        if (state != undefined) 
            setCurrentMonth(state);
    }, [state]);

    return (
        <div className="calendar">
            <CalendarNav
                currentMonth={currentMonth}
                prevMonth={prevMonth}
                nextMonth={nextMonth}
            />
            <DayHeader />
            <DateCells
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                onDateClick={showTargetDate}
            />
            <div className='gallery-btn' onClick={showGallery}>갤러리 보기</div>
        </div>
    );
};

export default Calender