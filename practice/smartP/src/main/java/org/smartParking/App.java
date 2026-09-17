import org.smartParking.model.Car;
import org.smartParking.repository.ParkingHistory;
import org.smartParking.repository.ParkingLotRepository;
import org.smartParking.service.ParkingService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.context.support.GenericApplicationContextExtensionsKt;


import java.time.LocalTime;


import java.util.*;

import static java.time.format.DateTimeFormatter.ISO_LOCAL_TIME;

public class App{

    public static void main(String args[]){

        try(Scanner sc=new Scanner(System.in)){

            ApplicationContext applicationContext=new ClassPathXmlApplicationContext("applicationContext.xml");



            //💡
            ParkingLotRepository parkingLotRepository=applicationContext.getBean("parkrepo",ParkingLotRepository.class);
            parkingLotRepository.initializeSlots(5);

            //💡
            ParkingHistory parkingHistory=applicationContext.getBean("parkinghistory",ParkingHistory.class);

            //💡
            ParkingService parkingService=applicationContext.getBean("parkingService",ParkingService.class);
//            parkingService.setParkingLotRepository(parkingLotRepository);
//            parkingService.setParkingHistory(parkingHistory);


            Thread t1=new Thread(()->{

                parkingService.parkCar(new Car(101,"Shrao"), LocalTime.parse("01:45:30", ISO_LOCAL_TIME));

            });
             Thread t2=new Thread(()->{

                 parkingService.parkCar(new Car(102,"Akash"),LocalTime.parse("02:30",ISO_LOCAL_TIME));


             });
             Thread t3=new Thread(()->{
                 parkingService.parkCar(new Car(103,"mf"),LocalTime.parse("01:30",ISO_LOCAL_TIME));


             });
             Thread t4=new Thread(()->{

                 parkingService.parkCar(new Car(104,"babe"),LocalTime.parse("03:14",ISO_LOCAL_TIME));


             });
             Thread t5=new Thread(()->{

                 parkingService.parkCar(new Car(105,"ud"),LocalTime.parse("12:20",ISO_LOCAL_TIME));


             });
             Thread t6=new Thread(()->{


                 parkingService.parkCar(new Car(106,"mf2"),LocalTime.parse("03:30",ISO_LOCAL_TIME));


             });
              Thread t7=new Thread(()->{


                  parkingService.parkCar(new Car(107,"mfthebiggest"),LocalTime.parse("02:44",ISO_LOCAL_TIME));




              });
            Thread t8=new Thread(()->{


                parkingService.removeCar(102,LocalTime.parse("03:15:30",ISO_LOCAL_TIME));




              });
            Thread t9=new Thread(()->{


                parkingService.removeCar(101,LocalTime.parse("01:55:30",ISO_LOCAL_TIME));




              });
            Thread t10 =new Thread(()->{


                parkingService.removeCar(105,LocalTime.parse("02:45:30",ISO_LOCAL_TIME));




              });





              t1.start();
              t2.start();
              t3.start();
              t8.start();
              t4.start();
              t5.start();
              t6.start();
              t7.start();

              t1.join();
              t2.join();
              t3.join();
              t8.join();
              t4.join();
              t5.join();
              t6.join();
              t7.join();

            parkingService.displayStatus();
            System.out.println();

            parkingService.calculateParkingFee(LocalTime.parse("01:45:30",ISO_LOCAL_TIME),LocalTime.parse("07:45:30",ISO_LOCAL_TIME));


            t9.start();
            t10.start();

            t9.join();
            t10.join();

            parkingService.displayStatus();
            parkingService.parkCar(new Car(108,"mf3"),LocalTime.parse("02:30",ISO_LOCAL_TIME));
            parkingService.parkCar(new Car(109,"mf4"),LocalTime.parse("01:30",ISO_LOCAL_TIME));


            System.out.println();
            System.out.println("The parking history: ");
            parkingHistory.printHistory();
//            System.out.println(parkingHistory.getParkingHistory());






        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}