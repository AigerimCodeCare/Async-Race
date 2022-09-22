import { WinnersPropsType, winnersType } from '../../types/types'
import s from './Winner.module.css'
import React from 'react';
import { AppContext } from './../../App';
import g from '../garage/Garage.module.css'
import { ReactComponent as Car } from '../../assets/car.svg'

const Winners: React.FC<WinnersPropsType> = ({ isGarage, winners, totalWinners, winInfo }) => {

  const { load } = React.useContext(AppContext)
  // eslint-disable-next-line prefer-const
  let [page, setPage] = React.useState(1)

  const nextPage = () => {
    setPage((page += 1))
    load(page, '')
  }
  const prevPage = () => {
    setPage((page += -1))
    load(page, '')
  }

  const winnerItem = (winners: winnersType) => {
    return (
      <>
        {winners.map((e, i) => {
          return (
            <div key={i} className={s.winner}>
              <div className={s.wins}>{e.wins}</div>
              <div>{e.time}</div>
            </div>
          )
        })}
      </>
    )
  }

  const winnersData = () => {
    return (
      <>
        {winInfo.map((e, i) => {
          return (
            <div key={e.id} className={s.winner}>
              <div>{i + 1}</div>
              <div>
                <Car
                  className={g.carImg}
                  width='50'
                  height='40'
                  fill={e.color} />
              </div>
              <div className={s.name}>{e.name}</div>
            </div>
          )
        })}
      </>
    )
  }
  return (
    <div className={s.wrapper} style={isGarage ? { display: 'none' } : { display: 'block' }}    >
      <h4>Winners: ({totalWinners})</h4>
      <div>Page: {page}</div>
      <div className={s.winnerHeader}>
        <div>Number</div>
        <div>Car</div>
        <div className={s.headerName}>Name</div>
        <div className={s.headerWins} onClick={() => load(page, 'wins')}>Wins</div>
        <div className={s.headerTime} onClick={() => load(page, 'time')}>Time(s)</div>
      </div>
      <div className={s.infoWrapper}>
        <div>
          {winnersData()}
        </div>
        <div>
          {winnerItem(winners)}
        </div>
      </div>
      <div className={g.pageBtn}>
        <button disabled={page === 1} onClick={prevPage}>prev</button>
        <button disabled={page === Math.ceil(totalWinners / 10)} onClick={nextPage}>next</button>
      </div>
    </div>
  )
}

export default Winners