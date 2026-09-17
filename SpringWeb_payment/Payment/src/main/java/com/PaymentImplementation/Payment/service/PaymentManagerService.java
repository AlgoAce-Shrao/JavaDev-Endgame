package com.PaymentImplementation.Payment.service;

import com.PaymentImplementation.Payment.model.Payment;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class PaymentManagerService {

    //in-memory db as of now
    private final Map<String,Payment> db=new HashMap<>();


    public void initiatePayment(Payment payment){
        db.put(payment.getPaymentId(),payment);
    }

    public List<Payment> getAllPayments(){
        return new ArrayList<>(db.values());


    }

    public Payment getPaymentById(String paymentId){
        return db.get(paymentId);
    }



}
