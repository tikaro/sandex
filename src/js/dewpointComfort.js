export default function dewpointComfort(dewpoint) {

    if (dewpoint < 50) return "very-dry";
    if (dewpoint < 56) return "comfortable";
    if (dewpoint < 61) return "pleasant";
    if (dewpoint < 66) return "slightly-humid";
    if (dewpoint < 71) return "humid";
    if (dewpoint < 76) return "very-humid";
    if (dewpoint >= 76) return "oppressive";

}