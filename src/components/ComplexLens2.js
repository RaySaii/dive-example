import dive from 'divejs'
import {merge} from 'rxjs'
import {map, mapTo} from 'rxjs/operators'
import React from 'react'
import styles from './styles.module.scss'

const ComplexLens2 = dive({
  lens: {
    get: state => {
      return ({ ...state.complex2, hello: state.complex1.hello })
    },
    set: (state, ownState) => ({ ...state, complex2: ownState }),
  },
  state: { ownHello: 1 },
})(({ state$, eventHandle }) => {
  return {
    DOM: state$.pipe(
        map(state => {
          return (
              <div className={styles.box}>
                <div>
                  <div>complex-lens-2</div>
                  <div>get from complex1 hello:<span className={styles.common}>{state.hello}</span>
                  </div>
                  <div>ownHello:{state.ownHello}
                    <button onClick={eventHandle.handle('add')}>+</button>
                  </div>
                </div>
              </div>
          )
        }),
    ),
    reducer: eventHandle.event('add').pipe(
        mapTo(state => ({ ...state, ownHello: state.ownHello + 1 })),
    ),
  }
})
export default ComplexLens2
