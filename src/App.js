import './Style/calendarStyle.scss'
import './Style/colorlogStyle.scss'

import Calender from './Calendar/Calendar';
import { Route, Routes } from "react-router-dom";
import ColorLogEditor from './ColorLog/ColorLogEditor';

function App() {
  return (
    <div className='app'>
      <Routes>
        <Route path="/" element={<Calender />} />
        <Route path="/:year/:month/:day" element={<ColorLogEditor/>} />
      </Routes>
    </div>
  );
}

export default App;
