import dive from 'divejs'
import {delay, map, mapTo, share, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators'
import React from 'react'
import styles from './styles.module.scss'
import {fromEvent, merge, of} from 'rxjs'

export default dive({
  state: { prevX: 0, prevY: 0 },
})(({ state$, eventHandle }) => {
  const move$ = eventHandle.event('down').pipe(
      switchMap(e => {
        const downX = e.clientX
        const downY = e.clientY
        return fromEvent(window, 'mousemove').pipe(
            map(moveEvent => [moveEvent.clientX - downX, moveEvent.clientY - downY]),
            takeUntil(fromEvent(window, 'mouseup')),
        )
      }),
  ).pipe(
      withLatestFrom(state$, ([moveX, moveY], { prevX, prevY }) => ([moveX + prevX, moveY + prevY])),
      share(),
  )
  fromEvent(window, 'mouseup').reduce(
      _ => state => {
        state.prevX = state.x || 0
        state.prevY = state.y || 0
      },
  )
  move$.reduce(([x, y]) => state => {
    state.x = x
    state.y = y
  })
  move$.pipe(delay(100)).reduce(([x, y]) => state => {
    state.x1 = x
    state.y1 = y
  })
  move$.pipe(delay(200)).reduce(([x, y]) => state => {
    state.x2 = x
    state.y2 = y
  })
  move$.pipe(delay(300)).reduce(([x, y]) => state => {
    state.x3 = x
    state.y3 = y
  })
  const mouseDown = eventHandle.handle('down')
  return state$.pipe(
      map(({ x, x1, x2, x3, y, y1, y2, y3 }) => {
        return (
            <div className={styles.drag_list_panel}>
              <div className={styles.list_box} style={{ left: x3, top: y3 }}/>
              <div className={styles.list_box} style={{ left: x2, top: y2 }}/>
              <div className={styles.list_box} style={{ left: x1, top: y1 }}/>
              <div className={styles.list_box} onMouseDown={mouseDown} style={{ left: x, top: y }}>
                drag me
              </div>
            </div>
        )
      }),
  )
})
