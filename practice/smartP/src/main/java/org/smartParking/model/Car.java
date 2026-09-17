package org.smartParking.model;

public class Car {

    private int carId;
    private String owner;

    public Car(int carId, String owner) {
        this.carId = carId;
        this.owner = owner;
    }

    public int getCarId() {
        return carId;
    }

    public void setCarId(int carId) {
        this.carId = carId;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }


    @Override
    public String toString() {
        return "Car{" +
                "carId=" + carId +
                ", owner='" + owner + '\'' +
                '}';
    }
}
