import React from "./core/React.js"

//点一下任意子组件，发现3个组件都重新执行了
let countFoo = 1
function Foo() {
    console.log('foo return')
    function handleClick() {
        countFoo++
        React.update()
    }
    return (
        <div>
            <h1>foo</h1>
            {countFoo}
            <button onClick={handleClick}>click</button>
        </div>
    )
}

let countBar = 1
function Bar() {
    console.log('bar return')
    function handleClick() {
        countBar++
        React.update()
    }
    return (
        <div>
            <h1>bar</h1>
            {countBar}
            <button onClick={handleClick}>click</button>
        </div>
    )
}

let countRoot = 1
function App() {
    console.log('app return ')
    function handleClick() {
        countRoot++
        React.update()
    }
    return (
        <div>
            hi-mini-react count: {countRoot}
            <button onClick={handleClick}>click</button>
            <Foo></Foo>
            <Bar></Bar>
        </div>
    )
}
export default App