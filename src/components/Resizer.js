import dive from 'divejs'
import {map, switchMap, takeUntil} from 'rxjs/operators'
import React, {useRef} from 'react'
import styles from './styles.module.scss'
import {fromEvent} from 'rxjs'

const Resizer = dive({
  state: { leftX: null },
})(({ state$, eventHandle }) => {

  const mouseDown = eventHandle.handle('down')
  eventHandle.event('down').pipe(
      switchMap(e => {
        const leftStyle = getComputedStyle(document.body.querySelector('.' + styles.left))
        const width = parseFloat(leftStyle.getPropertyValue('width'))
        const startX = e.clientX
        return fromEvent(window, 'mousemove').pipe(
            map(e => e.clientX - startX + width),
            takeUntil(fromEvent(window, 'mouseup')),
        )
      }),
  ).reduce(leftX => state => {
    state.leftX = leftX
  })

  return state$.pipe(
      map(({ leftX }) => {
        const leftStyle = {
          flexBasis: leftX === null ? 0 : leftX,
          flexGrow: leftX === null ? 1 : 0,
          flexShrink: 0,
        }
        return (
            <div className={styles.resizer_panel}>
              <div className={styles.left} style={leftStyle}>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta
                  minus molestiae vel beatae natus eveniet ratione temporibus aperiam
                  harum alias officiis assumenda officia quibusdam deleniti eos
                  cupiditate dolore doloribus!
                </p>
                <p>
                  Ad dolore dignissimos asperiores dicta facere optio quod commodi nam
                  tempore recusandae. Rerum sed nulla eum vero expedita ex delectus
                  voluptates rem at neque quos facere sequi unde optio aliquam!
                </p>
              </div>
              <div className={styles.resizer} onMouseDown={mouseDown}>
                drag me
              </div>
              <div className={styles.right}>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta
                  minus molestiae vel beatae natus eveniet ratione temporibus aperiam
                  harum alias officiis assumenda officia quibusdam deleniti eos
                  cupiditate dolore doloribus!
                </p>
                <p>
                  Ad dolore dignissimos asperiores dicta facere optio quod commodi nam
                  tempore recusandae. Rerum sed nulla eum vero expedita ex delectus
                  voluptates rem at neque quos facere sequi unde optio aliquam!
                </p>
              </div>
            </div>
        )
      }),
  )
})
export default Resizer
