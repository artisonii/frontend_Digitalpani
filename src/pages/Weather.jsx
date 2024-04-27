import React, { useEffect, useRef, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import axios from "axios"
import { WiSunrise } from "react-icons/wi";
const cities = ["Delhi", "Bengaluru", "Lucknow", "Bhopal", "Jaipur"]
const appId = "2bed4a01f425570dcaeaefd450d39bef"
const weatherApi = "https://api.openweathermap.org/data/2.5/weather";
const Weather = () => {
    const [city, setCity] = useState(cities[0])
    const [weather, setWeather] = useState({})
    const [inputCity, setInputCity] = useState("")
    const [weatherSet, setWeatherSet] = useState("")
    const [weatherArr, setWeatherArr] = useState([])
    const [found, setFound] = useState(false)
    const [popUpOpen, SetPopUpOpen] = useState(false)
    const popupRef = useRef(null);
    const [hourlyData, setHourlyData] = useState([])

    const fetchData = async (url) => {
        try {
            const data = await axios.get(url);
            if (inputCity) {
                setWeatherSet(data.data)
                SetPopUpOpen(true)
                setFound(true)
            } else {
                setWeather(data.data)
                setWeatherArr(data.data.weather[0])
            }

            console.log(data.data)
        } catch (error) {
            if (inputCity) {
                SetPopUpOpen(true)
                setFound(false)
            }
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData(weatherApi + "?q=" + city + "&units=metric&appid=" + appId)
    }, [city])

    useEffect(() => {
        let timeout;
        if (inputCity == "") {
            clearTimeout(timeout)
            SetPopUpOpen(false)
        }
        if (inputCity & timeout) {
            clearTimeout(timeout)

        } else if (inputCity) {
            timeout = setTimeout(() => {
                setCity(inputCity)
            }, 1000)
        }

        return () => clearTimeout(timeout)
    }, [inputCity])

    var date1 = new Date(weather.dt * 1000);
    let day = date1.toLocaleString('en-IN', { weekday: 'short' })
    var month = date1.toLocaleString('en-IN', { month: 'short' });
    var day1 = date1.getDate();
    var year = date1.getFullYear();
    var hours = date1.getHours();
    var minutes = date1.getMinutes();
    let date = `${month} ${day1} ${year}`
    let time = date1.toTimeString().substring(0, 5)
    let sunset1 = new Date(weather?.sys?.sunset * 1000)
    let sunset = sunset1.toTimeString().substring(0, 5)
    let sunrise1 = new Date(weather?.sys?.sunrise * 1000)
    let sunrise = sunrise1.toTimeString().substring(0, 5)
    const handleSearch = () => {
        setWeather(weatherSet)
        SetPopUpOpen(false)
        setInputCity("")
        setWeatherArr(weatherSet?.weather[0])
    }


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setInputCity("")
                SetPopUpOpen(false)
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return (
        <div className='container'>
            <div className='topContainer'>
                {cities.map((ele) => {
                    return <p onClick={() => setCity(ele)} style={city === ele ? { color: "blue" } : { color: "" }}>{ele}</p>
                })}
            </div>

            <div className='search'>
                <div className='searchbar'>
                    <input type="text" placeholder='Search for city...' value={inputCity} onChange={(e) => { setInputCity(e.target.value) }} />
                    <CiSearch color="blue" size={"20px"} />
                </div>
                {
                    popUpOpen ? <div className={"popup"} ref={popupRef}>
                        <p onClick={handleSearch}>{found ? `${weatherSet?.name}, ${weatherSet?.sys?.country}` : "Not Found.."}</p>
                    </div> : ""
                }
            </div>
            <div className='gridContainer'>
                <div>
                    <div className='timeContainer'>
                        <h1>{weather?.name}, {weather?.sys?.country}</h1>
                    </div>
                    <div className='weatherDetails'>
                        <div>
                            <img src={`https://openweathermap.org/img/wn/${weatherArr?.icon}@2x.png`} alt="" />
                        </div>
                        <div>

                            <div className='weatherContainer'>
                                <p>{Math.round(weather?.main?.temp)} ℃</p>
                            </div>
                            <p>{weatherArr?.main}</p>
                        </div>

                    </div>

                    <div className='timeContainer'>
                        <p>{`${day}, ${date} | ${time}`}</p>
                    </div>
                </div>
                <div>
                    <div className='sunriseContainer'>
                        <div> <span>Humidity </span><span>{weather?.main?.humidity} %</span></div>
                        <div> <span>Feels Like </span><span>{Math.round(weather?.main?.feels_like)} ℃</span></div>
                        <div> <span>Wind </span><span>{weather?.wind?.speed} km/h</span></div>
                        <div> <span>Sunrise </span><span>{sunrise}</span></div>
                        <div> <span>Sunset </span><span>{sunset}</span></div>
                        <div> <span>High </span><span> {weather?.main?.temp_max} ℃</span></div>
                        <div> <span>Wind </span><span>{weather?.wind?.speed} km/h</span></div>
                    </div>
                </div>
            </div>
            {/* <div>
                <img src={`https://tile.openweathermap.org/map/temp_new/1/11/200.png?appid=${appId}`} alt="" />
            </div> */}
        </div>
    )
}

export default Weather