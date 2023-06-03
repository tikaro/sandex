import { dewpointComfort, dewpointComfortMessage } from './dewpointComfort.mjs';

describe("DewpointComfort", () => {
    test("should return 'very-dry' at 49 degrees ", () => {
      expect(dewpointComfort(49)).toEqual('very-dry');
    });

    test("should return 'comfortable' from 50 to 55 degrees ", () => {
      expect(dewpointComfort(50)).toEqual('dry');
      expect(dewpointComfort(52)).toEqual('dry');
      expect(dewpointComfort(55)).toEqual('dry');
    });

    test("should return 'pleasant' from 56 to 60 degrees ", () => {
      expect(dewpointComfort(56)).toEqual('comfortable');
      expect(dewpointComfort(58)).toEqual('comfortable');
      expect(dewpointComfort(60)).toEqual('comfortable');
    });

    test("should return 'slightly-humid' from 61 to 65 degrees ", () => {
      expect(dewpointComfort(61)).toEqual('humid');
      expect(dewpointComfort(63)).toEqual('humid');
      expect(dewpointComfort(65)).toEqual('humid');
    });

    test("should return 'humid' from 66 to 70 degrees ", () => {
      expect(dewpointComfort(66)).toEqual('muggy');
      expect(dewpointComfort(68)).toEqual('muggy');
      expect(dewpointComfort(70)).toEqual('muggy');
    });

    test("should return 'very-humid' from 71 to 75 degrees ", () => {
      expect(dewpointComfort(71)).toEqual('oppressive');
      expect(dewpointComfort(73)).toEqual('oppressive');
      expect(dewpointComfort(75)).toEqual('oppressive');
    });

    test("should return 'oppressive' above 75 degrees", () => {
      expect(dewpointComfort(76)).toEqual('miserable');
      expect(dewpointComfort(78)).toEqual('miserable');
      expect(dewpointComfort(100)).toEqual('miserable');
    });

    test("should handle decimals properly", () => {
      expect(dewpointComfort(75.99)).toEqual('oppressive');
      expect(dewpointComfort(76.01)).toEqual('miserable');
    });
  });

  describe("DewpointComfortMessage", () => {
    test("should return 'Very dry' at 49 degrees ", () => {
      expect(dewpointComfortMessage(49)).toEqual('Very dry');
    });

    test("should return 'Dry' at 50 degrees ", () => {
      expect(dewpointComfortMessage(50)).toEqual('Dry');
    });

    test("should return 'Comfortable' at 56 degrees ", () => {
      expect(dewpointComfortMessage(56)).toEqual('Comfortable');
    });

    test("should return 'Humid' at 61 degrees ", () => {
      expect(dewpointComfortMessage(61)).toEqual('Humid');
    });

    test("should return 'Muggy' at 66 degrees ", () => {
      expect(dewpointComfortMessage(66)).toEqual('Muggy');
    });

    test("should return 'Oppressive' at 71 degrees ", () => {
      expect(dewpointComfortMessage(71)).toEqual('Oppressive');
    });

    test("should return 'Miserable' above 75 degrees", () => {
      expect(dewpointComfortMessage(76)).toEqual('Miserable');
    });
  });