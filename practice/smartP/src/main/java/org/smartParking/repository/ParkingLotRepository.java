package org.smartParking.repository;

import org.smartParking.model.ParkingSlot;

import java.util.ArrayList;
import java.util.List;

public class ParkingLotRepository {

    private int initialSlots;

    //in-memory db
    private List<ParkingSlot> parkingSlots=new ArrayList<>();


    public List<ParkingSlot> getParkingSlots() {
        return parkingSlots;
    }

    public void setInitialSlots(int initialSlots) {
        this.initialSlots = initialSlots;
        initializeSlots(initialSlots);
    }


    //    public void setParkingSlots(List<ParkingSlot> parkingSlots) {
//        this.parkingSlots = parkingSlots;
//    }

    public void initializeSlots(int count){
        for(int i=0;i<count;i++){
            parkingSlots.add(new ParkingSlot(i+1));
        }
    }

    //check availability--> traverse thru the list and return the list of the slots which are unoccupied
//    public  List<Integer> checkAvailablity(){
//        List<Integer> ls=new ArrayList<>();
//        for(ParkingSlot pk:parkingSlots){
//            if(!pk.isOccupied()){
//                ls.add(pk.getSlotno());
//            }
//        }
//        return ls;
//    }


    public ParkingSlot getslotById(int slotno){
        for(ParkingSlot slt:parkingSlots){
            if(slt.getSlotno()==slotno){
                return slt;
            }
        }
        return null;
    }
}
