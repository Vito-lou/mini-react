function createTextNode(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: [],
        },
    };
}

function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map((child) => {
                //child 极有可能是一个字符串，也有可能是一个数字
                const isTextNode =
                    typeof child === "string" || typeof child === "number";
                return isTextNode ? createTextNode(child) : child;
            }),
        },
    };
}

function render(el, container) {
    // debugger
    nextWorkOfUnit = {
        dom: container,
        props: {
            children: [el],
        },
    };
    root = nextWorkOfUnit
}

let root = null
let nextWorkOfUnit = null;
function workLoop(deadline) {
    let shouldYield = false;
    //注意走到最后一个节点的时候，节点后面一个会是undefined, 因此这里要加上nextWorkOfUnit判断拦截一下，防止报错
    while (!shouldYield && nextWorkOfUnit) {
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);

        shouldYield = deadline.timeRemaining() < 1;
    }
    //走到这里说明当前的链表处理完了
    if (!nextWorkOfUnit && root) {
        console.log(root)
        commitRoot();
    }
    requestIdleCallback(workLoop);
}

function commitRoot() {
    commitWork(root.child)
    //一定要设置为null， 不然会无限在浏览器空闲时调用commitRoot
    root = null
}

function commitWork(fiber) {
    if (!fiber) return;

    let fiberParent = fiber.parent
    //函数式组件内部还可能包含函数式组件，嵌套层级，那么需要一直找到非函数式组件的祖先节点
    while (!fiberParent.dom) {
        fiberParent = fiberParent.parent
    }

    if (fiber.dom) {
        fiberParent.dom.append(fiber.dom);
    }
    commitWork(fiber.child);
    commitWork(fiber.sibling);
}


function createDom(type) {
    return type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(type);
}

function updateProps(dom, props) {
    Object.keys(props).forEach((key) => {
        if (key !== "children") {
            dom[key] = props[key];
        }
    });
}

//注意，函数式组件的children是通过fiber.type()函数执行得到的，可以打印试试
function initChildren(fiber, children) {
    const isFunctionComponent = typeof fiber.type === 'function'
    if (isFunctionComponent) {
        //思考：为什么下面加这行打印就是会报错，不加就能渲染出来？
        // console.log(44, fiber.type())
    }
    let prevChild = null;
    children.forEach((child, index) => {
        const newFiber = {
            type: child.type,
            props: child.props,
            child: null,
            parent: fiber, //设置parent是为了将来方便找叔叔节点
            sibling: null,
            dom: null,
        };

        if (index === 0) {
            fiber.child = newFiber;
        } else {
            prevChild.sibling = newFiber;
        }
        //第一次循环，把当前的child设置为prevChild,这样后面每次循环，就方便设置当前节点为prevChild的sibling了
        prevChild = newFiber;
    });
}

function updateFunctionComponent(fiber) {
    const children = [fiber.type(fiber.props)];

    initChildren(fiber, children);
}

function updateHostComponent(fiber) {
    if (!fiber.dom) {
        const dom = (fiber.dom = createDom(fiber.type));

        updateProps(dom, fiber.props);
    }

    const children = fiber.props.children;
    initChildren(fiber, children);
}
//1. 创建DOM
//2. 处理props
//3. 转换链表，设置好指针
//4. 返回下一个要执行的任务
function performWorkOfUnit(fiber) {
    const isFunctionComponent = typeof fiber.type === "function";

    if (isFunctionComponent) {
        updateFunctionComponent(fiber)
    } else {
        updateHostComponent(fiber)
    }

    // 4. 返回下一个要执行的任务
    if (fiber.child) {
        return fiber.child;
    }

    //这一段不要了，因为下面的循环里面已经做了判断
    // if (fiber.sibling) {
    //     return fiber.sibling;
    // }

    //注意这段逻辑非常重要： 没有下面这段，在app.jsx里面无法渲染两个同级别函数式组件；注意同级别；链表是先走完第一个函数式组件树fiber然后才能去找第二个函数式组件的
    //函数式组件里面，假设结构是： root包含两个先后两个函数式节点，函数式节点下面各有一个div， div里面有text; 当走到第一个函数式节点最底下的text的时候，由于text下面没有
    //child也没有sibling,所以需要找text的父级节点也就是div，可以div你发现也是没有sibling的，只有div的父级也就是函数式组件自身的fiber才有sibling; 
    //因此下面需要做一个递归查找有sibling的父级节点
    let nextFiber = fiber;
    while (nextFiber) {
        if (nextFiber.sibling) return nextFiber.sibling
        nextFiber = nextFiber.parent
    }
    // return fiber.parent?.sibling;
}

requestIdleCallback(workLoop);

const React = {
    render,
    createElement,
};

export default React;
