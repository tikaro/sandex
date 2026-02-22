#!/usr/bin/env python3
"""
Fetch historical 6AM temperatures from Tomorrow.io API for each calendar day
across years 2021-2025, then output a CSV file.

Location: 39.985963,-75.622057 (West Chester, PA)
API: Tomorrow.io (formerly Climacell)

Usage:
    CLIMACELL_API_KEY=<key> python3 scripts/fetch_historical_temps.py [output.csv]
"""

import csv
import json
import os
import sys
import time
import urllib.request
import urllib.error
from datetime import date, datetime, timedelta, timezone

API_KEY = os.environ.get("CLIMACELL_API_KEY")
if not API_KEY:
    print("Error: CLIMACELL_API_KEY environment variable is not set.", file=sys.stderr)
    sys.exit(1)

LOCATION = "39.985963,-75.622057"
API_URL = "https://api.tomorrow.io/v4/timelines"

YEARS = [2021, 2022, 2023, 2024, 2025]
OUTPUT_FILE = sys.argv[1] if len(sys.argv) > 1 else "historical_temps.csv"

# Pause between API calls to stay within Tomorrow.io rate limits
RATE_LIMIT_SLEEP = 0.5

MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]


def ordinal(day):
    """Return day number with ordinal suffix (1st, 2nd, 3rd, 4th...)."""
    if 11 <= day <= 13:
        return f"{day}th"
    suffixes = {1: "st", 2: "nd", 3: "rd"}
    return f"{day}{suffixes.get(day % 10, 'th')}"


def format_date_label(month, day):
    """Format month/day as 'Month Dayth' (e.g., 'January 1st')."""
    return f"{MONTH_NAMES[month - 1]} {ordinal(day)}"


def utc_hour_for_6am_eastern(d):
    """Return the UTC hour that corresponds to 6AM Eastern time on date d.

    US Eastern observes EDT (UTC-4) from the second Sunday of March through
    the first Sunday of November, and EST (UTC-5) otherwise.
    """
    # Second Sunday in March
    march1 = date(d.year, 3, 1)
    march_first_sunday = march1 + timedelta(days=(6 - march1.weekday()) % 7)
    dst_start = march_first_sunday + timedelta(weeks=1)

    # First Sunday in November
    nov1 = date(d.year, 11, 1)
    nov_first_sunday = nov1 + timedelta(days=(6 - nov1.weekday()) % 7)
    dst_end = nov_first_sunday

    if dst_start <= d < dst_end:
        return 10  # EDT: UTC-4 → 6AM local = 10:00 UTC
    return 11      # EST: UTC-5 → 6AM local = 11:00 UTC


def fetch_temperature(year, month, day):
    """Return the temperature (°F) at 6AM Eastern on the given date.

    Returns None if the request fails or no data is available.
    """
    d = date(year, month, day)
    utc_hour = utc_hour_for_6am_eastern(d)
    start_dt = datetime(year, month, day, utc_hour, 0, 0, tzinfo=timezone.utc)
    end_dt = start_dt + timedelta(hours=1)
    start_time = start_dt.strftime("%Y-%m-%dT%H:%M:%SZ")
    end_time = end_dt.strftime("%Y-%m-%dT%H:%M:%SZ")

    payload = json.dumps({
        "location": LOCATION,
        "fields": ["temperature"],
        "units": "imperial",
        "timesteps": ["1h"],
        "startTime": start_time,
        "endTime": end_time,
    }).encode()

    url = f"{API_URL}?apikey={API_KEY}"
    req = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read())
            intervals = data["data"]["timelines"][0]["intervals"]
            if intervals:
                return round(intervals[0]["values"]["temperature"], 2)
            return None
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        print(
            f"  HTTP {e.code} for {year}-{month:02d}-{day:02d}: {body}",
            file=sys.stderr,
        )
        return None
    except Exception as e:
        print(
            f"  Error for {year}-{month:02d}-{day:02d}: {e}",
            file=sys.stderr,
        )
        return None


def main():
    rows = []

    # Use a leap year as the template so that Feb 29 is included.
    ref_year = 2024
    current = date(ref_year, 1, 1)
    year_end = date(ref_year, 12, 31)

    while current <= year_end:
        month, day = current.month, current.day
        label = format_date_label(month, day)
        print(f"Fetching {label}...", flush=True)

        temps = []
        for year in YEARS:
            # Feb 29 only exists in leap years; leave cell blank for others.
            if month == 2 and day == 29 and year != 2024:
                temps.append("")
                continue

            temp = fetch_temperature(year, month, day)
            temps.append(str(temp) if temp is not None else "")
            time.sleep(RATE_LIMIT_SLEEP)

        rows.append([label] + temps)
        current += timedelta(days=1)

    with open(OUTPUT_FILE, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([
            "Date",
            "Temp 2021 (°F)",
            "Temp 2022 (°F)",
            "Temp 2023 (°F)",
            "Temp 2024 (°F)",
            "Temp 2025 (°F)",
        ])
        writer.writerows(rows)

    print(f"\nOutput written to {OUTPUT_FILE}", flush=True)


if __name__ == "__main__":
    main()
