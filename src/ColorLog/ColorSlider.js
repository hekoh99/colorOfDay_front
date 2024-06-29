import React, { useState } from 'react';

const ColorSlider = ({value, setValue, setStatus, min, max, category}) => {
    const userRangeInput = (e) =>{
        setValue(e.currentTarget.value);
        setStatus("saveBtn activeBtn");
    }

    return (
        <div className='colorlogSlider'>
            <label htmlFor='sortDate_range_input'>
                {category}
            </label>
            <input
                type={"range"}
                min={min}
                max={max}
                step={"1"}
                value={value}
                onClick={userRangeInput}
                onInput={userRangeInput}> 
            </input>
        </div>
    );
}

export default ColorSlider;