import dive, {debug} from 'divejs'
import {merge} from 'rxjs'
import {map, mapTo} from 'rxjs/operators'
import React from 'react'
import styles from './styles.module.scss'

const ComplexLens1 = dive({
  state: { hello: 1 },
  globalEvent: ['add'],
})(({ state$, eventHandle }) => {
  eventHandle.event('add').reduce(_ => state => {
    state.hello++
  })

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
