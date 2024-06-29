import React, { useState } from 'react';

const ColorLogMemo = ({content, setContent, setStatus}) => {
    const writeMemo = (e) => {
        setContent(e.currentTarget.value)
        setStatus("saveBtn activeBtn");
    }
    
    return (
        <div className="memo">
            <label htmlFor="story">Memo</label>
            <textarea id="story" name="story" rows={5} cols={33} value={content} onChange={writeMemo}>
            </textarea>
        </div>
    );
}

export default ColorLogMemo;