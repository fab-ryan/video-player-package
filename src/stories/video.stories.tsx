import Video from '../components/video';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Video> = {
  title: 'Video',
  component: Video,
  argTypes: {
    videoSrc: {
      control: {
        type: 'text',
      },
      defaultValue: '/src/assets/Mbumbatiwe_N_amaboko_Ye_by_Echos_Du_Ciel.mp4',
    },
    videoTitle: {
      control: {
        type: 'text',
      },
      defaultValue: 'Video',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Video>;

const VideoTemplate: Story = {
  args: {
    videoSrc: '/src/assets/Mbumbatiwe_N_amaboko_Ye_by_Echos_Du_Ciel.mp4',
    videoTitle: 'Video',
  },
};

export const Default = VideoTemplate;
