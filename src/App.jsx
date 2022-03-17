import { useRef, useState, useEffect } from 'react';
import './App.scss';
import search from './assets/svg/search_icon.svg';
import bg from './assets/jpg/qQa5Pd7-weather-wallpapers.jpg';

function App() {
  const inputRef = useRef()

  const [weather, setWeather] = useState([])
  const [bgImg, setBgImg] = useState(bg)
  const [lastCountry, setLastCountry] = useState(JSON.parse(localStorage.getItem('lastCountry')) || [])

  localStorage.setItem('lastCountry', JSON.stringify(lastCountry))




  function getLocation() {
    let location = new Date().toString()
    location = location.split(' ')
    location = location[6].split('')
    location.pop()
    location.shift()
    location = location.join('')

    return inputRef.current.value.trim() ? inputRef.current.value : location
  }




  async function getWeatherdata(){
    let location = getLocation()
    let country = inputRef.current.value.trim() ? inputRef.current.value : location

    let data = await fetch(`https://api.weatherapi.com/v1/current.json?key=b1345fc78b0848c09cf124837220103&q=${country}&lang=eng`)
    data = await data.json()
    if(data.error){
      return alert('error')
    }
    setWeather(data)

    setLastCountry(state => {
      if(state.length > 5){
        state.pop()
        state = state.filter(item => item !== country)
        return [location, ...state]
      } else {
        state = state.filter(item => item !== country)
        return [location, ...state]
      }
    })
  }




  async function getBgImage(){
    let location = getLocation()

    let img = await fetch(`https://pixabay.com/api/?key=26186129-dd030794db2fccd40b1339f2e&q=${location}&image_type=jpg&per_page=3`)
    img = await img.json()
    setBgImg(img.hits[0] ? img.hits[0].largeImageURL : bg)
  }


  useEffect(() => {
    getBgImage()
    getWeatherdata()
  }, []);




  return (
    <header className='header'>
      <img className='header__bgImg' src={bgImg} alt="img" />

      <div className='weather'>
        <p className='weather__temp'>{weather.current?.temp_c}°</p>

        <span>
          <h2 className='weather__city'>{weather?.location?.name}</h2>
          <p className='weather__data'>{weather?.location?.localtime}</p>
        </span>

        <span>
          <img className='weather__icon' src={weather?.current?.condition.icon} alt="icon" />
          <p className='weather__info'>{weather?.current?.condition.text}</p>
        </span>
      </div>

     <div className="panel">
       <div className="panel__search">
         <input className='panel__search__input' ref={inputRef} placeholder='Search Location...' type="text" />
         <button onClick={() => {
           try {
            getBgImage()
            getWeatherdata()
           } catch (error) {
             console.log(error.message);
           }
         }} className='panel__search__btn'><img src={search} alt="seach" /></button>
       </div>

       <ul className="panel__ul">
         <h2 className='panel__ul__title'>Last Location</h2>
         {
           lastCountry.map((item, index) => {
             return <button key={index} onClick={() => {
              try {
                inputRef.current.value = item
                getBgImage()
                getWeatherdata()
               } catch (error) {
                 console.log(error.message);
               }
             }} className='panel__ul__item'>{item}</button>
           })
         }
       </ul>

       <ul className="panel__ul">
         <h2 className='panel__ul__title'>Weather detalist</h2>
         <li className='panel__ul__item'>Cloundy {weather?.current?.cloud}%</li>
         <li className='panel__ul__item'>Humidity {weather?.current?.humidity}%</li>
         <li className='panel__ul__item'>Wind {weather?.current?.wind_kph} km/h</li>
         <li className='panel__ul__item'>Pressure {weather?.current?.pressure_mb} mb</li>
       </ul>
     </div>

    </header>
  );
}

export default App;
