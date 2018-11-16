import dive from 'divejs'
import {merge} from 'rxjs'
import {map, mapTo} from 'rxjs/operators'
import React from 'react'
import styles from './styles.module.scss'

const ComplexLens1 = dive({
  lens: {
    get: state => state.complex1,
    set: (state, ownState) => ({ ...state, complex1: ownState, simple: { ...state.simple, hello: ownState.hello } }),
  },
  state: { hello: 1 },
})(({ state$, eventHandle }) => {
  state$.update(
      merge(
          eventHandle.event('add').pipe(
              mapTo(state => ({ ...state, hello: state.hello + 1 })),
          ),
      ),
  )
  return state$.pipe(
      map(state => {
        return (
            <div className={styles.box}>
              <div>
                <div>complex-lens-1</div>
                <div>hello:<span className={styles.common}>{state.hello}</span>
                  <button onClick={eventHandle.handle('add')}>+</button>
                </div>
              </div>
            </div>
        )
      }),
  )
})
export default ComplexLens1
