import React from 'react';
import './Weather.css'
import search from '../assets/search.png'
import drizzle from '../assets/drizzle.png'
import humidity from '../assets/humidity.png'
import clear from '../assets/clear.png'
import rain from '../assets/rain.png'
import snow  from '../assets/snow.png'
import wind from '../assets/wind.png'


const Weather = () => {
  return (
    <div className='weather'>
      <div className='search-bar'>
        <input type="text" placeholder='Search' />
        <img src={search}/>
      </div>
      <img src={clear} className='clear-weather'/>
      <p className='temp'>16°c</p>
      <p className='location'>London</p>

       <div className="weather-data-row">
        <div className="col">
          <img src={humidity} alt="Humidity Icon" />
          <div>
            <p>91%</p>
            <span>Humidity</span>
          </div>
        </div>

        <div className="col">
          <img src={wind} alt="Wind Icon" />
          <div>
            <p>3.6 km/h</p>
            <span>Wind Speed</span>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Weather;