/** @jsx CReact.createElement */
import CReact from "./core/React.js"

//注意不能写成小写，jsx只会把大写字母开头的标签当作组件调用，小写字母开头的就是html标签
function Counter() {
    return <div>count </div>
}
function CounterContainer() {
    return <Counter></Counter>
}
console.log(123)

// const App = (
//     <div id='test'>
//         hi-mini-react
//         {/* <Counter></Counter> */}
//         <CounterContainer></CounterContainer>
//     </div>
// )
function App() {
    return (
        <div id='test'>
            hi-mini-react
            {/* <Counter></Counter> */}
            <CounterContainer></CounterContainer>
        </div>
    )
}
export default App;
