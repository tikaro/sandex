import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HourRow from './HourRow';

const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

const defaultParams = {
  "startTime": tomorrow.toISOString(),
  "values": {
    "dewPoint": 68.68,
    "temperature": 73.96
  }
}

describe("Hour Row", () => {

  beforeEach(() => {
    render(<table><tbody><HourRow 
        key = {defaultParams.startTime} 
        startTime = {defaultParams.startTime}
        temperature = {defaultParams.values.temperature}
        dewpoint =  {defaultParams.values.dewPoint}
      /></tbody></table>);
  });

  it('shows the default temperature', () => {
    const textElement = screen.getByText(/74/i);
    expect(textElement).toBeInTheDocument();
  })
});
