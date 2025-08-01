import React from 'react'
import { WeatherIconDisplay } from '../components/WeatherIconDisplay'
import { WeatherInfoContainer } from '../components/WeatherInfoContainer'

export const ForecastPage = () => {
  return (
    <>
      <WeatherIconDisplay />
      <WeatherInfoContainer />
    </>
  )
}