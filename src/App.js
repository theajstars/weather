import axios from 'axios'
import React, { Component } from 'react'
import './assets/css/App.css'
import './assets/css/smaller_screens.css'
import './assets/css/fonts.css'
import Popup from 'reactjs-popup'
import 'bootstrap/dist/css/bootstrap.css';

export default class App extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      currentLocation: '',
      locationDetails: {
        temperature: null,
        main: null,
        humidity: null,
        pressure: null,
        wind: null,
        clouds: null,
      },
      locationForecastDetails: [],
      popupOpen: false,
      popupMessage: 'Please enter a location'
    }
    this.getData = this.getData.bind(this);
    this.locationSubmit = this.locationSubmit.bind(this)
    this.getForecast = this.getForecast.bind(this)
  }
  
  getData(){
    // Get current weather data
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${this.state.currentLocation}&units=metric&appid=7fa937838668db5e7c8249ca3b9a2d72`)
    .then(res => {
      var iconCode = res.data.weather[0].icon;
      var iconAddress = `https://openweathermap.org/img/wn/${iconCode}.png`;
      document.getElementById('weather-icon').src = iconAddress
      console.log(iconAddress)
      this.setState({
        locationDetails: {
          temperature: res.data.main.temp,
          main: res.data.weather[0].main,
          humidity: res.data.main.humidity,
          pressure: res.data.main.pressure,
          wind: res.data.wind.speed,
          clouds: res.data.clouds.all,
        }
      })
      
      document.querySelector('title').innerHTML = 'Weather ' + this.state.currentLocation
      document.querySelector('.place').innerHTML = this.state.currentLocation
      document.querySelector('#weather-main').innerHTML = this.state.locationDetails.main
      document.querySelector('.weather-temperature').innerHTML = Math.round(this.state.locationDetails.temperature) + '°C'
      document.querySelector('#humidity').innerHTML = Math.round(this.state.locationDetails.humidity) + '%'
      document.querySelector('#air-pressure').innerHTML = Math.round(this.state.locationDetails.pressure) + 'ps'
      document.querySelector('#wind-speed').innerHTML = Math.round(this.state.locationDetails.wind) + 'm/s'
      document.querySelector('#clouds').innerHTML = Math.round(this.state.locationDetails.clouds)
    })
    .catch(err => {
      // console.log(err)
    })
  }

  // Get forecast data
  getForecast(){
    axios.get(`https://api.weatherapi.com/v1/forecast.json?key=bfeebe53c45b4d52994125555210607&q=${this.state.currentLocation}&days=12`)
      .then(response => {
        this.setState({
          locationForecastDetails: response.data.forecast.forecastday
        })
        console.log('Found')
      }).catch(error => {
        if(error.response.status){
          this.setState({
            popupMessage: 'Please enter a valid location!',
            popupOpen: true,
          })
        }
      });
  }
  locationSubmit(e){
    e.preventDefault();
    if(this.state.currentLocation === ''){
      this.setState({
        popupMessage: 'Please enter a location',
        popupOpen: true
      })
    }else{
      this.getData()
      this.getForecast()
    }
  }
  turnOffPopup(){
    this.setState({
      popupOpen: false
    })
  }
  dateFormatter(d){
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var date = new Date(d)
    return `${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}`
  }
  openSide() {
    document.getElementById("right-section").style.width = "200px";
    document.getElementById("right-section").style.paddingLeft = '40px'
    setTimeout(() => {
      document.querySelector(".close-left").style.display = 'block'
    }, 500)
  }
  closeSide() {
    document.getElementById("right-section").style.width = "0px";
    document.getElementById("right-section").style.paddingLeft = '0px'
    document.querySelector(".close-left").style.display = 'none'
  }
  render() {
    return (
      <div className="container">
        <div className="top-left">
            <span className="weather-icon">
              <img src="" alt="" id="weather-icon" />
            </span>
            <span className="weather-name" id="weather-main">Fog</span>
            <span className="weather-place">
              <i className="current-location-icon far fa-map-marker-alt"></i>&nbsp;
              <span className="place">Old town road</span>
            </span>
            <span className="weather-temperature">28°C</span>

            <div className="input-location">
              <form action="#" onSubmit={(e) => this.locationSubmit(e)}>
                <input placeholder="Enter location..." type="text" id="new-location" name="location" onChange={(e) => this.setState({currentLocation: e.target.value})} />
                <br />
                <button type="submit" className="submit-form">
                  Get details <i className="fas fa-location"></i>
                </button>
              </form>
            </div>
        </div>

        {/* If location is empty on User submit */}
        <Popup open={this.state.popupOpen} closeOnDocumentClick modal onClose={() => this.turnOffPopup()}>
          <div className="popup">
            <span className="popup-header">
              Oops!&nbsp;
              <i className="fal fa-frown"></i>
            </span>
            <span className="popup-main">
              {this.state.popupMessage}
            </span>
          </div>
        </Popup>

        <div className="bottom-left">
          <span className="next-seven-days" id="next-seven-days">
            Next <b>3</b> days
          </span>

          <div className="days">
            {
              this.state.locationForecastDetails.map(forecast => {
                document.getElementById('next-seven-days').style.display = 'block';
                return (
                  <div className="day-card-container" key={'Key' + forecast.date}>
                    <span className="day">
                      {this.dateFormatter(forecast.date)}
                    </span>
                    <div className="day-card">
                      <div className="day-card-left">
                        <span className="day-temperature">
                          {Math.round(forecast.day.avgtemp_c)}°C
                        </span>
                        <span className="feels-like">
                          {forecast.day.condition.text}
                        </span>
                      </div>
                      <hr />
                      <div className="day-card-right">
                        <div className="rain-chance">
                          {forecast.day.daily_chance_of_rain}%
                        </div>
                        <span className="feels-like">Chance of rain</span>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>

        <span className="open-left" onClick={() => this.openSide()}>
          <i className="far fa-info-circle"></i>
        </span>
        <span className="close-left" onClick={() => this.closeSide()}>
          <i className="fas fa-times"></i>
        </span>
        <div className="right-section" id="right-section">
          <div className="weather-class humidity">
            <i className="weather-class-icon fal fa-humidity"></i>
            <div className="weather-class-details">
              <span className="weather-class-name">
                Humidity
              </span>
              <span className="weather-class-value" id="humidity">
                80%
              </span>
            </div>
          </div>
          
          <div className="weather-class air-pressure">
            <i className="weather-class-icon fal fa-wind"></i>
            <div className="weather-class-details">
              <span className="weather-class-name">
                Air pressure
              </span>
              <span className="weather-class-value" id="air-pressure">
                3009ps
              </span>
            </div>
          </div>

          <div className="weather-class wind-speed">
            <i className="weather-class-icon fal fa-windsock"></i>
            <div className="weather-class-details">
              <span className="weather-class-name">
                Wind speed
              </span>
              <span className="weather-class-value" id="wind-speed">
                1.2
              </span>
            </div>
          </div>

          <div className="weather-class clouds">
            <i className="weather-class-icon fal fa-cloud"></i>
            <div className="weather-class-details">
              <span className="weather-class-name">
                Clouds
              </span>
              <span className="weather-class-value" id="clouds">
                136
              </span>
            </div>
          </div>

        </div>
      </div>
    )
  }
}
