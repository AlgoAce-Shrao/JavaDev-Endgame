# 📦 Maven Repository

## 🔹 Introduction

**Maven** is a powerful **build automation and project management tool** used primarily for Java development. It simplifies the process of building, testing, and deploying applications by following standardized conventions.

It helps developers:
- Build and compile code
- Manage dependencies automatically
- Run tests
- Package applications (JAR/WAR)
- Deploy applications

---

## 🔹 What is Maven?

Maven is an **open-source build tool** that manages the **entire lifecycle of a Java project**.

### ✔️ Core functionalities:
1. Compile and package source code
2. Manage dependencies and their versions
3. Run tests and generate reports
4. Deploy applications

👉 Maven uses an XML file called **POM (Project Object Model)** to define everything about the project.

---

## 🔹 Key Concept: Convention over Configuration

Maven follows a standard directory structure, so you don’t need to configure everything manually.

### 📁 Standard Structure:
```
src/main/java       → Application source code  
src/test/java       → Test code  
target/             → Compiled output  
```

👉 This reduces setup time and improves consistency.

---

## 🔹 Important Points to Remember

1. Maven is part of **Apache Maven** and acts as a **build + dependency management tool**.
2. External libraries used in Java are packaged as **JAR (Java Archive) files**.
3. Instead of manually downloading JARs, Maven **automatically downloads them** using dependencies defined in `pom.xml`.

---

## 🔹 POM.xml (Project Object Model)

The **heart of Maven**.

👉 It tells Maven:
- Which dependencies to download
- How to build the project
- Which plugins to use

### 🔸 Dependencies Section:
Dependencies are written inside:
```xml
<dependencies>
    <!-- dependencies go here -->
</dependencies>
```

---

## 🔹 GAV (Very Important Concept)

Each dependency is identified using:

- **groupId** → Organization/domain (reverse domain name)
- **artifactId** → Library/module name
- **version** → Version of the library

### Example:
```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-core</artifactId>
    <version>5.3.30</version>
</dependency>
```

---

## 🔹 Effective POM

- Whatever you write in `pom.xml` is **not the final version Maven uses**.
- Maven combines:
    - Your POM
    - Parent POM
    - Default configurations

👉 Final merged version = **Effective POM**

### 💡 Analogy:
- `pom.xml` → Your code
- Effective POM → Fully expanded version Maven actually executes

---

## 🔹 How Maven Works Internally

1. Maven checks the **Local Repository** (`.m2` folder)
2. If dependency is not found → it searches **Maven Central Repository**
3. Downloads dependency and stores it locally

👉 Next time → no download needed (faster builds)

---

## 🔹 Maven Repositories

There are **3 types of repositories**:

### 1. Local Repository
- Stored in your system (`~/.m2/repository`)

### 2. Central Repository
- Default online repository provided by Maven

### 3. Remote Repository
- Private/company repositories

---

## 🔹 Build Lifecycle (Very Important)

Maven executes tasks in **phases**:

```
validate → compile → test → package → install → deploy
```

### Example:
```bash
mvn install
```

👉 Executes all phases up to `install`

---

## 🔹 Plugins

Maven works using **plugins** (they do the actual work).

### Examples:
- Compiler Plugin → compiles code
- Surefire Plugin → runs tests
- Jar Plugin → creates JAR files

👉 Without plugins, Maven cannot perform tasks.

---

## 🔹 Dependency Scope

Defines where a dependency is used:

| Scope     | Usage |
|----------|------|
| compile  | Available everywhere |
| test     | Only during testing |
| provided | Provided by server (not packaged) |
| runtime  | Needed only at runtime |

---

## 🔹 Archetype

An **Archetype** is a **project template generator**.

👉 It helps you quickly create a project with:
- Predefined folder structure
- Sample code
- Basic `pom.xml`

### Example:
```bash
mvn archetype:generate
```

---

## 🔹 Final Summary

👉 Maven =  
**Build Tool + Dependency Manager + Lifecycle Manager**

---

## 🔥 Next Level Concepts (Recommended)

- Multi-module Maven projects
- Dependency conflict resolution
- Maven vs Gradle
- Creating custom plugins  