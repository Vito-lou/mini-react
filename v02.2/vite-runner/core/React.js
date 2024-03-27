function createTextNode(text) {
    console.log("heiheihei!!!!!!!");
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
                return typeof child === "string" ? createTextNode(child) : child;
            }),
        },
    };
}

function render(el, container) {
    nextWorkOfUnit = {
        dom: container,
        props: {
            children: [el],
        },
    };
}

let nextWorkOfUnit = null;
function workLoop(deadline) {
    let shouldYield = false;
    //注意走到最后一个节点的时候，节点后面一个会是undefined, 因此这里要加上nextWorkOfUnit判断拦截一下，防止报错
    while (!shouldYield && nextWorkOfUnit) {
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);

        shouldYield = deadline.timeRemaining() < 1;
    }

    requestIdleCallback(workLoop);
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

function initChildren(fiber) {
    const children = fiber.props.children;
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

//1. 创建DOM
//2. 处理props
//3. 转换链表，设置好指针
//4. 返回下一个要执行的任务
function performWorkOfUnit(fiber) {
    //第一次调用的时候是有dom的，是那个根container
    if (!fiber.dom) {
        const dom = (fiber.dom = createDom(fiber.type));

        //相当于在父级元素append child
        fiber.parent.dom.append(dom);

        updateProps(dom, fiber.props);
    }
    //边建立关系，边进行渲染，而不是上来把整个链表的关系都建立起来
    initChildren(fiber)

    // 4. 返回下一个要执行的任务
    if (fiber.child) {
        return fiber.child;
    }

    if (fiber.sibling) {
        return fiber.sibling;
    }

    return fiber.parent?.sibling;
}

requestIdleCallback(workLoop);

const React = {
    render,
    createElement,
};

export default React;
