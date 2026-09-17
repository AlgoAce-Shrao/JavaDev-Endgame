## Exploring Spring Boot Web by implementing a dummy payment service


##### Payment system:
💡Payment attributes
- paymentId
- initiatorId
- receiverId
- amount
- initiatedTime
- status--> enum-->{Pending,processing,success ,failed}

##### Flow:
- Client -> controller{getAllPayments,getPaymentById,payUser}-->redirect to Service(main logic for all the methods)-->

#### Folder st:-
com.PaymentImplementation.Payment
 - PaymentApplication--> main method
 - controller
   - PaymentController
 - model
   - api
     - paymentInitiatorResponse
     - PaymentRequest
   - payment model
   - status model(enum)
 - service
   - PaymentManagerService