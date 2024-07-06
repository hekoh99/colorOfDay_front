import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { isSameMonth, isSameDay, addDays } from 'date-fns';
import { format } from 'date-fns';
import { useRef, useState, useEffect } from 'react';
import DateCell from './DateCell';
import { httpSend } from '../utils/apiCall';
import "color-convert"

const DateCells = ({currentMonth, selectedDate, onDateClick}) => {
    const monthStart = startOfMonth(currentMonth);      // 실제 해당 달의 시작일
    const monthEnd = endOfMonth(monthStart);            // 실제 해당 달의 말일
    const startDate = startOfWeek(monthStart);          // 해당 달력의 첫번째 일요일의 날짜
    const endDate = endOfWeek(monthEnd);                // 해당 달력의 마지막 토요일의 날짜

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    const componentRef = useRef(null);
    const [width, setWidth] = useState(0);
    const [height, setHeigh] = useState(0);
    const [colorDataArray, setColorDataArray] = useState(new Array(31).fill({}));

    const convert = require('color-convert');
    
    useEffect(() => {
        const handleResize = () => {
            if (componentRef.current) {
                const offsetHeight = componentRef.current.offsetHeight;
                const offsetWidth = componentRef.current.offsetWidth;

                const newWidth = offsetWidth / 2;
                const newHeight = offsetHeight / 10;
                setWidth(newWidth);
                setHeigh(newHeight);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        httpSend(`/colorLog/monthly?year=${currentMonth.getFullYear()}&month=${currentMonth.getMonth() + 1}`, "GET").then((res) => {
            if (res.error == null) {    // 응답이 에러가 아니면
                let arr;
                (arr = []).length = 31;
                arr.fill("");               // 크기가 31이며 "" 로 채워진 배열 생성
                if (res.data.length > 0) {
                    for(let i=0;i<res.data.length;i++) {
                        const hexColor = convert.rgb.hex(res.data[i].colorR, res.data[i].colorG, res.data[i].colorB);
                        arr[res.data[i].date - 1] = `#${hexColor}`;
                    }
                }
                setColorDataArray(arr);
            }
        });

    }, [currentMonth]);

    while (day <= endDate) {
        for(let i=0;i<7;i++) {
            formattedDate = format(day, 'd');
            const constDay = day;
            days.push(
                <div ref={componentRef}
                    className={`col cell ${
                        !isSameMonth(day, monthStart)
                        ? 'disabled'
                        : isSameDay(day, selectedDate)
                        ? 'selected'
                        : format(currentMonth, 'M') !== format(day, 'M')
                        ? 'not-valid'
                        : 'valid'
                    }`}
                    key={day}
                    onClick={() => onDateClick(constDay)}
                >
                    <span
                        className={
                            format(currentMonth, 'M') !== format(day, 'M')
                                ? 'text not-valid'
                                : ''
                        }
                    >
                        {formattedDate}
                    </span>
                    <DateCell isDateOfCurrentMonth={isSameMonth(day, monthStart)} width={width} height={height} color={colorDataArray[day.getDate() - 1]}/>
                </div>
            );
            day = addDays(day, 1);
        }
        rows.push(
            <div className="row" key={day}>
                {days}
            </div>,
        );
        days = [];
    }
    return <div className="body">{rows}</div>;
}

export default DateCells;