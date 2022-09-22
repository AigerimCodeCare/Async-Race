import axios from 'axios';
import React from 'react';
import { CardPropsType } from '../../types/types';
import { ReactComponent as Car } from '../../assets/car.svg'
import Finish from '../../assets/finish.svg'
import g from './Garage.module.css'

const Card: React.FC<CardPropsType> = ({ id, color, reset, setReset, speed, raceClick, setRaceClick, showWinner, name, isStart }) => {
  let requestId: number
  let duration: number

  const [engineOn, setEngineOn] = React.useState(false)
  const [startOn, setStartOn] = React.useState(false)
  const [disableStop, setDisableStop] = React.useState(false)
  const [ride, setRide] = React.useState(0)

  let errStatus = 0

  const raceReq = () => {
    axios.patch(`http://127.0.0.1:3000/engine?id=${id}&status=drive`)
      .catch(err => errStatus = err.response.status)
  }

  React.useEffect(() => {
    if (reset) {
      setRide(0)
      setReset()
    }
    if (speed !== undefined && ride === 0 && raceClick) {
      raceReq()
      animate({
        duration: speed,
        timing(timeFraction: any) {
          return timeFraction;
        },
        draw(progress: any) {
          setRide(progress * 100)
        },
        reset,
        errStatus
      });
      setRaceClick(false)
    }
  }, [speed])

  function animate({ timing, draw, duration }: { timing: any, draw: any, duration: number, reset: boolean, errStatus: any }) {
    const start = performance.now();

    requestId = requestAnimationFrame(function animate(time) {
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;
      const progress = timing(timeFraction);
      draw(progress);
      if (errStatus === 500) {
        setStartOn(!startOn)
        setDisableStop(true)
        return cancelAnimationFrame(requestId);
      }
      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      }
      if (timeFraction === 1) {
        setStartOn(!startOn)
        setDisableStop(true)
        if (isStart) {
          showWinner(id, name, speed)
        }
      }
    });
  }

  const engineStart = async (id: number) => {
    if (reset) {
      setRide(0)
      setReset()
    }
    await axios.patch(`http://127.0.0.1:3000/engine?id=${id}&status=started`)
      .then(res => {
        duration = res.data.distance / res.data.velocity
        axios.patch(`http://127.0.0.1:3000/engine?id=${id}&status=drive`)
          .catch(err => errStatus = err.response.status)
      })
    setEngineOn(!engineOn)


    animate({
      duration: duration,
      timing(timeFraction: any) {
        return timeFraction;
      },
      draw(progress: any) {
        setRide(progress * 100)
      },
      reset,
      errStatus
    });
  }

  const engineStop = (id: number) => {

    setEngineOn(!engineOn)
    setRide(0)
    setStartOn(false)

  }
  const disableReset = () => {
    cancelAnimationFrame(requestId)
    return 0
  }

  React.useEffect(() => {
    if (reset) {
      if (disableStop) {
        setEngineOn(false)
        setStartOn(false)
        setRide(0)
        setDisableStop(false)
      }
    }
  }, [reset, disableStop])

  return (
    <div>
      <div className={g.start__btn}>
        <button disabled={engineOn}
          onClick={() => { engineStart(id) }}>
          Start
        </button>
        <button disabled={!startOn}
          onClick={() => engineStop(id)}>
          Stop
        </button>
      </div>
      <div className={g.road__wrapper}>
        <div className={g.car}>
          <Car
            key={id}
            className={g.carImg}
            width='90'
            height='40'
            fill={color}
            style={{ left: `${reset && !disableStop ? disableReset() : ride}%` }} />
        </div>
        <img src={Finish} alt="finish" />
      </div>
    </div>
  )
}

export default Card