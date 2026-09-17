# 🚀 JDBC Complete Notes (Beginner → Advanced)

---

# 🔷 1. What is JDBC?

**JDBC (Java Database Connectivity)** is an API that allows Java programs to interact with databases.

### 💡 Purpose:

* Execute SQL queries
* Retrieve data
* Update database

---

# 🔷 2. JDBC Architecture (Mental Model)

```
Java App → JDBC API → DriverManager → JDBC Driver → Database
```

---

# 🔷 3. Steps in JDBC

1. Load Driver (optional now)
2. Create Connection
3. Create Statement
4. Execute Query
5. Process Result
6. Close Resources

---

# 🔷 4. JDBC Drivers

### Types:

1. Type 1 – JDBC-ODBC (deprecated)
2. Type 2 – Native API
3. Type 3 – Network Protocol
4. Type 4 – Pure Java (used today)

---

# 🔷 5. Adding Dependency (MySQL)

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.32</version>
</dependency>
```

---

# 🔷 6. Loading Driver (Old vs New)

```java
Class.forName("com.mysql.cj.jdbc.Driver");
```

✔ Not required in JDBC 4.0+

---

# 🔷 7. Creating Connection

```java
Connection con = DriverManager.getConnection(
    "jdbc:mysql://localhost:3306/myDb", "user", "pass"
);
```

### 💡 Concepts:

* Connection = session with DB
* AutoCloseable → use try-with-resources

---

# 🔷 8. Statement Types

## 1. Statement

* Simple
* Not safe (SQL Injection)

## 2. PreparedStatement

* Precompiled
* Safe
* Faster

## 3. CallableStatement

* Used for stored procedures

---

# 🔷 9. Statement Example

```java
Statement stmt = con.createStatement();
stmt.executeUpdate("INSERT INTO table VALUES(1,'John')");
```

---

# 🔷 10. PreparedStatement (Important)

```java
String sql = "INSERT INTO students(name, marks) VALUES (?, ?)";
PreparedStatement ps = con.prepareStatement(sql);

ps.setString(1, "John");
ps.setInt(2, 90);

ps.executeUpdate();
```

### 💡 Concepts:

* `?` = placeholders
* Prevents SQL Injection
* Precompiled → faster

---

# 🔷 11. Execution Methods

| Method          | Use                  |
| --------------- | -------------------- |
| executeQuery()  | SELECT               |
| executeUpdate() | INSERT/UPDATE/DELETE |
| execute()       | Unknown              |

---

# 🔷 12. ResultSet

```java
ResultSet rs = stmt.executeQuery("SELECT * FROM students");

while(rs.next()){
    System.out.println(rs.getInt("id"));
    System.out.println(rs.getString("name"));
}
```

### 💡 Concepts:

* Cursor-based
* Moves row by row

---

# 🔷 13. CRUD Operations

## INSERT

```java
INSERT INTO students VALUES(?,?,?)
```

## SELECT

```java
SELECT * FROM students
```

## UPDATE

```java
UPDATE students SET marks=? WHERE id=?
```

## DELETE

```java
DELETE FROM students WHERE id=?
```

---

# 🔷 14. Transactions

```java
con.setAutoCommit(false);

try {
    // multiple queries
    con.commit();
} catch(Exception e) {
    con.rollback();
}
```

### 💡 Concept:

* All or nothing execution

---

# 🔷 15. Batch Processing

```java
PreparedStatement ps = con.prepareStatement(sql);

for(int i=0;i<100;i++){
    ps.setInt(1,i);
    ps.addBatch();
}

ps.executeBatch();
```

### 💡 Benefit:

* Faster bulk operations

---

# 🔷 16. Handling Null Values

```java
ps.setNull(1, Types.VARCHAR);
```

---

# 🔷 17. Getting Auto Generated Keys

```java
PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
ps.executeUpdate();

ResultSet rs = ps.getGeneratedKeys();
```

---

# 🔷 18. Exception Handling

```java
try {
   // DB logic
} catch(SQLException e) {
   e.printStackTrace();
}
```

---

# 🔷 19. Best Practices

* Always use PreparedStatement
* Close resources (try-with-resources)
* Validate input
* Use transactions
* Avoid hardcoding credentials

---

# 🔷 20. Advanced Concepts

* Connection Pooling (HikariCP)
* DAO Pattern
* Logging (Log4j)
* ORM (Hibernate, JPA)

---

# 🔷 21. Sample Clean Code (Realistic)

```java
try (Connection con = dbutil.getConnection();
     PreparedStatement ps = con.prepareStatement(
         "INSERT INTO students(name, marks) VALUES (?, ?)")) {

    ps.setString(1, "John");
    ps.setInt(2, 85);

    int rows = ps.executeUpdate();
    System.out.println("Inserted: " + rows);

} catch (SQLException e) {
    System.out.println("DB Error");
}
```

---

# 🔥 Final Summary

```
Driver → enables connection
Connection → opens session
Statement → executes SQL
ResultSet → fetches data
```

---

# 🚀 Next Steps

* Build CRUD project
* Implement DAO pattern
* Learn Spring JDBC
* Move to Hibernate

---

✨ You now have a complete JDBC foundation.
