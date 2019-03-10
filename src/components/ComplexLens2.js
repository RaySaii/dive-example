import dive from 'divejs'
import {merge} from 'rxjs'
import {map, mapTo} from 'rxjs/operators'
import React from 'react'
import styles from './styles.module.scss'

const ComplexLens2 = dive({
  state: { hello: 1 },
  globalState: ['hello'],
})(({ state$, eventHandle }) => {
  eventHandle.event('add').reduce(_ => state => {
    state.hello++
  })
  return state$.pipe(
      map(state => {
        return (
            <div className={styles.box}>
              <div>
                <div>complex-lens-2</div>
                <div>hello:{state.hello}
                  <button onClick={eventHandle.handle('add')}>+</button>
                </div>
              </div>
            </div>
        )
      }),
  )
})
export default ComplexLens2
