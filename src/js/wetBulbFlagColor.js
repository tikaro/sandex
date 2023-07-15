// Source of the flag color: 
// https://jacksonville.tricare.mil/Portals/125/PreventingHeatRelatedInjuries.jpg

export function wetBulbFlagColor(wetBulbTemp) {

    if (wetBulbTemp < 80) return "white-flag";
    if (wetBulbTemp < 85) return "green-flag";
    if (wetBulbTemp < 88) return "yellow-flag";
    if (wetBulbTemp < 90) return "red-flag";
    if (wetBulbTemp >= 90) return "black-flag";

}