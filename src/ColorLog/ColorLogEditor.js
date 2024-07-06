import { useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import ColorDisplayer from "./ColorDisplayer";
import ColorSlider from "./ColorSlider";
import rangeExtentRatio from "../utils/commonValues";
import ColorLogMemo from "./ColorLogMemo";
import { httpSend } from "../utils/apiCall";
import { Icon } from '@iconify/react';
import { addDays } from "date-fns";
import { subDays } from "date-fns/subDays";

const ColorLogEditor = () => {
    const { year, month, day } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();

    const [RValue, setRValue] = useState(130 * rangeExtentRatio);
    const [GValue, setGValue] = useState(130 * rangeExtentRatio);
    const [BValue, setBValue] = useState(130 * rangeExtentRatio);
    const [memo, setMemo] = useState("");
    const [id, setId] = useState(-1);

    const [btnStatus, setBtnStatus] = useState("saveBtn inactiveBtn");

    const moveToPrevDate = () => {
        const date = subDays(state, 1);
        navigate(`/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`, {state : date});
    }

    const moveToNextDate = () => {
        const date = addDays(state, 1);
        navigate(`/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`, {state : date});
    }

    const moveToHome = () => {
        navigate("/", {state : state});
    }
    const setDefault = () => {
        setRValue(130 * rangeExtentRatio);
        setGValue(130 * rangeExtentRatio);
        setBValue(130 * rangeExtentRatio);
        setId(-1);
        setMemo("");
    }

    useEffect(() => {

        httpSend(`/colorLog/detail?date=${day}&year=${year}&month=${month}`, "GET").then((res) => {
            if (res.error == null) {    // 응답이 에러가 아니면
                if (res.data.length > 0) {
                    const colorData = res.data[0];
                    if (colorData.id !== -1) {
                        setRValue(colorData.colorR * rangeExtentRatio);
                        setGValue(colorData.colorG * rangeExtentRatio);
                        setBValue(colorData.colorB * rangeExtentRatio);
                        setId(colorData.id);
    
                        setMemo(colorData.text);
                    }
                    else {
                        setDefault();
                    }
                }
                else {
                    setDefault();
                }
            }
        });
    }, [state]);

    const onSave = (e) => {
        // 버튼 활성화 시에만 서버에 전송
        if (btnStatus === "saveBtn inactiveBtn") {
            return;
        }

        let options = {
            "headers" : {"Content-Type" : "application/json"},
            "api": "/colorLog"
        };
        if (id === -1) {
            options.method = "POST";
        }
        else {
            options.method = "PUT";
        }
        const req = {
            "id":id,
            "text":memo,
            "colorR":RValue/rangeExtentRatio,
            "colorG":GValue/rangeExtentRatio,
            "colorB":BValue/rangeExtentRatio,
            "date":day,
            "month":month,
            "year":year
        };
        httpSend(options.api, options.method, req).then((res) => {
            if (res.error == null) {    // 응답이 에러가 아니면
                if (res.data.length > 0) {
                    const colorData = res.data[0];
                    if (colorData.id !== -1) {
                        setRValue(colorData.colorR * rangeExtentRatio);
                        setGValue(colorData.colorG * rangeExtentRatio);
                        setBValue(colorData.colorB * rangeExtentRatio);
                        setId(colorData.id);
    
                        setMemo(colorData.text);
                        setBtnStatus("saveBtn inactiveBtn");
                    }
                }
            }
            else {
                console.log("failed to save data");
            }
        });
    }

    return (
        <div className="page">
            <div className="colorlog-nav-left">
                <Icon icon="bi:arrow-left-circle-fill" onClick={moveToPrevDate} />
            </div>
            <div className="colorlog-nav-right">
                <Icon icon="bi:arrow-right-circle-fill" onClick={moveToNextDate} />
            </div>
            <div className="colorlog-nav-home">
                <Icon icon="mdi:calendar-month" onClick={moveToHome}/>
            </div>

            <div className="colorlog">
                <div className="title">{year} - {month} - {day}</div>
                <ColorDisplayer r={RValue} g={GValue} b={BValue}/>

                <ColorSlider value={RValue} setValue={setRValue} setStatus={setBtnStatus} min={10 * rangeExtentRatio} max={250 * rangeExtentRatio} category={"성취감"}/>
                <ColorSlider value={GValue} setValue={setGValue} setStatus={setBtnStatus} min={10 * rangeExtentRatio} max={250 * rangeExtentRatio} category={"안정감"}/>
                <ColorSlider value={BValue} setValue={setBValue} setStatus={setBtnStatus} min={10 * rangeExtentRatio} max={250 * rangeExtentRatio} category={"피로도"}/>
                <ColorLogMemo content={memo} setContent={setMemo} setStatus={setBtnStatus}/>
                <div className="footer">
                    <button className={`${btnStatus}`} onClick={onSave}>save</button>
                </div>          
            </div>
        </div>
        
    );
}

export default ColorLogEditor;