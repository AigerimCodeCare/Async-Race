import nameRandom from './randomName';
import colorRandom from './randomColor';

const random = () => {
  const res = []
  for (let i = 0; i < 100; i++) {
    res.push({
      name: nameRandom(),
      color: colorRandom()
    })
  }
  return res
}

export default random