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
  const prev$ = fromEvent(window, 'mouseup').pipe(
      mapTo(state => ({ ...state, prevX: state.x || 0, prevY: state.y || 0 })),
  )
  const drag$ = merge(
      move$.pipe(map(([x, y]) => ({ x, y }))),
      move$.pipe(map(([x1, y1]) => ({ x1, y1 })), delay(100)),
      move$.pipe(map(([x2, y2]) => ({ x2, y2 })), delay(200)),
      move$.pipe(map(([x3, y3]) => ({ x3, y3 })), delay(300)),
  )
  state$.update(merge(drag$, prev$))
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
