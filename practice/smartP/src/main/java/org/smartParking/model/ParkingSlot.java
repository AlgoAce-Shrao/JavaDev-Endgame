package org.smartParking.model;

import java.time.LocalTime;
import java.util.Map;

public class ParkingSlot {

    private int slotno;
    private boolean isOccupied;
    private Car car;
    private LocalTime time;

    public ParkingSlot(){}

    public ParkingSlot(int slotno) {
        this.slotno = slotno;
        this.isOccupied=false;
    }

    public int getSlotno() {
        return slotno;
    }

    public void setSlotno(int slotno) {
        this.slotno = slotno;
    }

    public boolean isOccupied() {
        return isOccupied;
    }

    public void setOccupied(boolean occupied) {
        isOccupied = occupied;
    }

    public Car getCar() {
        return car;
    }

    public void setCar(Car car) {
        this.car = car;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }


    public void parkCar(Car car, LocalTime Entrytime){
        this.car=car;
        this.isOccupied=true;
        this.time= Entrytime;
    }

    public void removeCar(){
        this.car=null;
        this.isOccupied=false;
    }
}
