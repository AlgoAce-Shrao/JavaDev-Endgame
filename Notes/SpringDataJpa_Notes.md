## Spring Data Jpa [In-Depth understanding]

💡Spring Data Jpa is an abstraction layer on top of JPA to reduce boiler plate code required to create a Data Access Object


### What is JPA? 

- Jakarta Persistence API[JPA] is used for object relationship mapping 
- Hibernate lies between JPA and JDBC and acts as an implementation of JPA, it generates sql queries which are then executed by JDBC

### Basic Guidelines for setting up application properties :


- spring.datasource.url=jdbc:postgresql://localhost:5432/HospitalManagementSystem
- spring.datasource.username=postgres
- spring.datasource.password=Udi<3#Shrao
- spring.jpa.hibernate.ddl-auto= create-drop | create |update |validate | none
- spring.jpa.show-sql=true  --> show the sql in the console  
- spring.jpa.properties.hibernate.format_sql=true

* 💡💡spring.jpa.hibernate.ddl-auto=
    - --------------**-------------------> we do these in testing environment or in local environment
1. create-drop  (means everytime the application starts it drops hte existing table and then creates a new one..)
2. create (means it will not delete the db once the application shuts down...but everytime we do some changes or create something it drops the db and then re creates one)
3. update (it will keep on updating the database and won't drop/tamper the db when the application shuts down)
    - --------------**-------------------> we do the below in production environment

4. validate  (It will validate whether the production relatinships and the  objects  received through code refere to the same ddl or not...If we make a small change in the column then it will throw error and crash instead of polluting the db)
5. none  (make any changes to the code ..but it will not show any changes in the db.)


### EntityManager

💡Before learning about EntityManager we need to learn about Hibernate Life Cycle...

![Hibernate_LifeCycle.png](img_3.png)

### Read this one for more information: https://medium.com/@myggona/spring-boot-persistence-context-b112bc7382df

### Hibernate Life Cycle:

#### 🚀 The Persistence Context:. It’s All About Persistence Context

Before getting into the topic of entity lifecycle, first, we need to understand the persistence context.

Simply put, the persistence context sits between client code and data store. It’s a staging area where persistent data is converted to entities, ready to be read and altered by client code.

Theoretically speaking, the persistence context is an implementation of the Unit of Work pattern. It keeps track of all loaded data, tracks changes of that data, and is responsible to eventually synchronize any changes back to the database at the end of the business transaction.

JPA EntityManager and Hibernate’s Session are an implementation of the persistence context concept. Throughout this article, we’ll use Hibernate Session to represent persistence context.


- The Hibernate life cycle consists of four main states: Transient, Persistent, Detached, and Removed. Each of these states represents a specific state of an object in the Hibernate framework.

- *Transient Stage:*
  -     When an object is created using the “new” keyword, it is in the transient state. The object is not associated with any Hibernate session, and no database operations are performed on it. The object is simply a plain Java object (POJO) that is not yet persisted in the database.
  
```java
// Creating a new object in the transient state
Employee employee = new Employee();
employee.setName("John");
employee.setAge(30);
```

- *Persistent Stage:*
  -      When an object is associated with a Hibernate session, it enters the persistent state. In this state, the object is associated with a specific Hibernate session and is actively managed by Hibernate. Any changes made to the object will be tracked by Hibernate and will be persisted to the database when the session is flushed/saved/commited to the db.
  -     Transient-Persistent State
        When an object is first associated with a Hibernate session, it is in the Transient-Persistent state. This means that the object is newly created, and its state is not yet synchronized with the database. Any changes made to the object in this state will be persisted to the database when the session is flushed.

```java
// Creating a new object in the Transient-Persistent state
Employee employee = new Employee();
employee.setName("John");
employee.setAge(30);

// Associating the object with a Hibernate session
Session session = HibernateUtil.getSessionFactory().openSession();
session.beginTransaction();
session.save(employee);
```

- *Persistent-Detached State*
        On the other hand, when an object is already in the database and is loaded into a Hibernate session, it is in the Persistent-Detached state. Any changes made to the object in this state will also be tracked by Hibernate and will be persisted to the database when the session is flushed.
```java
// Loading an existing object into a Hibernate session
Session session = HibernateUtil.getSessionFactory().openSession();
Employee employee = session.get(Employee.class, 1L); 

// Modifying the object in the Persistent-Detached state
employee.setName("Alice"); 

// Persisting the changes to the database
session.beginTransaction();
session.update(employee);
```

- *Detached State*
        When a persistent object is no longer associated with a Hibernate session, it enters the detached state. This means that the object is no longer actively managed by Hibernate, and any changes made to it will not be persisted to the database. However, the object is still a valid Java object and can be re-associated with a Hibernate session in the future.

```java
// Loading an existing object into a Hibernate session
Session session = HibernateUtil.getSessionFactory().openSession();
Employee employee = session.get(Employee.class, 1L); 

// Detaching the object from the Hibernate session
session.evict(employee); 

// Modifying the object in the Detached state
employee.setAge(35); 

// Re-associating the object with a Hibernate session
session.beginTransaction();
session.update(employee);
```

- *Removed State*
When an object is deleted from the database, it enters the removed state. This means that the object is no longer associated with the database, and any attempts to modify it or re-associate it with a Hibernate session will result in an exception.

![EntityManager_and_PersistenceContext.png](img_1.png)
The above picture is pretty self explanatory--> for more refer to  this one again: https://medium.com/@myggona/spring-boot-persistence-context-b112bc7382df


## JPA Query Methods:

Read this for reference: https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html

**Suppose we have the entity Patient**

```java

public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable=false,length=40)
    private String name;


    private String gender;

    private LocalDateTime birthDate;

    @Column(unique = true,nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    private BloodGroupType bloodGroup;

    @CreationTimestamp
    private LocalDateTime createdAt;

}


```

**Whenever we need to query about some fields..it can simpley be done by findBy__**
For example:

```java

import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Patient findByName(String name);

    Patient findByBirthDate(LocalDateTime birthDate);

    List<Patient> findByNameOrBirthDate(String name, LocalDateTime birthDate);

}


```

* Spring is that much intelligent that it interprets we need patient on the basis of name or birthdate
* This works on a complex logic : however on the superficial way:
  * JPA Query methods work like they concatenate the field name with the process/instruction name and generate the resp. query which is accurate
  * Behind the scene, it generate the query :for findByName
  * ```sql
    SELECT * from patient where patient.name=__ (entered name)
  * ```

* Now see the 3rd query:
  * It will find u patients on the basis of both::Since there is an OR b/w them...so it will find by name , or by birthdate..
  * If it gets different patients one by name and the other by bd...then it will display both..
  * Since it fires the query:
  * ```sql
    select p1_0.id,p1_0.birth_date,p1_0.blood_group,p1_0.created_at,p1_0.email,p1_0.gender,p1_0.name from patient_tbl p1_0 where p1_0.name=? or p1_0.birth_date=?
  * ```
    

* Had there been And b/w them..then both the name and hte db should have refered to the same patient...else it would return a null
  * Which means both should agree with the patient details..else one mismatches..then everything fails

### Projection:

      "Selecting only the data you need from a larger object." 


- Projection is the process of retrieving/extracting only the specific fields or calculated values you need from an entity, instead of loading the entire entity object.

```java

  @Query("SELECT new com.SpringDataJPADemo.HospitalManagementSystem.dto.BloodGroupCountResponseDTO( p.bloodGroup,count(*)) FROM Patient p group by p.bloodGroup")
    List<BloodGroupCountResponseDTO> countEachBloodGroupType();

```




** What we have done here is called DTO-Projection .More specifically constructor based Projection because Hibernate calls new BloodGroupCountResponseDTO(...) **


### Mapping Associations in JPA

* There are different types of entity relationship management
* However more importantly, we need to learn about Owning side and the inverse side

- We knoe 2 entities are associated by some sort of relation...among which one is fully dependant on the other while the other is partially dependent
- The fully dependant one is under total participation
- the partially dependent one is under partial participation

- So the owning side is the one who owns the foreign key of the other table related
    - JoinColumn is written on the owning side else how will the foreign key be kept there
    - Its the one which is fully dependent on the other...It cannot exist without the other..hence the foreign key is present in this table..
    - Owns the relationship
    - Single source of truth is maintained..
    - and hibernates doesn't get confused
    - so we use mappedby on the inverse side to let hibernate know that the relation is maintained by the owning side

- In appointment-patient relationship,
  - Appointment is the owning  side--> i.e. it contains the foreign key of the patient
  - So any changes if ever to me made, or to create a new appointment we cannot do it from the patient side...
  - We need to do it from the appointment side only...

# 💡💡💡Very important:
# @Transactional only manages the persistence context. Hibernate performs dirty checking only on **_managed entities._** Newly created entities remain **transient until they are persisted via persist(), save(),** or a cascade operation that makes them managed.



![orphanRemoval.png](img_4.png)


# N+1 Query Optimization

```java
 @Test
    public void testPatientRepository(){
        List<Patient> patientList=patientRepository.findAll();

        for(Patient p:patientList){
            System.out.println(p);
        }
    }

```

- So, here in db I have 5 patients...But check the queries

```terminaloutput

Hibernate: select p1_0.id,p1_0.birth_date,p1_0.blood_group,p1_0.created_at,p1_0.email,p1_0.gender,p1_0.patient_insurance_id,p1_0.name from patient_tbl p1_0
Hibernate: select a1_0.patient_id,a1_0.id,a1_0.appointment_time,a1_0.doctor_id,d1_0.id,d1_0.email,d1_0.name,d1_0.specialization,a1_0.reason from appointment a1_0 left join doctor d1_0 on d1_0.id=a1_0.doctor_id where a1_0.patient_id=?
Hibernate: select a1_0.patient_id,a1_0.id,a1_0.appointment_time,a1_0.doctor_id,d1_0.id,d1_0.email,d1_0.name,d1_0.specialization,a1_0.reason from appointment a1_0 left join doctor d1_0 on d1_0.id=a1_0.doctor_id where a1_0.patient_id=?
Hibernate: select a1_0.patient_id,a1_0.id,a1_0.appointment_time,a1_0.doctor_id,d1_0.id,d1_0.email,d1_0.name,d1_0.specialization,a1_0.reason from appointment a1_0 left join doctor d1_0 on d1_0.id=a1_0.doctor_id where a1_0.patient_id=?
Hibernate: select a1_0.patient_id,a1_0.id,a1_0.appointment_time,a1_0.doctor_id,d1_0.id,d1_0.email,d1_0.name,d1_0.specialization,a1_0.reason from appointment a1_0 left join doctor d1_0 on d1_0.id=a1_0.doctor_id where a1_0.patient_id=?
Hibernate: select a1_0.patient_id,a1_0.id,a1_0.appointment_time,a1_0.doctor_id,d1_0.id,d1_0.email,d1_0.name,d1_0.specialization,a1_0.reason from appointment a1_0 left join doctor d1_0 on d1_0.id=a1_0.doctor_id where a1_0.patient_id=?
Patient(id=1, name=Aarav Sharma, gender=MALE, birthDate=1990-05-10T00:00, email=aarav.sharma@example.com, bloodGroup=O_POSITIVE, createdAt=null, insurance=null, appointments=[Appointment(id=4, appointmentTime=2025-07-04T14:00, reason=Follow-up Visit, doctor=Doctor(id=1, name=Dr. Rakesh Mehta, specialization=Cardiology, email=rakesh.mehta@example.com))])
Patient(id=2, name=Diya Patel, gender=FEMALE, birthDate=1995-08-20T00:00, email=diya.patel@example.com, bloodGroup=A_POSITIVE, createdAt=null, insurance=null, appointments=[Appointment(id=1, appointmentTime=2025-07-01T10:30, reason=General Checkup, doctor=Doctor(id=1, name=Dr. Rakesh Mehta, specialization=Cardiology, email=rakesh.mehta@example.com)), Appointment(id=2, appointmentTime=2025-07-02T11:00, reason=Skin Rash, doctor=Doctor(id=2, name=Dr. Sneha Kapoor, specialization=Dermatology, email=sneha.kapoor@example.com))])
Patient(id=3, name=Dishant Verma, gender=MALE, birthDate=1988-03-15T00:00, email=dishant.verma@example.com, bloodGroup=A_POSITIVE, createdAt=null, insurance=null, appointments=[Appointment(id=3, appointmentTime=2025-07-03T09:45, reason=Knee Pain, doctor=Doctor(id=3, name=Dr. Arjun Nair, specialization=Orthopedics, email=arjun.nair@example.com))])
Patient(id=4, name=Neha Iyer, gender=FEMALE, birthDate=1992-12-01T00:00, email=neha.iyer@example.com, bloodGroup=AB_POSITIVE, createdAt=null, insurance=null, appointments=[Appointment(id=5, appointmentTime=2025-07-05T16:15, reason=Consultation, doctor=Doctor(id=1, name=Dr. Rakesh Mehta, specialization=Cardiology, email=rakesh.mehta@example.com))])
Patient(id=5, name=Kabir Singh, gender=MALE, birthDate=1993-07-11T00:00, email=kabir.singh@example.com, bloodGroup=O_POSITIVE, createdAt=null, insurance=null, appointments=[Appointment(id=6, appointmentTime=2025-07-06T08:30, reason=Allergy Treatment, doctor=Doctor(id=2, name=Dr. Sneha Kapoor, specialization=Dermatology, email=sneha.kapoor@example.com))])



```

- In order to get 5 patients , in total 6 queries are being fired...
  - One query for fetching the entire patient list
  - and the rest 5 queries for fetching from the appointments table which is eager fetched ..
  
** This is the typical N+1 query problem..and we need to optimize this **

### Solutions:
1. Just do ToString.Exclude on the entity associated with it
2. Make a custom query-->by merging entities --> using join

```java

@Query("SELECT p from Patient p LEFT JOIN FETCH p.appointments a LEFT JOIN FETCH a.doctor")
    List<Patient> findAllPatientWithappointment();

```


```java

@Test
    public void testPatientRepository(){
        List<Patient> patientList=patientRepository.findAllPatientWithappointment();

        for(Patient p:patientList){
            System.out.println(p);
        }
    }

```
**Now check the output: only one query fired..that's the N+1 Query optimization**

```terminaloutput

Hibernate: select p1_0.id,a1_0.patient_id,a1_0.id,a1_0.appointment_time,a1_0.doctor_id,d1_0.id,d1_0.email,d1_0.name,d1_0.specialization,a1_0.reason,p1_0.birth_date,p1_0.blood_group,p1_0.created_at,p1_0.email,p1_0.gender,p1_0.patient_insurance_id,p1_0.name from patient_tbl p1_0 left join appointment a1_0 on p1_0.id=a1_0.patient_id left join doctor d1_0 on d1_0.id=a1_0.doctor_id
Patient(id=2, name=Diya Patel, gender=FEMALE, birthDate=1995-08-20T00:00, email=diya.patel@example.com, bloodGroup=A_POSITIVE, createdAt=null, insurance=null, appointments=[Appointment(id=1, appointmentTime=2025-07-01T10:30, reason=General Checkup, doctor=Doctor(id=1, name=Dr. Rakesh Mehta, specialization=Cardiology, email=rakesh.mehta@example.com)), Appointment(id=2, appointmentTime=2025-07-02T11:00, reason=Skin Rash, doctor=Doctor(id=2, name=Dr. Sneha Kapoor, specialization=Dermatology, email=sneha.kapoor@example.com))])
Patient(id=3, name=Dishant Verma, gender=MALE, birthDate=1988-03-15T00:00, email=dishant.verma@example.com, bloodGroup=A_POSITIVE, createdAt=null, insurance=null, appointments=[Appointment(id=3, appointmentTime=2025-07-03T09:45, reason=Knee Pain, doctor=Doctor(id=3, name=Dr. Arjun Nair, specialization=Orthopedics, email=arjun.nair@example.com))])
Patient(id=1, name=Aarav Sharma, gender=MALE, birthDate=1990-05-10T00:00, email=aarav.sharma@example.com, bloodGroup=O_POSITIVE, createdAt=null, insurance=null, appointments=[Appointment(id=4, appointmentTime=2025-07-04T14:00, reason=Follow-up Visit, doctor=Doctor(id=1, name=Dr. Rakesh Mehta, specialization=Cardiology, email=rakesh.mehta@example.com))])
Patient(id=4, name=Neha Iyer, gender=FEMALE, birthDate=1992-12-01T00:00, email=neha.iyer@example.com, bloodGroup=AB_POSITIVE, createdAt=null, insurance=null, appointments=[Appointment(id=5, appointmentTime=2025-07-05T16:15, reason=Consultation, doctor=Doctor(id=1, name=Dr. Rakesh Mehta, specialization=Cardiology, email=rakesh.mehta@example.com))])
Patient(id=5, name=Kabir Singh, gender=MALE, birthDate=1993-07-11T00:00, email=kabir.singh@example.com, bloodGroup=O_POSITIVE, createdAt=null, insurance=null, appointments=[Appointment(id=6, appointmentTime=2025-07-06T08:30, reason=Allergy Treatment, doctor=Doctor(id=2, name=Dr. Sneha Kapoor, specialization=Dermatology, email=sneha.kapoor@example.com))])


```