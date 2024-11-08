import React from 'react'
import { useState, useEffect } from "react";
import './Home.css'
import { useNavigate } from 'react-router-dom';

const Home = () => {

    // Hooks
    const [location, setLocation] = useState(""); // State para o nome da cidade
    const [coord, setCoord] = useState(null); // State para dados das Coordenadas da cidade
    const [weatherData, setWeatherData] = useState(null); // State para dados de Clima
    const [loading, setLoading] = useState(false); // Estado de carregamento
    const [error, setError] = useState(false)
    const navigate = useNavigate()


    // Faz uma requisição HTTP para a API com o nome de uma cidade e retorna os dados de latitude e longitude para a variavel coord
    async function getLocation() {
      if (location){
        // Url da localização
        const locationUrl = `https://www.meteoblue.com/en/server/search/query3?query=${location}&itemsPerPage=1&apikey=SCY5GtzdxMvrJNul`;
        try {
        const response = await fetch(locationUrl);
        const locationData = await response.json();

        // Acessa a latitude e longitude do primeiro resultado
        if (locationData.results && locationData.results.length > 0) {
            const latitude = locationData.results[0].lat;
            const longitude = locationData.results[0].lon;
            const country = locationData.results[0].country;
            const iso = locationData.results[0].iso2;
            setCoord({ lat: latitude, lon: longitude, country: country, iso: iso });
        } else {
            setLoading(false)
            setError(true)
        }
        } catch (error) {
        console.log("Erro ao buscar dados de localização", error);
        }
      } else {
        setLoading(false)
        setError(true)
      }
      
    }



    // Toda vez que as coordenadas são alteradas, é feita uma nova chamada para a API para retornar os dados do clima
    useEffect(() => {
        if (coord) {
        const currentWeatherUrl = `http://my.meteoblue.com/packages/current?lat=${coord.lat}&lon=${coord.lon}&apikey=SCY5GtzdxMvrJNul`; //Dados atuais
        const basicWeatherUrl = ` http://my.meteoblue.com/packages/basic-1h_basic-day?lat=${coord.lat}&lon=${coord.lon}&apikey=SCY5GtzdxMvrJNul`; //previsão das proximas 24h
        const cloudUrl = `http://my.meteoblue.com/packages/clouds-1h_clouds-day?lat=${coord.lat}&lon=${coord.lon}&apikey=SCY5GtzdxMvrJNul` //Dados de visibilidade, etc.
        
        // Faz uma requisição HTTP para a API e retorna todos os dados do clima de acordo com a latitude e longitude do lugar
        async function getWeather() {
            try {
            const responseCurrent = await fetch(currentWeatherUrl);
            const currentData = await responseCurrent.json();

            const responseBasic = await fetch(basicWeatherUrl);
            const basicData = await responseBasic.json();

            const responseCloud = await fetch(cloudUrl)
            const cloudData = await responseCloud.json()
            
            const todayHour = new Date().getHours()

            const cloudCover = cloudData.data_1h.totalcloudcover[todayHour]
            
            setWeatherData({
                temperature: Math.round(currentData.data_current.temperature),
                wind: !currentData.data_current.windspeed? 0 : Math.round(currentData.data_current.windspeed*3.6),
                rain: Math.round(basicData.data_1h.precipitation_probability[todayHour]),
                humidity: Math.round(basicData.data_1h.relativehumidity[todayHour]),
                cloudCover: Math.round(cloudCover)
            });
            } catch (error) {
            console.error("Erro ao buscar dados:", error);
            } finally {
            setLoading(false); // Desativa o carregamento após a busca dos dados
            }
        }

        getWeather();
        }
    }, [coord]); // Dependência em coord


    useEffect(() => {
        if (weatherData) {
            // Navegar para a página de clima somente depois de os dados de clima estarem disponíveis
            setLoading(false)
            navigate("/results", { state: { weatherData, location, coord } });
        }
    }, [weatherData]); // Quando o weatherData mudar, executa o navigate
    


    // Quando o fomulario é submetido, o fluxo de mostrar o clima começa:
    // getLocation altera coord
    // coord ativa o useEffect e chama getWeather
    // Os dados são retornados
    const handlesubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        getLocation();
                
    };

    const handleChange = (e) => {
      setLocation(e.target.value)
      setError(false)
    }

    
  return (
    
    <div>
      <h1 id="home-h1">Vai sair? Confira o clima na cidade</h1>
      <div className="form-container">
        <form onSubmit={handlesubmit}>
          <div className="form-control">
            <label>
                <input
                  onChange={handleChange}
                  type="text"
                  placeholder="Digite o nome da cidade"
                />
              </label>
          </div>
          <button type="submit">{loading? "Carregando..." : "Pesquisar"}</button>
          </form>
          {error && <p className='error'>Cidade não encontrada... Tente de novo.</p>}
          
      </div>  
    </div>
  )
}

export default Home