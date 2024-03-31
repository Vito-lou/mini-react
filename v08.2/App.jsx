import React from "./core/React.js"

//setBar值跟bar的初始值一样，期望不要触发重新更新
function Foo() {
    console.log('return foo')
    const [count, setCount] = React.useState(10)
    const [bar, setBar] = React.useState('bar')
    function handleClick() {
        setCount(count => count + 1)
        setBar(() => 'bar')
    }
    // React.useEffect(() => {
    //     console.log('enter init effect')
    // }, [])
    //点击不会再次触发
    // React.useEffect(() => {
    //     console.log('enter count effect')
    // }, [11])
    // React.useEffect(() => {
    //     console.log('enter count effect', count)
    // }, [count])
    React.useEffect(() => {
        console.log('init')
        return () => {
            console.log('cleanup 0')
        }
    }, [])

    React.useEffect(() => {
        console.log('update', count)
        return () => {
            console.log('cleanup 1')
        }
    }, [count])

    React.useEffect(() => {
        console.log('update', count)
        return () => {
            console.log('cleanup 2')
        }
    }, [count])
    return (
        <div>
            <h1>foo</h1>
            {count}
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