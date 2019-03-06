import dive from 'divejs'
import {merge, combineLatest} from 'rxjs'
import {map, mapTo} from 'rxjs/operators'
import React from 'react'
import styles from './styles.module.scss'

const WithoutLens = dive({
  state: { ownHello: 1 },
})(({ props$, state$, eventHandle }) => {
  return {
    DOM: combineLatest(
        props$,
        state$,
        ({ hello }, { ownHello }) => (
            <div className={styles.box}>
              <div>
                <div>without-lens</div>
                <div>props hello:{hello}</div>
                <div>ownHello:{ownHello}
                  <button onClick={eventHandle.handle('add')}>+</button>
                </div>
              </div>
            </div>
        ),
    ),
    reducer: eventHandle.event('add').pipe(
        mapTo(state => ({ ...state, ownHello: state.ownHello + 1 })),
    ),
  }
})
export default WithoutLens
