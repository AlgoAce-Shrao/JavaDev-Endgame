package com.PaymentImplementation.Payment.model.api;

import com.PaymentImplementation.Payment.model.Status;

public record PaymentInitiatorResponse(String paymentId, Status Status) {}
