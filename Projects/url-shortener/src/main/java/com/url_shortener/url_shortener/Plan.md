## URL-shortener Architecture plan

hi...today I am going to make this project by maintaining proper architecture , and proper planning 
I am going to be the best coder Kalinga Institute has ever seen

Alright!! Let's rock and roll.!!! Let's show them who is the boss/...


### Workflow of the Project

- Client enters link --> controller accepts it-->makes its dto--> redirects to service(business logic i.e. shortenes the link) --> makes it into proper object(id,shorturl, longurl) --> saves in db and returns short url 

- for this project :
    - the client on first visit..will get the shorturl along with the id at which the url is saved 
    - The client on visiting /searching for the same link again...we will find the

### URL shortening algorithm:

1. URL Encoding
    - URL Encoding by base62 --> ✅ will follow this one 
    - URL Encoding though MD5
2. Key generation Service(KGS)


### Folder Struture
com.url_shortener.url_shortener
   - controller
     - urlController-->{createShortURL,getAllShortURLs,getShortURLbyLong}
   - model
     - entity
       - urlmapping
     - dto
       - urlmappingdto
   - repository
     - urlrepository
   - service
     - urlservice interface
     - urlserviceimplementation