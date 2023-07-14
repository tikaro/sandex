// HourRow.stories.jsx

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

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Components/Hour Row',
  component: HourRow,
  args: {
    key: defaultParams.startTime,
    startTime: defaultParams.startTime,
    temperature: defaultParams.values.temperature,
    dewpoint: defaultParams.values.dewPoint,
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    key: {
        control: false,
        table: {
            disable: true,
        }
    },
    startTime: {
      control: {
        type: 'date',
      }

    },
    temperature: { 
      control: { 
        type: 'range', 
        min: 20, 
        max: 116,
        step: 0.1
      }
    },
    dewpoint: { 
        control: { 
          type: 'range', 
          min: 20, 
          max: 116,
          step: 0.1
        }
      },
  },
  render: (args) => (<table className="styled-table">
  <thead>
  <tr>
    <th>Time</th>
    <th><span title="Temperature">Temp</span></th>
    <th><span title="Dewpoint">Dew</span></th>
    <th><span title="Wet Bulb">Wet</span></th>
  </tr>
  </thead>
  <tbody>
      <HourRow {...args} />
  </tbody>
  </table>),
};

export const SummerWeather = {};
export const WinterWeather = {
    args: {
        temperature: 32.00,
        dewpoint: 32.00,
      },
};