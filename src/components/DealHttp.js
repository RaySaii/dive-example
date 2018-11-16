import dive from 'divejs'
import {merge, of} from 'rxjs'
import {map, mapTo, switchMap, debounceTime, filter, distinctUntilChanged} from 'rxjs/operators'
import React from 'react'
import styles from './styles.module.scss'
import {fromHttp, HttpComponent} from 'divejs/utils'

const DealHttp = dive({ lens: 'http', state: { repos: {} } })(({ state$, eventHandle }) => {
  const fetchRepos = (q) => fromHttp(
      fetch(`https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc`)
          .then(res => res.json()),
  )
  state$.update(
      merge(
          eventHandle.event('change').pipe(
              debounceTime(500),
              distinctUntilChanged(),
              switchMap(val => val ? fetchRepos(val) : of({})),
              map(repos => state => ({ ...state, repos })),
          ),
      ),
  )
  return state$.pipe(
      map(state => {
        return (
            <div className={styles.box}>
              <div>
                <div>git repository:</div>
                <input onChange={e => eventHandle.handle('change')(e.target.value)}/>
                <HttpComponent
                    status={state.repos.status}
                    loading={<div>Loading...</div>}
                    data={state.repos.data}
                    render={data => data.items.map((item, index) => (
                        <div key={index}>{item.name}</div>
                    ))}
                />
              </div>
            </div>
        )
      }),
  )
})
export default DealHttp
