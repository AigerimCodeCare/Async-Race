import React from 'react';
import axios from 'axios';
import Garage from './components/garage/Garage';
import Winners from './components/winners/Winners';
import { carsDataType, winnersType } from './types/types';
import './App.css'

export const AppContext = React.createContext({} as { load: (page: number, sort: string) => void })

function App() {
  const [isGarage, setGarage] = React.useState(true)
  const [data, setData] = React.useState([] as carsDataType)
  const [totalCars, setTotalCar] = React.useState(Number)
  const [winners, setWinners] = React.useState([] as winnersType)
  const [totalWinners, setTotalWinners] = React.useState(0)
  const [winInfo, setWinInfo] = React.useState([] as carsDataType)

  React.useEffect(() => {
    async function fetchData() {
      try {
        const cars = await axios.get('http://127.0.0.1:3000/garage?_page=1&_limit=7')
        setTotalCar(Number(cars.headers['x-total-count']))
        setData(cars.data)
        load(1, '')
      } catch (error) {
        alert('Please start server')
      }
    }
    fetchData()
  }, [])

  function load(page: number, sort: string) {

    const sortType = sort === '' ? '' : `&_sort=${sort}`
    const winArr: carsDataType = []
    axios.get(`http://127.0.0.1:3000/winners?_page=${page}&_limit=10${sortType}`)
      .then(res => {
        setTotalWinners(Number(res.headers['x-total-count']))
        sort === 'wins' ? setWinners(res.data.reverse()) : setWinners(res.data)
        const request = res.data.map((el: { id: number }) => axios.get(`http://127.0.0.1:3000/garage/${el.id}`))
        Promise.all(request)
          .then(response => {
            response.forEach(item => {
              winArr.push(item.data)
            })
            setWinInfo(winArr)
          })
      })
  }

  return (
    <AppContext.Provider value={{ load }}>
      <div className='App'>
        <>
          <button onClick={() => setGarage(true)}>TO GARAGE</button>
          <button onClick={() => setGarage(false)}>TO WINNERS</button>
        </>
        <Winners
          isGarage={isGarage}
          winners={winners}
          totalWinners={totalWinners}
          winInfo={winInfo}
        />
        <Garage
          isGarage={isGarage}
          carsData={data}
          setCarsData={setData}
          totalCars={totalCars}
          setTotalCar={setTotalCar}
        />
      </div>
    </AppContext.Provider>
  );
}

export default App;
