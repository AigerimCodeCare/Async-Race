export type GaragePropsType = {
  isGarage: boolean
  carsData: carsDataType
  setCarsData: (React.Dispatch<React.SetStateAction<carsDataType>>)
  setTotalCar: (React.Dispatch<React.SetStateAction<number>>)
  totalCars: number
}
export type carsDataType = {
  name: string
  color: string
  id: number
}[]
export type CreatePropsType = {
  create: (createValue: string, createColor: string) => void
  updateCar: updateCarType
  updateClick: (updateValue: string, updateColor: string, id: number) => void
}

export type updateCarType = {
  name: string
  color: string
  id: number
}
export type WinnersPropsType = {
  isGarage: boolean
  winners: winnersType
  totalWinners: number
  winInfo: carsDataType
}
export type CardPropsType = {
  id: number
  color: string
  reset: boolean
  setReset: () => void
  speed: number
  raceClick: boolean
  setRaceClick: (React.Dispatch<React.SetStateAction<boolean>>)
  showWinner: (id: number, name: string, result: number) => void
  name: string
  isStart: boolean

}

export type winnersType = {
  id: number
  wins: number
  time: number
}[]