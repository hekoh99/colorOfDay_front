import './Style/calendarStyle.scss'
import './Style/colorlogStyle.scss'

import Calender from './Calendar/Calendar';
import { Route, Routes } from "react-router-dom";
import ColorLogEditor from './ColorLog/ColorLogEditor';
import ColorGallery from './ColorLog/ColorGallery';

function App() {
  return (
    <div className='app'>
      <Routes>
        <Route path="/" element={<Calender />} />
        <Route path="/gallery" element={<ColorGallery />}/>
        <Route path="/:year/:month/:day" element={<ColorLogEditor/>} />
      </Routes>
    </div>
  );
}

export default App;
