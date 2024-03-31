import React from "./core/React.js"

function Foo() {
    const [count, setCount] = React.useState(10)
    console.log(count, setCount)
    function handleClick() {
        setCount((c) => c + 1)
    }
    return (
        <div>
            <h1>foo</h1>
            {count}
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