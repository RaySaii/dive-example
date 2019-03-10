import dive, {debug, shouldUpdate} from 'divejs'
import {combineLatest, interval, merge} from 'rxjs'
import {map, mapTo, switchMapTo} from 'rxjs/operators'
import React from 'react'
import styles from './styles.module.scss'

export default dive()(({ state$, props$, eventHandle }) => {

  eventHandle.didMount.pipe(
      switchMapTo(interval(1000)),
  ).reduce(a => state => {
    state.a = a
  })

  return combineLatest(
      props$,
      state$,
      (props, state) => Object.assign({}, props, state),
  ).pipe(
      shouldUpdate((previous, current) => {
        return current.a > previous.min
      }),
      map(({ min, a, b }) => {
        return (
            <div className={styles.lifecycle_box}>
              <div>props min : {min}</div>
              <div>if state.a > props.min will show state.a : {a}</div>
            </div>
        )
      }),
  )
})
