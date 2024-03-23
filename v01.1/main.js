//v1
// console.log('main.js')
// const dom = document.createElement('div')
// dom.id = 'app'
// document.querySelector('#root').appendChild(dom)

// const textNode = document.createTextNode('');
// textNode.nodeValue = 'app'
// dom.appendChild(textNode)

//v2
//type props children
// const textEl = {
//     type: 'TEXT_ELEMENT',
//     props: {
//         nodeValue: 'app',
//         children: []
//     }
// }
// const el = {
//     type: 'div',
//     props: {
//         id: 'app',
//         children: [textEl]
//     }
// }
// const dom = document.createElement(el.type)
// dom.id = 'app'
// document.querySelector('#root').appendChild(dom)

// const textNode = document.createTextNode('');
// textNode.nodeValue = textEl.props.nodeValue
// dom.appendChild(textNode)

//v3
// const createTextNode = (text) => {
//     return {
//         type: 'TEXT_ELEMENT',
//         props: {
//             nodeValue: text,
//             children: []
//         }
//     }
// }

// const createElement = (type, props, ...children) => {
//     return {
//         type,
//         props: {
//             ...props,
//             children
//         }
//     }
// }
// const textEl = createTextNode('app')
// const App = createElement('div', { id: 'app' }, textEl)

// const dom = document.createElement(App.type)
// dom.id = App.props.id
// document.querySelector('#root').appendChild(dom)

// const textNode = document.createTextNode('');
// textNode.nodeValue = textEl.props.nodeValue
// dom.appendChild(textNode)

//v4
// function render(el, container) {
//     const dom = el.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type)

//     Object.keys(el.props).forEach((key) => {
//         if (key !== 'children') {
//             dom[key] = el.props[key]
//         }
//     })
//     const children = el.props.children
//     children.forEach((child) => {
//         render(child, dom)
//     })
//     container.appendChild(dom)
// }

// const createTextNode = (text) => {
//     return {
//         type: 'TEXT_ELEMENT',
//         props: {
//             nodeValue: text,
//             children: []
//         }
//     }
// }

// const createElement = (type, props, ...children) => {
//     return {
//         type,
//         props: {
//             ...props,
//             children
//         }
//     }
// }
// const textEl = createTextNode('app')
// const App = createElement('div', { id: 'app' }, textEl)
// render(App, document.querySelector('#root'))


//v5
// function render(el, container) {
//     const dom = el.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type)

//     Object.keys(el.props).forEach((key) => {
//         if (key !== 'children') {
//             dom[key] = el.props[key]
//         }
//     })
//     const children = el.props.children
//     children.forEach((child) => {
//         render(child, dom)
//     })
//     container.appendChild(dom)
// }

// const createTextNode = (text) => {
//     return {
//         type: 'TEXT_ELEMENT',
//         props: {
//             nodeValue: text,
//             children: []
//         }
//     }
// }

// const createElement = (type, props, ...children) => {
//     return {
//         type,
//         props: {
//             ...props,
//             children: children.map(child => {
//                 return typeof child === 'string' ? createTextNode(child) : child
//             })
//         }
//     }
// }
// const textEl = createTextNode('app')
// const App = createElement('div', { id: 'app' }, 'hilleo', 'another children')
// render(App, document.querySelector('#root'))


//v6
// function render(el, container) {
//     const dom = el.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type)

//     Object.keys(el.props).forEach((key) => {
//         if (key !== 'children') {
//             dom[key] = el.props[key]
//         }
//     })
//     const children = el.props.children
//     children.forEach((child) => {
//         render(child, dom)
//     })
//     container.appendChild(dom)
// }

// const createTextNode = (text) => {
//     return {
//         type: 'TEXT_ELEMENT',
//         props: {
//             nodeValue: text,
//             children: []
//         }
//     }
// }

// const createElement = (type, props, ...children) => {
//     return {
//         type,
//         props: {
//             ...props,
//             children: children.map(child => {
//                 return typeof child === 'string' ? createTextNode(child) : child
//             })
//         }
//     }
// }
// const textEl = createTextNode('app')
// const App = createElement('div', { id: 'app' }, 'hilleo', 'another children')

// const ReactDom = {
//     createRoot(container) {
//         return {
//             render(App) {
//                 render(App, container)
//             }
//         }
//     }
// }

// ReactDom.createRoot(document.querySelector('#root')).render(App)

//v7
// import React from "./core/React.js"
// import ReactDom from "./core/ReactDom.js"

// const App = React.createElement('div', { id: 'app' }, 'hilleo', 'another children')


// ReactDom.createRoot(document.querySelector('#root')).render(App)

//v8
import ReactDom from "./core/ReactDom.js"
import App from './App.js'

ReactDom.createRoot(document.querySelector('#root')).render(App)

//思考： 为什么要把React和ReactDom分包？
//接下来思考： 如何采用jsx的写法