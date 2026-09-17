package org.smartParking.model;

import java.time.LocalTime;

public class ParkingHistorySchema {

    private int slotno;
    private int carNo;
    private String ownerName;
    private LocalTime entryTime;
    private LocalTime exitTime;
    private int fee;

    public ParkingHistorySchema(int slotno, int carNo,String ownerName, LocalTime entryTime, LocalTime exitTime, int fee) {
        this.slotno = slotno;
        this.carNo=carNo;
        this.ownerName=ownerName;
        this.entryTime = entryTime;
        this.exitTime = exitTime;
        this.fee = fee;
    }

    public int getSlotno() {
        return slotno;
    }

    public void setSlotno(int slotno) {
        this.slotno = slotno;
    }



    public LocalTime getEntryTime() {
        return entryTime;
    }

    public void setEntryTime(LocalTime entryTime) {
        this.entryTime = entryTime;
    }

    public LocalTime getExitTime() {
        return exitTime;
    }

    public void setExitTime(LocalTime exitTime) {
        this.exitTime = exitTime;
    }

    public int getFee() {
        return fee;
    }

    public void setFee(int fee) {
        this.fee = fee;
    }

    @Override
    public String toString() {
        return "ParkingHistorySchema{" +
                "slotno=" + slotno +
                ", carNo=" + carNo +
                ", ownerName='" + ownerName + '\'' +
                ", entryTime=" + entryTime +
                ", exitTime=" + exitTime +
                ", fee=" + fee +
                '}';
    }
}
