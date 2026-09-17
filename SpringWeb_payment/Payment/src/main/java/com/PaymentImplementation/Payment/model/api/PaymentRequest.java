package com.PaymentImplementation.Payment.model.api;

public  record PaymentRequest(String initiatorId,String receiverId,double amount) {
}
