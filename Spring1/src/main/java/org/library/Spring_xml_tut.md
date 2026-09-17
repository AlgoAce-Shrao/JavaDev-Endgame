# Spring Project using XML Based Configuration


### We shall be implementing the configuration by implementing a simple project:

🧩 Project Context: Smart Library Management System (Core Backend)
🎯 Real-life analogy:

Think of a small college library system where:

Students borrow books
Librarian manages inventory
System tracks due dates & fines
🧠 What YOU will build (Business Logic Focus)

You’ll implement:

1. Book Management
   - Add book
   - Search book
   - Check availability
2. - User (Student) Management
   - Register student
   - View borrowed books
3. Borrowing System
   - Issue book
   - Return book
   - Calculate fine (basic logic)


⚙️ Where Spring XML comes in (core learning)

You’ll use XML to wire everything:

💡 Beans you will create:
- BookService
- UserService
- LibraryService
- FineCalculator
- BookRepository
- UserRepository
🔗 Relationships (this is where magic happens)
LibraryService depends on:
- BookService
- UserService
- FineCalculator
- BookService → BookRepository
- UserService → UserRepository

👉 You’ll configure all of this in applicationContext.xml


```
com.library
├── model
│    ├── Book
│    ├── User
│
├── repository
│    ├── BookRepository
│    ├── UserRepository
│
├── service
│    ├── BookService
│    ├── UserService
│    ├── LibraryService
│    ├── FineCalculator
│
├── main
│    ├── App.java
```
