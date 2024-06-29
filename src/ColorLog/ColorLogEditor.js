import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import ColorDisplayer from "./ColorDisplayer";
import ColorSlider from "./ColorSlider";
import rangeExtentRatio from "../utils/commonValues";
import ColorLogMemo from "./ColorLogMemo";
import { httpSend } from "../utils/apiCall";

const ColorLogEditor = () => {
    const { year, month, day } = useParams();
    // const [colorLog, setColorLog] = useState({});

    const [RValue, setRValue] = useState(130 * rangeExtentRatio);
    const [GValue, setGValue] = useState(130 * rangeExtentRatio);
    const [BValue, setBValue] = useState(130 * rangeExtentRatio);
    const [memo, setMemo] = useState("");

    const [id, setId] = useState(-1);
    const [isDiff, setIsDiff] = useState(false);

    const [btnStatus, setBtnStatus] = useState("saveBtn inactiveBtn");

    useEffect(() => {
        const requestOption = {
            "method" : "GET",
            "headers" : {"Content-Type" : "application/json"},
        };

        httpSend(`/colorLog/detail?date=${day}&year=${year}&month=${month}`, "GET").then((res) => {
            if (Object.keys(res).length !== 0) {
                if (res.id !== -1) {
                    setRValue(res.colorR * rangeExtentRatio);
                    setGValue(res.colorG * rangeExtentRatio);
                    setBValue(res.colorB * rangeExtentRatio);
                    setId(res.id);
    
                    setMemo(res.text);
                }
            }
        });
    }, []);

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
            if (Object.keys(res).length !== 0) {
                if (res.id !== -1) {
                    setRValue(res.colorR * rangeExtentRatio);
                    setGValue(res.colorG * rangeExtentRatio);
                    setBValue(res.colorB * rangeExtentRatio);
                    setId(res.id);
    
                    setMemo(res.text);
                    setBtnStatus("saveBtn inactiveBtn");
                }
            } else {
                console.log("failed to save data");
            }
        });
    }

    return (
        <div className="page">
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