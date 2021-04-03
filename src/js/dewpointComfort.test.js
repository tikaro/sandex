import { dewpointComfort, dewpointComfortMessage } from './dewpointComfort';

describe("DewpointComfort", () => {
    test("should return 'very-dry' at 49 degrees ", () => {
      expect(dewpointComfort(49)).toEqual('very-dry');
    });

    test("should return 'comfortable' from 50 to 55 degrees ", () => {
      expect(dewpointComfort(50)).toEqual('comfortable');
      expect(dewpointComfort(52)).toEqual('comfortable');
      expect(dewpointComfort(55)).toEqual('comfortable');
    });

    test("should return 'pleasant' from 56 to 60 degrees ", () => {
      expect(dewpointComfort(56)).toEqual('pleasant');
      expect(dewpointComfort(58)).toEqual('pleasant');
      expect(dewpointComfort(60)).toEqual('pleasant');
    });

    test("should return 'slightly-humid' from 61 to 65 degrees ", () => {
      expect(dewpointComfort(61)).toEqual('slightly-humid');
      expect(dewpointComfort(63)).toEqual('slightly-humid');
      expect(dewpointComfort(65)).toEqual('slightly-humid');
    });

    test("should return 'humid' from 66 to 70 degrees ", () => {
      expect(dewpointComfort(66)).toEqual('humid');
      expect(dewpointComfort(68)).toEqual('humid');
      expect(dewpointComfort(70)).toEqual('humid');
    });

    test("should return 'very-humid' from 71 to 75 degrees ", () => {
      expect(dewpointComfort(71)).toEqual('very-humid');
      expect(dewpointComfort(73)).toEqual('very-humid');
      expect(dewpointComfort(75)).toEqual('very-humid');
    });

    test("should return 'oppressive' above 75 degrees", () => {
      expect(dewpointComfort(76)).toEqual('oppressive');
      expect(dewpointComfort(78)).toEqual('oppressive');
      expect(dewpointComfort(100)).toEqual('oppressive');
    });

    test("should handle decimals properly", () => {
      expect(dewpointComfort(75.99)).toEqual('very-humid');
      expect(dewpointComfort(76.01)).toEqual('oppressive');
    });
  });

  describe("DewpointComfortMessage", () => {
    test("should return 'Very dry' at 49 degrees ", () => {
      expect(dewpointComfortMessage(49)).toEqual('Very dry');
    });

    test("should return 'Comfortable' at 50 degrees ", () => {
      expect(dewpointComfortMessage(50)).toEqual('Comfortable');
    });

    test("should return 'Pleasant' at 56 degrees ", () => {
      expect(dewpointComfortMessage(56)).toEqual('Pleasant');
    });

    test("should return 'Slightly humid' at 61 degrees ", () => {
      expect(dewpointComfortMessage(61)).toEqual('Slightly humid');
    });

    test("should return 'Humid' at 66 degrees ", () => {
      expect(dewpointComfortMessage(66)).toEqual('Humid');
    });

    test("should return 'Very humid' at 71 degrees ", () => {
      expect(dewpointComfortMessage(71)).toEqual('Very humid');
    });

    test("should return 'Oppressive' above 75 degrees", () => {
      expect(dewpointComfortMessage(76)).toEqual('Oppressive');
    });
  });