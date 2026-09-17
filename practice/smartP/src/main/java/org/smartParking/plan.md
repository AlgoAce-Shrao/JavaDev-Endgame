## Implementation plan

LEVEL 1: Smart Parking Lot System (Core Logic)
🎬 Real-world Scenario

You’re building the backend logic for a small parking lot.

Limited parking slots
Cars come → park
Cars leave → slot becomes free
System tracks everything
🎯 Your Goal

Implement:

parkCar(car)
removeCar(carNumber)


Solution::
park car(car)::-
Car comes:-
    - checks if slots available
    - assign slots
    - mark them as occupied


#### Entities:
1. Car()--int carid, String owner
2. ParkingSlot()-int slotno,isOccupied,Car ref

in-memory db--> list of parkingSLots

Folders:
model
    -Car
    -ParkingSlot
repository
    -ParkinglotRepository
        --> initialize 5 slots each numbered
        --> store them in the list
service
    -ParkingService


### Level 2:
* Add priority to the slot allocation
* Nearest slot to be allocated first


Brute force approach:
Traverse thru the list and find the unoccupied seats and find the one with the smallest slot number

- take the minimum as integer.max value
- traverse thru , check if isOccupied() is false -->if slotno is minimum --> pskl.parkCar()



### Level 3

Real-world upgrade

Your parking system now:

Tracks entry time
Calculates parking charges
Maintains parking history

👉 This is no longer just “store objects”
👉 Now you’re managing state over time

🎯 Your Goal

Enhance system with:

✅ 1. Track Entry Time
    - ParkingSlot--> entity-->entrytime
✅ 2. Calculate Parking Fee on Exit
    - take the exit time(java.time)--> see docs
    - rate :rupees 10 per hour(60 mins)--> round of
✅ 3. Maintain Parking History
    - new class-->ParkingHistory list add while exit>--> everytime exit--> add details to the parking history
✅ 4. Show Total Revenue

##### Implementation:
