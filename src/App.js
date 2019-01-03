import React, {Component} from 'react'
import './App.css'
import WithoutLens from './components/WithoutLens'
import SimpleLens from './components/SimpleLens'
import ComplexLens1 from './components/ComplexLens1'
import ComplexLens2 from './components/ComplexLens2'
import DealHttp from './components/DealHttp'
import Drag from './components/Drag'
import Resizer from './components/Resizer'
import DragList from './components/DragList'
import dive,{setDevTool} from 'divejs';
setDevTool(true)
class App extends Component {
  render() {
    return (
        <div className="App">
          <Drag/>
          <Resizer/>
          <DragList/>
          <div className="data-panel">
            <div className="box1">
              <WithoutLens hello={333}/>
              <SimpleLens/>
              <ComplexLens1/>
              <ComplexLens2/>
            </div>
            <DealHttp/>
          </div>
        </div>
    )
  }
}

export default App
