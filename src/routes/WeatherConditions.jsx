import React from "react";
import { useLocation } from "react-router-dom";
import {
  WiThermometer,
  WiHumidity,
  WiUmbrella,
  WiSandstorm,
  WiDayCloudy, //nublado
  WiDaySunny , //ensolarado
  WiDayRain , //chuvoso
  WiDayStormShowers  , //muito chuvoso 
  WiNightClear , //clara
  WiNightAltPartlyCloudy , //nublada
  WiNightAltSprinkle  , //chuvosa
  WiNightAltStormShowers , //muito chuvosa
} from "react-icons/wi";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";
import ct from 'country-timezone';
import "./WeatherConditions.css";

const WeatherConditions = () => {
  const location = useLocation();
  const { weatherData, location: city, coord: country} = location.state || {};

  // Cria a URL da bandeira usando o código do país
  const flagUrl =`https://flagcdn.com/w40/${country.iso.toLowerCase()}.png`

  // Definindo se o dia está ensolarado, nublado, chuvoso
  // E se a noite esta clara, nublada, chuvosa
  const iconComponents = [
    <WiDayCloudy/>, //nublado
    <WiDaySunny/> , //ensolarado
    <WiDayRain/> , //chuvoso
    <WiDayStormShowers/>  , //muito chuvoso 
    <WiNightClear/> , //clara
    <WiNightAltPartlyCloudy/> , //nublada
    <WiNightAltSprinkle/>  , //chuvosa
    <WiNightAltStormShowers/> , //muito chuvosa
    ]
    
    const defineIcon = () => {

      //Esta nublado?
      let cloud = ""
      if (weatherData.cloudCover < 50) {
        cloud = "limpo";
      } else if (weatherData.cloudCover >= 50) {
        cloud = "nublado";
      } else {
        cloud = "não disponível";
      }

      //Está chovendo?
      let rain = ""
      if (weatherData.rain < 30) {
        rain = "limpo";
      } else if (weatherData.rain >= 30 && weatherData.rain < 60) {
        rain = "chuvoso";
      } else if (weatherData.rain >= 60) {
        rain = "muito chuvoso";
      } else {
        rain = "não disponível";
      }

      // É de dia ou de noite?
      const timezones = ct.getTimezones(country.country);
      console.log(`Fusos horários encontrados para ${country.country}:`, timezones)
      // Escolhe o primeiro fuso horário da lista como padrão
      const primaryTimezone = timezones[0]; 

      // Configura o horário com base no timezone e ajusta automaticamente para horário de verão
      const now = DateTime.now().setZone(primaryTimezone);
      const time = now.hour; // Obtém a hora local
      console.log(`Time in ${country.country}:`, time);
      const isDaytime = time >= 6 && time < 18;

      if (isDaytime) {
        if (cloud === "limpo" && rain === "limpo") return iconComponents[1]; // ensolarado
        if (cloud === "nublado" && rain === "limpo") return iconComponents[0]; // nublado
        if (rain === "chuvoso") return iconComponents[2]; // chuvoso
        if (rain === "muito chuvoso") return iconComponents[3]; // muito chuvoso
      } else {
        if (cloud === "limpo" && rain === "limpo") return iconComponents[4]; // noite clara
        if (cloud === "nublado" && rain === "limpo") return iconComponents[5]; // noite nublada
        if (rain === "chuvoso") return iconComponents[6]; // noite chuvosa
        if (rain === "muito chuvoso") return iconComponents[7]; // noite muito chuvosa
      }

      return null

    }

  return (
    <div className="weather">
      <h1>
        {city} - {country?.iso}{" "}
        {flagUrl && (
          <img src={flagUrl} className="flag"/>
        )}
      </h1>
      <div className="conditions-container">
        <div className="main-container">
          {defineIcon()}
          <p id="temperature">
            <WiThermometer />
            {weatherData?.temperature}°C
          </p>
        </div>
        <div className="other-conditions">
          <p>
            <WiUmbrella className="umbrella" /> <span>Chuva: </span>{weatherData?.rain}%
          </p>
          <p>
            <WiHumidity className="humidity" /> <span>Humidade: </span>{weatherData?.humidity}%
          </p>
          <p>
            <WiSandstorm className="wind" /> <span>Ventos: </span>{weatherData?.wind}Km/h
          </p>
        </div>
      </div>
      <Link to={"/"} className="btn">Voltar</Link>
    </div>
  );
};

export default WeatherConditions;
