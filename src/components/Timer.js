import dive, {debug} from 'divejs'
import React from 'react'
import {concat, map, switchMap, switchMapTo, take, takeWhile, withLatestFrom} from 'rxjs/operators'
import {combineLatest, interval, timer} from 'rxjs'
import styles from './styles.module.scss'


export default dive({
  state: {
    rest: 0,
  },
})(({ state$, props$, eventHandle }) => {
  return {
    DOM: state$.pipe(
        map(({ rest }) => {
          return <div className={styles.box}>
            <button disabled={rest}
                    onClick={eventHandle.handle('count')}>{rest ? (rest + '秒后重试') : '点击开始计时'}</button>
          </div>
        }),
    ),
    reducer: eventHandle.event('count').pipe(
        withLatestFrom(props$, (_, { duration }) => duration),
        switchMap(duration =>
            timer(0, 1000).pipe(
                map(num => duration - num),
                takeWhile(rest => rest >= 0),
                map(rest => ({ rest })),
            ),
        ),
    ),
  }
})
