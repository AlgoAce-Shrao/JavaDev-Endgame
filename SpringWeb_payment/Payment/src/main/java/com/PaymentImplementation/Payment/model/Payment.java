package com.PaymentImplementation.Payment.model;

import org.w3c.dom.css.Counter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicLong;

public class Payment {

    private String paymentId,initiatorId,receiverId;
    private double amount;
    private LocalDateTime initiatedTime;
    private Status status;

    public Payment(String paymentId, String initiatorId, String receiverId, double amount, LocalDateTime initiatedTime,Status status) {
        this.paymentId = paymentId;
        this.initiatorId = initiatorId;
        this.receiverId = receiverId;
        this.amount = amount;
        this.initiatedTime = initiatedTime;
        this.status=status;
    }

    private   static final AtomicLong COUNTER=new AtomicLong(1L);


    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getInitiatorId() {
        return initiatorId;
    }

    public void setInitiatorId(String initiatorId) {
        this.initiatorId = initiatorId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public LocalDateTime getInitiatedTime() {
        return initiatedTime;
    }

    public void setInitiatedTime(LocalDateTime initiatedTime) {
        this.initiatedTime = initiatedTime;
    }

    @Override
    public String toString() {
        return "Payment{" +
                "paymentId='" + paymentId + '\'' +
                ", initiatorId='" + initiatorId + '\'' +
                ", receiverId='" + receiverId + '\'' +
                ", amount=" + amount +
                ", initiatedTime=" + initiatedTime +
                '}';
    }

    public static Payment create(String initiatorId,String receiverId,Double amount){

        LocalDateTime now=LocalDateTime.now();
        String paymentId=generatePaymentId(now,initiatorId);
        return new Payment(paymentId,initiatorId,receiverId,amount,now,Status.PENDING);

    }

    private static String generatePaymentId(LocalDateTime now, String initiatorId) {
        String formattedDate=now.format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
        long counter=COUNTER.getAndIncrement();
        return String.format("PAY-%s-%s-%05d",formattedDate,initiatorId.toUpperCase(),counter);
    }


}
