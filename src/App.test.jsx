import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

const mockZipResponse = {
  places: [
    {
      "place name": "Arlington",
      state: "Texas",
      latitude: "32.7357",
      longitude: "-97.1088",
    },
  ],
};

const mockForecastResponse = {
  latitude: 32.7357,
  longitude: -97.1088,
  hourly: {
    time: [],
    temperature_2m: [],
    dew_point_2m: [],
  },
};

describe("App test", () => {
  beforeEach(() => {
    // Ensure each test starts with a clean URL (no query params)
    window.history.pushState({}, "", "/");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the application", () => {
    render(<App />);
    expect(screen.getByText(/Sandex/i)).toBeInTheDocument();
  });

  it("uses local JSON and makes no API calls when no zip parameter is provided", () => {
    const fetchSpy = vi.spyOn(global, "fetch");

    render(<App />);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(
      screen.getByText(/West Chester, Pennsylvania/i),
    ).toBeInTheDocument();
  });

  it("makes API calls to geocoding and forecast services when a zip parameter is provided", async () => {
    window.history.pushState({}, "", "/?zip=76006");

    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockZipResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockForecastResponse,
      });

    render(<App />);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining("zippopotam.us"),
    );
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining("open-meteo.com"),
    );
  });
});
