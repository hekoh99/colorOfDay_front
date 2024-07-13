import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { isSameMonth, isSameDay, addDays, addMonths } from 'date-fns';
import { format } from 'date-fns';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { httpSend } from '../utils/apiCall';
import { Icon } from '@iconify/react';
import rangeExtentRatio from "../utils/commonValues";
import "color-convert"

const ColorGallery = () => {
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [currentLastDay, setCurrentLastDay] = useState(new Date());
    const observer = useRef();
    const [dupRow, setDupRow] = useState([]);

    const [isFirstReq, setIsFirstReq] = useState(true);
    const [colorDataLeftOvers, setColorDataLeftOvers] = useState([]);

    const compareDate = (colorData, targetDate) => {
        if (colorData == undefined)
            return false;
        if (colorData.year == targetDate.getFullYear()) {
            if (colorData.month == targetDate.getMonth() + 1) {
                if (colorData.date == targetDate.getDate()) {
                    return true;
                }
            }
        }
        return false;
    }

    const convertToHexColor = (r, g, b) => {
        const convert = require('color-convert');
        let hexColor;
        if (r == undefined || g == undefined || b == undefined) {
            hexColor = convert.rgb.hex(130.0, 130.0, 130.0);
        } 
        else {
            hexColor = convert.rgb.hex(r/rangeExtentRatio, g/rangeExtentRatio, b/rangeExtentRatio);
        }
        return `#${hexColor}`;
    }

    const lastItemRef = useCallback(
        node => {
            if (observer.current) 
                observer.current.disconnect();      // 감시 중지

            observer.current = new IntersectionObserver(entries => {
                    if (entries[0].isIntersecting && hasMore) {
                        requestColorItems();
                    }
                }, {
                    root: null,
                    rootMargin: '0px',
                    threshold: 0.3, // visible ratio
                }
            );
            if (node) observer.current.observe(node);
        },
        [hasMore, items]
    );

    const calculatePercentage = (total, target) => {
        return (Math.round((target / total) * 100 * 10) / 10);
    }

    /** 
     * 
     * targetStartDate에 해당 하는 한 달의 color gallery cell을 생성.
     * 해당 달의 마지막 주에 다음 달의 날짜가 섞여서 완성되는 주의 경우, dupRow에 저장해 두었다가 다음 달을 로딩할 때 함께 로딩됨.
     * 
     * */ 
    const createColorGallery = (targetStartDate, colorData) => {
        const startDate = targetStartDate;
        const endDate = endOfMonth(targetStartDate);
        let isExceeded = false;

        const rows = [];
        let days = [];
        let day = startDate;
        let disPlayAll = false;

        if (dupRow.length > 0) {
            rows.push(
                <div className="row" key={day}>
                    {dupRow}
                </div>,
            );
            setDupRow([]);
        }

        let colorDataTotal = [];
        if (colorData != undefined) {
            colorDataTotal = [...colorDataLeftOvers, ...colorData];
            if (colorData.length == 0) {            // color log 값이 더이상 없을 경우 끝까지 모두 출력함
                disPlayAll = true;
            }
        }
        else {
            colorDataTotal = colorDataLeftOvers;
        }

        let index = 0;
        while (day <= endDate) {
            for(let i=0;i<7;i++) {
                let dayString = day.toDateString();
                if (day > endDate) {
                    isExceeded = true;
                }

                if (colorDataTotal != undefined && compareDate(colorDataTotal[index], day)) {
                    const color = convertToHexColor(colorDataTotal[index].colorR * rangeExtentRatio, colorDataTotal[index].colorG * rangeExtentRatio, colorDataTotal[index].colorB * rangeExtentRatio);
                    
                    const totalValue = colorDataTotal[index].colorR + colorDataTotal[index].colorG + colorDataTotal[index].colorB;
                    const accomplish = `성취감 : ${calculatePercentage(totalValue, colorDataTotal[index].colorR)}%`;
                    const tiredness = `피로도 : ${calculatePercentage(totalValue, colorDataTotal[index].colorG)}%`;
                    const stability = `안정감 : ${calculatePercentage(totalValue, colorDataTotal[index].colorB)}%`;

                    days.push(
                        <div className='col cell' style={{background : color}} key={day}>
                            <div className='info' style={{lineHeight: "140%"}}>
                                <p>{dayString}</p>
                                <p>
                                {accomplish}<br/>
                                {tiredness}<br/>
                                {stability}<br/>
                                </p>
                            </div>
                        </div>
                    );
                    index += 1;
                }
                else {
                    days.push(
                        <div className='col cell' key={day}>
                        </div>
                    );
                }
                day = addDays(day, 1);
            }
            if (isExceeded && (disPlayAll == false)) {
                setDupRow(days);
            }
            else {
                rows.push(
                    <div className="row" key={day}>
                        {days}
                    </div>,
                );
            }
            setColorDataLeftOvers(colorDataTotal.slice(index));
            days = [];
            isExceeded = false;
        }
        if (disPlayAll) {
            setHasMore(false);
        }
        setCurrentLastDay(day);         // 실제로 마지막에 저장된 day가 현 마지막 day
        return rows;
    }

    async function requestColorItems() {
        let requestUrl = "";
        if (isFirstReq) {
            requestUrl = `/colorLog`;

            await httpSend(requestUrl, "GET").then((res) => {
                if (res.error == null) {                // 응답이 에러가 아니면
                    if (res.data.length > 0) {          // 응답 colorlog 데이터가 존재 한다면
                        const startDate = new Date(res.data[0].year, res.data[0].month - 1, 1);     // 해당 달의 첫번째 날
                        const rows = createColorGallery(startDate, res.data);
                        setItems(rows);
                    }
                    setIsFirstReq(false);
                }
            });
        }
        else {
            requestUrl = `/colorLog?year=${currentLastDay.getFullYear()}&month=${currentLastDay.getMonth() + 2}`;

            await httpSend(requestUrl, "GET").then((res) => {
                if (res.error == null) {                // 응답이 에러가 아니면
                    let rows = [];
                    if (res.data.length > 0) {          // 응답 colorlog 데이터가 존재 한다면
                        rows = createColorGallery(currentLastDay, res.data);
                    }
                    else {
                        rows = createColorGallery(currentLastDay, res.data);
                    }
                    setItems(prevItems => [
                        ...prevItems,
                        ...rows,
                    ]);
                }
            });
        }
    }

    const moveToHome = () => {
        navigate("/", {});
    }

    useEffect(() => {
        (async () => {
            try {
                // await async "requestColorItems()" function
                await requestColorItems();
            } catch (err) {
                console.log('Error occured when fetching ');
            }
        })();
    }, []);

    return (
        <div className="summary-page">
            <div className='header'>
                <div className="colorlog-nav-home">
                    <Icon icon="mdi:calendar-month" onClick={moveToHome}/>
                </div>
                <div className='title'>
                    COLOR OF THE DAY
                </div>
            </div>
            
            <div className='summary'>
                {items.map((item, index) => (
                    <div className='row-wrapper' key={index}>
                        {item}
                    </div>
                ))}
                {hasMore && <div ref={lastItemRef} className='loading-icon'>
                        <Icon icon="svg-spinners:180-ring" />
                    </div>}
            </div>
        </div>
    );
}

export default ColorGallery;