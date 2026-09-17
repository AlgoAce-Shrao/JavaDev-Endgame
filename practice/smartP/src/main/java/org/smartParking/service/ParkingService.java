package org.smartParking.service;

import org.smartParking.model.Car;
import org.smartParking.model.ParkingHistorySchema;
import org.smartParking.model.ParkingSlot;
import org.smartParking.repository.ParkingHistory;
import org.smartParking.repository.ParkingLotRepository;

import java.time.Duration;
import java.time.LocalTime;

public class ParkingService {

    private ParkingLotRepository parkingLotRepository;
    private ParkingHistory parkingHistory;

    public void setParkingLotRepository(ParkingLotRepository parkingLotRepository) {
        this.parkingLotRepository = parkingLotRepository;
    }

    public void setParkingHistory(ParkingHistory parkingHistory) {
        this.parkingHistory = parkingHistory;
    }

    private  boolean isCarAlreadyParked(int carid){
        for(ParkingSlot pksl: parkingLotRepository.getParkingSlots()){
            if(pksl.isOccupied() && pksl.getCar().getCarId()==carid){
                return true;
            }
        }
        return false;
    }


    public int  calculateParkingFee(LocalTime entryTime,LocalTime exittime){
        Duration duration= Duration.between(entryTime,exittime);
        long hours=duration.toHours();
        if(duration.toMinutes() % 60 !=0) hours++;

        int fee=(int)hours*10;


        return fee;
    }


    public ParkingSlot nearestSlotAllocation(){
        int min=Integer.MAX_VALUE;
        for(ParkingSlot pksl: parkingLotRepository.getParkingSlots()){
            if(!pksl.isOccupied()){
                return pksl;
            }
        }

        return parkingLotRepository.getslotById(min);

    }



    public synchronized void displayStatus(){

        System.out.println("Parking Lost details:: ");

        for(ParkingSlot pksl:parkingLotRepository.getParkingSlots()){
            if(!pksl.isOccupied()){
                System.out.println("Slot no : "+pksl.getSlotno()+" --> Empty");
            }else{
                System.out.println("Slot no : "+pksl.getSlotno()+" --> Car "+pksl.getCar().getCarId());
            }
        }
    }


    public synchronized void parkCar(Car car, LocalTime entryTime){


        //duplicate car prevention
        if(isCarAlreadyParked(car.getCarId())){
            System.out.println("Car already parked ");
            return;
        }

       ParkingSlot pksl=nearestSlotAllocation();

        if(pksl==null){
            System.out.println("Slots are full");
            return;
        }

        pksl.parkCar(car,entryTime);
        System.out.println("Car id : "+car.getCarId()+" parked at slot: "+pksl.getSlotno()+" at time : "+pksl.getTime());



    }


    public synchronized void removeCar(int carid,LocalTime exitTime){
        //take the carid
        //search it there
        //make the car as null
        //occupied=false
        for(ParkingSlot pksl: parkingLotRepository.getParkingSlots()){
            if(pksl.isOccupied() && pksl.getCar().getCarId()==carid){

                //calculate parking fee
                int fee=calculateParkingFee(pksl.getTime(),exitTime);

                ParkingHistorySchema phist=new ParkingHistorySchema(pksl.getSlotno(),pksl.getCar().getCarId(),pksl.getCar().getOwner(),pksl.getTime(),exitTime,fee);

                //add to parking history
                parkingHistory.addRecord(phist);

                pksl.removeCar();
                System.out.println("Car id :"+carid+" removed from slot no : "+pksl.getSlotno()+" at time : "+exitTime);
                System.out.println("Parking Fee: "+fee);
                return;
            }
        }

        System.out.println("Sorry!! Car not found");

    }


    public void findCar(int carId){
        for(ParkingSlot pksl: parkingLotRepository.getParkingSlots()){
            if(pksl.isOccupied() && pksl.getCar().getCarId()==carId){
                System.out.println("Car : "+carId+" is at slot "+pksl.getSlotno());
                return;
            }
        }
        System.out.println("Car not found");
    }

}
