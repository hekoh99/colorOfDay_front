import "color-convert"
import rangeExtentRatio from "../utils/commonValues";

const ColorDisplayer = ({r, g, b}) =>  {
    const convert = require('color-convert');
    const hexLibColor = convert.rgb.hex(r/rangeExtentRatio, g/rangeExtentRatio, b/rangeExtentRatio);
    const templateStyle = {
        background:`#${hexLibColor}`
    }
    return (<div className="displayer" style={templateStyle}></div>);
}

export default ColorDisplayer;