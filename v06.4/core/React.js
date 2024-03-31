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
    wipRoot = {
        dom: container,
        props: {
            children: [el],
        },
    };
    nextWorkOfUnit = wipRoot
}
//之前叫root节点，我们发现这个节点后面是一直在不断的构建，直到最终提交commitwork
//因此可以认为这个叫root的节点是 work in progress，正在工作中的root; 因此改名叫wipRoot
let wipRoot = null
let currentRoot = null // 调用update更新的时候用到
let nextWorkOfUnit = null;
let deletions = []
let wipFiber = null // 记录function component的fiber
function workLoop(deadline) {
    let shouldYield = false;
    //注意走到最后一个节点的时候，节点后面一个会是undefined, 因此这里要加上nextWorkOfUnit判断拦截一下，防止报错
    while (!shouldYield && nextWorkOfUnit) {
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
        //foo节点后面是bar节点，这里想找一下当前组件是不是走完了，即将开始渲染下一个组件；这样可以作为控制精确渲染的结尾
        if (wipRoot?.sibling?.type === nextWorkOfUnit?.type) {
            console.log('hit', wipRoot, nextWorkOfUnit)
            nextWorkOfUnit = undefined
        }
        shouldYield = deadline.timeRemaining() < 1;
    }
    //走到这里说明当前的链表处理完了
    if (!nextWorkOfUnit && wipRoot) {
        commitRoot();
    }
    requestIdleCallback(workLoop);
}

function commitRoot() {
    deletions.forEach(commitDeletion)
    commitWork(wipRoot.child)
    //一定要设置为null， 不然会无限在浏览器空闲时调用commitRoot
    currentRoot = wipRoot //初始化结束以后，就把这个root存下来。保证后续update的时候，自动拿到当前的root
    wipRoot = null
    deletions = []
}
function commitDeletion(fiber) {
    if (fiber.dom) {
        let fiberParent = fiber.parent
        while (!fiberParent.dom) {
            fiberParent = fiberParent.parent
        }
        fiberParent.dom.removeChild(fiber.dom)
    } else {
        commitDeletion(fiber.child)
    }

}
function commitWork(fiber) {
    if (!fiber) return;

    let fiberParent = fiber.parent
    //函数式组件内部还可能包含函数式组件，嵌套层级，那么需要一直找到非函数式组件的祖先节点
    while (!fiberParent.dom) {
        fiberParent = fiberParent.parent
    }

    if (fiber.effectTag === 'update') {
        updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
    } else if (fiber.effectTag === 'placement') {
        if (fiber.dom) {
            fiberParent.dom.append(fiber.dom);
        }
    }


    commitWork(fiber.child);
    commitWork(fiber.sibling);
}


function createDom(type) {
    return type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(type);
}

function updateProps(dom, nextProps, prevProps) {
    // debugger
    //分析：总共三种情况
    //1. old 有，new没有，需要删除
    //2. old没有，new有， 需要添加
    //3. old 有，new也有，需要修改
    //其实分析，2和3可以认为是同一种处理方式，因为对于props更新来讲，如果出现第二种情况，那么oldprops是undefined这种情况，那么也是需要去修改去给节点进行赋值
    //下面实现：
    //1. old 有，new没有，需要删除
    Object.keys(prevProps).forEach(key => {
        if (key !== 'children') {
            if (!(key in nextProps)) {
                dom.removeAttribute(key)
            }
        }
    })
    //2. old没有，new有， 需要添加
    //3. old 有，new也有，需要修改
    Object.keys(nextProps).forEach((key) => {
        if (key !== "children") {
            if (nextProps[key] !== prevProps[key]) {
                // debugger
                if (key.startsWith('on')) {
                    const eventType = key.slice(2).toLowerCase()
                    //一定要注意，绑定事件的时候，每次渲染，函数都会重新生成；不然也走不到这里来nextProps[key] !== prevProps[key]
                    // 每次渲染的函数都不想等，这也就导致每次渲染，dom上之前绑定的事件监听器还在，因此需要清除事件监听，并且更重要的是清除之前绑定的
                    //事件监听
                    dom.removeEventListener(eventType, prevProps[key])
                    // 删除要是写成下面这个就错了，因为我们是要remove掉之前的监听器
                    // dom.removeEventListener(eventType, nextProps[key])
                    dom.addEventListener(eventType, nextProps[key])
                } else {
                    dom[key] = nextProps[key];
                }
            }

        }
    });
}

