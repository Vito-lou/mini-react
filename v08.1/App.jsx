import React from "./core/React.js"

//setBar值跟bar的初始值一样，期望不要触发重新更新
function Foo() {
    console.log('return foo')
    const [bar, setBar] = React.useState('bar')
    function handleClick() {
        // setBar('bar')
        setBar(() => 'bar')
    }
    return (
        <div>
            <h1>foo</h1>
            <div>{bar}</div>
            <button onClick={handleClick}>click</button>
        </div>
    )
}

function App() {
    return (
        <div>
            hi-mini-react
            <Foo></Foo>
        </div>
    )
}
export default App