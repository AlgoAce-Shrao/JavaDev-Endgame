# Multitasking:
- Multitasking allows an operating system to run multiple processes simultaneously. On single-core CPUs, this is done through time- sharing, rapidly switching between tasks. On multi-core CPUs, true parallel execution occurs, with tasks distributed across cores. The OS scheduler balances the load, ensuring efficient and responsive system performance.

- Multitasking utilizes the capabilities of a CPU and its cores. When an operating system performs multitasking, it can assign different tasks to different cores. This is more efficient than assigning all tasks to a single core.

# Multithreading:

## Thread
    Smallest unit of exectuion of a program which runs independently

- Multithreading refers to the ability to execute multiple threads within a single process concurrently.


1. In Java, multithreading is the concurrent execution of two or more threads to maximize the utilization of the CPU. Java's multithreading capabilities are part of the java.lang package, making it easy to implement concurrent execution.

2.In a single-core environment, Java's multithreading is managed by the JVM and the OS, which switch between threads to give the illusion of concurrency.

The threads share the single core, and time-slicing is used to manage thread execution.

2. In a multi-core environment, Java's multithreading can take full advantage of the available cores.

The JVM can distribute threads across multiple cores, allowing true parallel execution of thread

3. A thread is a lightweight process, the smallest unit of processing. Java supports multithreading through its java.lang.Thread class and the java.lang.Runnable interface.

💡💡💡 When a Java program starts, one thread begins running immediately, which is called the main thread. This thread is responsible for executing the main method of a program.