import dive from 'divejs'
import {merge,combineLatest} from 'rxjs'
import {map, mapTo} from 'rxjs/operators'
import React from 'react'
import styles from './styles.module.scss';

const WithoutLens = dive({ state: { ownHello: 1 } })(({ props$, state$, eventHandle }) => {
  state$.update(
      merge(
          eventHandle.event('add').pipe(
              mapTo(state => ({ ...state, ownHello: state.ownHello + 1 })),
          ),
      ),
  )
  return combineLatest(
      props$,
      state$,
      ({hello},{ownHello})=>(
          <div className={styles.box}>
            <div>
              <h3>without-lens</h3>
              <h4>props hello:{hello}</h4>
              <h4>ownHello:{ownHello}
                <button onClick={eventHandle.handle('add')}>+</button>
              </h4>
            </div>
          </div>
      )
  )
})
export default WithoutLens
