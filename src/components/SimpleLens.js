import dive from 'divejs'
import {combineLatest, merge} from 'rxjs'
import {map, mapTo} from 'rxjs/operators'
import React from 'react'
import styles from './styles.module.scss'
import ComplexLens1 from './ComplexLens1'
import ComplexLens2 from './ComplexLens2'

const SimpleLens = dive({
  state: { hello: 1 },
})(({ state$, eventHandle }) => {
  merge(
      ComplexLens1.globalEvent.event('add'),
      eventHandle.event('add'),
  )
      .reduce(_ => state => {
        state.hello++
      })
  return combineLatest(
      ComplexLens2.globalState$,
      state$,
  ).pipe(
      map(([complex, state]) => {
        return (
            <div className={styles.box}>
              <div>
                <div>simple-lens</div>
                <div>hello:{state.hello}</div>
                <div>Complex2Hello:{complex.hello}</div>
              </div>
            </div>
        )
      }),
  )
})
export default SimpleLens
