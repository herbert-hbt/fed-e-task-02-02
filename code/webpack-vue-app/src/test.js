import { F } from './testcopy'

export const a = () => {
  console.log(F)
  // alert(F)
}
if (module.hot) {
  module.hot.accept('./testcopy.js', () => {
    console.log(F)
  })
}