//注意，函数式组件的children是通过fiber.type()函数执行得到的，可以打印试试
function reconcileChildren(fiber, children) {
    //注意一开始oldFiber 是可以取child
    //但是一旦一个节点下面有两个节点，那么oldfiber需要更新成sibling
    let oldFiber = fiber.alternate?.child;
    let prevChild = null;
    children.forEach((child, index) => {
        // debugger
        const isSameType = oldFiber && oldFiber.type === child.type
        let newFiber
        if (isSameType) {
            //update
            newFiber = {
                type: child.type,
                props: child.props,
                child: null,
                parent: fiber, //设置parent是为了将来方便找叔叔节点
                sibling: null,
                dom: oldFiber.dom, //因为是更新，是不需要创建dom的，所以就用老的dom就可以
                effectTag: 'update',  //这个标识，是用来将来commitWork的时候区分到底这个节点上要更新还是要创建
                alternate: oldFiber //别忘了指向老的节点
            };

        } else {
            //create
            //有可能child是false
            if (child) {
                newFiber = {
                    type: child.type,
                    props: child.props,
                    child: null,
                    parent: fiber, //设置parent是为了将来方便找叔叔节点
                    sibling: null,
                    dom: null,
                    effectTag: 'placement'  //这个标识，是用来将来commitWork的时候区分到底这个节点上要更新还是要创建
                };
            }

            if (oldFiber) {
                deletions.push(oldFiber)
            }
            // console.log('should delete fiber', oldFiber)
        }
        //当处理第二个孩子的时候，就一定是需要更新oldFiber； 也就是index=0走完以后，接下来走index=1开始，指针需要改变
        if (oldFiber) {
            oldFiber = oldFiber.sibling
        }

        if (index === 0) {
            fiber.child = newFiber;
        } else {
            prevChild.sibling = newFiber;
        }
        //第一次循环，把当前的child设置为prevChild,这样后面每次循环，就方便设置当前节点为prevChild的sibling了
        if (newFiber) {
            prevChild = newFiber;
        }

    });
    while (oldFiber) {
        deletions.push(oldFiber)
        oldFiber = oldFiber.sibling
    }
}

function updateFunctionComponent(fiber) {
    //标记记录一下当前组件的头，为了方便后续只重新渲染当前组件
    wipFiber = fiber;

    const children = [fiber.type(fiber.props)];

    reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
    if (!fiber.dom) {
        const dom = (fiber.dom = createDom(fiber.type));

        updateProps(dom, fiber.props, {});
    }

    const children = fiber.props.children;
    reconcileChildren(fiber, children);
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

function update() {
    let currentFiber = wipFiber
    return () => {
        console.log(1, currentFiber)
        wipRoot = {
            ...currentFiber,
            alternate: currentFiber
        }
        nextWorkOfUnit = wipRoot
    }

}

function useState(initial) {
    let currentFiber = wipFiber
    //后： 因为之前存了一下，所以现在拿出来
    const oldHook = currentFiber.alternate?.stateHook
    const stateHook = {
        state: oldHook ? oldHook.state : initial  //注意initial只是初始化的值，每次组件渲染，不可能值都变成初始化的，而是取上一次的值
    }
    //先： 存一下，这样后面重新渲染的时候，不会说每次的state值都是10，而是会有记录，从记录里面拿上次渲染的state值
    currentFiber.stateHook = stateHook
    function setState(action) {
        stateHook.state = action(stateHook.state)
        wipRoot = {
            ...currentFiber,
            alternate: currentFiber
        }
        nextWorkOfUnit = wipRoot
    }
    return [stateHook.state, setState]
}
const React = {
    update,
    useState,
    render,
    createElement,
};

export default React;
