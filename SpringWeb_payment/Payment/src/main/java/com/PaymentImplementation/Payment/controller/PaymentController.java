package com.PaymentImplementation.Payment.controller;

import com.PaymentImplementation.Payment.model.Payment;
import com.PaymentImplementation.Payment.model.api.PaymentInitiatorResponse;
import com.PaymentImplementation.Payment.model.api.PaymentRequest;
import com.PaymentImplementation.Payment.service.PaymentManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    //getAllPayments,getPaymentById,payUser

    @Autowired
    private PaymentManagerService paymentManagerService;

    public PaymentManagerService getPaymentManagerService() {
        return paymentManagerService;
    }

    public void setPaymentManagerService(PaymentManagerService paymentManagerService) {
        this.paymentManagerService = paymentManagerService;
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("")
    public List<Payment> getAllPayments(){
        return paymentManagerService.getAllPayments();
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/{id}")
    public Payment getPaymentById(@PathVariable String id){
        return paymentManagerService.getPaymentById(id);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("")
    public PaymentInitiatorResponse payUser(@RequestBody PaymentRequest paymentRequest){

        Payment payment=Payment.create(paymentRequest.initiatorId(),paymentRequest.receiverId(),paymentRequest.amount());
        paymentManagerService.initiatePayment(payment);
        return new PaymentInitiatorResponse(payment.getPaymentId(),payment.getStatus());
    }
}
