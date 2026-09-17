# Spring Security

#### The main concept of Spring security lies in the Security Filter chain...Refer to the handbook for clarity

* By default , SecurityFilterChain makes all the routes protected/authenticated whenever spring security dependency is added

- We can configure the behaviour of the security filter chain by our code..-> check WebSecurityConfig file 

- we can define multiple roles in applcation.properties..
  - by writing spring.security.user.roles=[]  An array of roles life DOCTOR,ADMIN etc.
  - or create own in memory detailed manager







## JWT->JSON Web Token

![jwt.png](img_5.png)

![client-server-req.png](img_6.png)

![workflow.png](img_7.png)


![jwt-login-workflow.png](img_8.png)