import dive from 'divejs'
import {map, mapTo, switchMap, takeUntil} from 'rxjs/operators'
import React from 'react'
import styles from './styles.module.scss'
import {fromEvent, merge} from 'rxjs'

export default dive({
  state: { prevX: 0, prevY: 0 },
})(({ state$, eventHandle }) => {
  eventHandle.event('down').pipe(
      switchMap(e => {
        const downX = e.clientX
        const downY = e.clientY
        return fromEvent(window, 'mousemove').pipe(
            map(moveEvent => [moveEvent.clientX - downX, moveEvent.clientY - downY]),
            takeUntil(fromEvent(window, 'mouseup')),
        )
      }),
  ).reduce(
      ([moveX, moveY]) => state => {
        state.x = moveX + state.prevX
        state.y = moveY + state.prevY
      },
  )
  fromEvent(window, 'mouseup').reduce(_ => state => {
        state.prevX = state.x || 0
        state.prevY = state.y || 0
      },
  )
  const mouseDown = eventHandle.handle('down')
  return state$.pipe(
      map((state) => {
        const { x, y } = state
        return (
            <div className={styles.drag_panel}>
              <div className={styles.drag_box} onMouseDown={mouseDown}
                   style={{ left: x, top: y }}>
                drag me
              </div>
            </div>
        )
      }),
  )
})
