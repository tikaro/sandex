import { dewpointComfort, dewpointComfortMessage, dewpointColor, DEWPOINT_COLORS, DEWPOINT_CHART_PIECES } from './dewpointComfort.js';

describe("DewpointComfort", () => {
    it("should return 'very-dry' at 49 degrees ", () => {
      expect(dewpointComfort(49)).toEqual('very-dry');
    });

    it("should return 'comfortable' from 50 to 55 degrees ", () => {
      expect(dewpointComfort(50)).toEqual('dry');
      expect(dewpointComfort(52)).toEqual('dry');
      expect(dewpointComfort(55)).toEqual('dry');
    });

    it("should return 'pleasant' from 56 to 60 degrees ", () => {
      expect(dewpointComfort(56)).toEqual('comfortable');
      expect(dewpointComfort(58)).toEqual('comfortable');
      expect(dewpointComfort(60)).toEqual('comfortable');
    });

    it("should return 'slightly-humid' from 61 to 65 degrees ", () => {
      expect(dewpointComfort(61)).toEqual('humid');
      expect(dewpointComfort(63)).toEqual('humid');
      expect(dewpointComfort(65)).toEqual('humid');
    });

    it("should return 'humid' from 66 to 70 degrees ", () => {
      expect(dewpointComfort(66)).toEqual('muggy');
      expect(dewpointComfort(68)).toEqual('muggy');
      expect(dewpointComfort(70)).toEqual('muggy');
    });

    it("should return 'very-humid' from 71 to 75 degrees ", () => {
      expect(dewpointComfort(71)).toEqual('oppressive');
      expect(dewpointComfort(73)).toEqual('oppressive');
      expect(dewpointComfort(75)).toEqual('oppressive');
    });

    it("should return 'oppressive' above 75 degrees", () => {
      expect(dewpointComfort(76)).toEqual('miserable');
      expect(dewpointComfort(78)).toEqual('miserable');
      expect(dewpointComfort(100)).toEqual('miserable');
    });

    it("should handle decimals properly", () => {
      expect(dewpointComfort(75.99)).toEqual('oppressive');
      expect(dewpointComfort(76.01)).toEqual('miserable');
    });
  });

  describe("DewpointComfortMessage", () => {
    it("should return 'Very dry' at 49 degrees ", () => {
      expect(dewpointComfortMessage(49)).toEqual('Very dry');
    });

    it("should return 'Dry' at 50 degrees ", () => {
      expect(dewpointComfortMessage(50)).toEqual('Dry');
    });

    it("should return 'Comfortable' at 56 degrees ", () => {
      expect(dewpointComfortMessage(56)).toEqual('Comfortable');
    });

    it("should return 'Humid' at 61 degrees ", () => {
      expect(dewpointComfortMessage(61)).toEqual('Humid');
    });

    it("should return 'Muggy' at 66 degrees ", () => {
      expect(dewpointComfortMessage(66)).toEqual('Muggy');
    });

    it("should return 'Oppressive' at 71 degrees ", () => {
      expect(dewpointComfortMessage(71)).toEqual('Oppressive');
    });

    it("should return 'Miserable' above 75 degrees", () => {
      expect(dewpointComfortMessage(76)).toEqual('Miserable');
    });
  });

describe("DEWPOINT_COLORS", () => {
  it("has an entry for every comfort level", () => {
    const levels = ["very-dry", "dry", "comfortable", "humid", "muggy", "oppressive", "miserable"];
    levels.forEach(level => {
      expect(DEWPOINT_COLORS[level]).toBeDefined();
    });
  });
});

describe("dewpointColor", () => {
  it("returns the correct color at each comfort boundary", () => {
    expect(dewpointColor(49)).toBe(DEWPOINT_COLORS["very-dry"]);
    expect(dewpointColor(50)).toBe(DEWPOINT_COLORS["dry"]);
    expect(dewpointColor(56)).toBe(DEWPOINT_COLORS["comfortable"]);
    expect(dewpointColor(61)).toBe(DEWPOINT_COLORS["humid"]);
    expect(dewpointColor(66)).toBe(DEWPOINT_COLORS["muggy"]);
    expect(dewpointColor(71)).toBe(DEWPOINT_COLORS["oppressive"]);
    expect(dewpointColor(76)).toBe(DEWPOINT_COLORS["miserable"]);
  });

  it("uses raw (unrounded) value for color — not the rounded display value", () => {
    // 70.9 rounds to 71° for display, but is still "muggy" (below the 71 threshold)
    expect(dewpointColor(70.9)).toBe(DEWPOINT_COLORS["muggy"]);
    expect(Math.round(70.9)).toBe(71);

    // 71.0 also rounds to 71° for display, but crosses into "oppressive"
    expect(dewpointColor(71.0)).toBe(DEWPOINT_COLORS["oppressive"]);
    expect(Math.round(71.0)).toBe(71);

    // 55.5 rounds to 56° for display, but is still "dry" (below the 56 threshold)
    expect(dewpointColor(55.5)).toBe(DEWPOINT_COLORS["dry"]);
    expect(Math.round(55.5)).toBe(56);
  });
});

describe("DEWPOINT_CHART_PIECES", () => {
  // Helper: resolve which piece a dewpoint value falls into
  function colorFromPieces(dewpoint) {
    const piece = DEWPOINT_CHART_PIECES.find(p => {
      const gteOk = p.gte === undefined || dewpoint >= p.gte;
      const ltOk  = p.lt  === undefined || dewpoint <  p.lt;
      return gteOk && ltOk;
    });
    return piece?.color;
  }

  it("matches dewpointColor for representative values across all comfort levels", () => {
    const testValues = [40, 49, 50, 52, 55, 56, 58, 60, 61, 63, 65, 66, 68, 70, 71, 73, 75, 76, 80];
    testValues.forEach(dp => {
      expect(colorFromPieces(dp)).toBe(dewpointColor(dp));
    });
  });

  it("matches dewpointColor at every boundary value", () => {
    [50, 56, 61, 66, 71, 76].forEach(boundary => {
      expect(colorFromPieces(boundary)).toBe(dewpointColor(boundary));
    });
  });

  it("uses raw (unrounded) dewpoint for color — pieces and dewpointColor agree at decimal boundary", () => {
    // 70.9 is muggy in both pieces and dewpointColor
    expect(colorFromPieces(70.9)).toBe(dewpointColor(70.9));
    expect(colorFromPieces(70.9)).toBe(DEWPOINT_COLORS["muggy"]);

    // 71.1 is oppressive in both
    expect(colorFromPieces(71.1)).toBe(dewpointColor(71.1));
    expect(colorFromPieces(71.1)).toBe(DEWPOINT_COLORS["oppressive"]);
  });
});