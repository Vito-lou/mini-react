/**
 * This code demonstrates a work loop. Each time the workLoop is called, it increments taskId and executes until deadline.timeRemaining() is less than 1 millisecond, indicating there isn't enough idle time to continue the current task. 
 * At this point, shouldYield becomes true, stopping the loop, and workLoop is queued again with requestIdleCallback(workLoop) for the next available idle period.

This example enlightens us on:

How to use requestIdleCallback for task splitting, breaking down long tasks into smaller chunks to avoid monopolizing the main thread for too long.
How to check for remaining idle time in the current frame to decide whether to yield control and pause the current task.
How to simulate React's work loop using a loop with conditional logic.
These principles are a version of the core ideas behind React's task scheduler. In reality, React's scheduler is much more complex, priority handling, error boundaries, suspension, resumption, and other mechanisms.
 */
let taskId = 0
const workLoop = (deadline) => {
    taskId++

    let shouldYield = false
    while (!shouldYield) {
        console.log(`taskId: ${taskId} is running`)
        shouldYield = deadline.timeRemaining() < 1
    }
    requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)