package org.hiber_endgame;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class endgame_rec {
    //lets take warno, impact_warrior,weapon

    @Id
    private int warNo;
    private String impact_warrior;
    private String weapon;

    public String getWeapon() {
        return weapon;
    }

    public void setWeapon(String weapon) {
        this.weapon = weapon;
    }

    public String getImpact_warrior() {
        return impact_warrior;
    }

    public void setImpact_warrior(String impact_warrior) {
        this.impact_warrior = impact_warrior;
    }

    public int getWarNo() {
        return warNo;
    }

    public void setWarNo(int warNo) {
        this.warNo = warNo;
    }

    @Override
    public String toString() {
        return "endgame_rec{" +
                "warNo=" + warNo +
                ", impact_warrior='" + impact_warrior + '\'' +
                ", weapon='" + weapon + '\'' +
                '}';
    }
}
