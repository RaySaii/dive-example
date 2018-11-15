import dive from 'divejs'
import {merge} from 'rxjs'
import {map, mapTo} from 'rxjs/operators'
import React from 'react'
import styles from './styles.module.scss'

const SimpleLens = dive({ lens: 'simple', state: { ownHello: 1 } })(({ state$, eventHandle }) => {
  state$.update(
      merge(
          eventHandle.event('add').pipe(
              mapTo(state => ({ ...state, ownHello: state.ownHello + 1 })),
          ),
      ),
  )
  return state$.pipe(
      map(state => {
        return (
            <div className={styles.box}>
              <div>
                <h3>simpleLens</h3>
                <h4>change from complex1 hello:{state.hello}</h4>
                <h4>ownHello:{state.ownHello}</h4>
              </div>
            </div>
        )
      }),
  )
})
export default SimpleLens
