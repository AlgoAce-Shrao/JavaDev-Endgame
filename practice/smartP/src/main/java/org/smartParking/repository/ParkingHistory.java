package org.smartParking.repository;

import org.smartParking.model.ParkingHistorySchema;
import org.smartParking.model.ParkingSlot;

import java.util.ArrayList;
import java.util.List;

public class ParkingHistory {

    //in-memory db
    private List<ParkingHistorySchema> parkingHistory=new ArrayList<>();

    public void setParkingHistory(List<ParkingHistorySchema> parkingHistory) {
        this.parkingHistory = parkingHistory;
    }

    public List<ParkingHistorySchema> getParkingHistory() {
        return parkingHistory;
    }

//    public void printHistory(){
//        for(ParkingSlot slot:parkingHistory){
//            System.out.println(slot);
//        }
//    }

    public void addRecord(ParkingHistorySchema parkingHistorySchema){
        parkingHistory.add(parkingHistorySchema);
    }

    public void printHistory(){
        for(ParkingHistorySchema pst:parkingHistory){
            System.out.println(pst.toString());
        }
    }




}
