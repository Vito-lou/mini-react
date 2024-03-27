function createTextNode(text) {
    console.log("h12");
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
    fiber.parent.dom.append(fiber.dom);
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

        //相当于在父级元素append child----这个就可以去掉了；因为我们要统一提交，而不是每次浏览器空闲时间去创建dom
        // fiber.parent.dom.append(dom);

        updateProps(dom, fiber.props); //注意这行看起来是更新了dom的props属性，比如id这些字段属性，但是实际上也赋值给了fiber.dom；看上面的赋值等式
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
