import React from 'react';

import HourRow from '../components/HourRow.jsx';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Hour Row',
  component: HourRow,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  

  argTypes: {
    startTime: { control: 'date'},
    temperature: {
      control: { type: 'range', min: 32, max: 116 },
    },
    dewpoint: {
      control: { type: 'range', min: 40, max: 85 },
    },
  },
  decorators: [
    (Story) => (
      <table className="styled-table">
        <thead>
        <tr>
          <th>Time</th>
          <th><span title="Temperature">Temp</span></th>
          <th><span title="Relative Humidity">RH</span></th>
          <th><span title="Dewpoint">Dew</span></th>
        </tr>
        </thead>
        <tbody>
          <Story />
        </tbody>
      </table>
    )
  ]
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <HourRow {...args} />;

// get the time four hours from now
var inFourHours = new Date();
inFourHours.setHours(inFourHours.getHours() + 4);

export const Perfect = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Perfect.args = {
  startTime: inFourHours,
  temperature: 69,
  dewpoint: 40
};

export const TooHot = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

TooHot.args = {
  startTime: inFourHours,
  temperature: 89,
  dewpoint: 40
};

export const TooCold = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

TooCold.args = {
  startTime: inFourHours,
  temperature: 59,
  dewpoint: 40
};

export const TooDry = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

TooDry.args = {
  startTime: inFourHours,
  temperature: 69,
  dewpoint: 40
};

export const TooHumid = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

TooHumid.args = {
  startTime: inFourHours,
  temperature: 69,
  dewpoint: 40
};
