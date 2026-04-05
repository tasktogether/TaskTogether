import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

export type StoryStatus = 'pending' | 'approved' | 'rejected';

export interface Story {
  id: string;
  volunteerId: string;
  volunteerName: string;
  taskTitle: string;
  reflection: string;
  coverImage?: string;
  submittedAt: Date;
  status: StoryStatus;
  tags?: string[];
}

interface StoriesContextType {
  stories: Story[];
  submitStory: (story: Omit<Story, 'id' | 'submittedAt' | 'status'>) => void;
  updateStoryStatus: (storyId: string, status: StoryStatus) => void;
  approvedStories: Story[];
  pendingStories: Story[];
}

const StoriesContext = createContext<StoriesContextType | undefined>(undefined);

const MOCK_STORIES: Story[] = [
  {
    id: 'example-story-1',
    volunteerId: 'example-user-1',
    volunteerName: 'Alex J.',
    taskTitle: 'Tech Help at the Senior Center',
    reflection:
      "I spent two hours showing Mr. Garcia how to video call his grandchildren who live in Mexico. When he finally saw their faces on the screen, he started crying happy tears. I'll never forget that moment — it reminded me why I started volunteering.",
    coverImage:
      'https://images.unsplash.com/photo-1587556930720-58ec521056a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlciUyMGhlbHBpbmclMjBvbGRlciUyMHBlcnNvbiUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzcyNTE2NjgwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    submittedAt: new Date(Date.now() - 7 * 86400000),
    status: 'approved',
    tags: ['Tech Help', 'Connection'],
  },
  {
    id: 'example-story-2',
    volunteerId: 'example-user-2',
    volunteerName: 'Maya T.',
    taskTitle: 'Community Garden Cleanup',
    reflection:
      "Mrs. Flores taught me how to prune roses the old-fashioned way — \"talk to them kindly,\" she said! We laughed so much and got the whole garden section done in record time. I learned that gardening is really about the stories you share while you dig.",
    coverImage:
      'https://images.unsplash.com/photo-1733388972592-ec1da2ddc432?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHZvbHVudGVlciUyMGdhcmRlbmluZyUyMGNvbW11bml0eXxlbnwxfHx8fDE3NzI1MTY2ODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    submittedAt: new Date(Date.now() - 14 * 86400000),
    status: 'approved',
    tags: ['Gardening', 'Friendship'],
  },
];

export const StoriesProvider = ({ children }: { children: ReactNode }) => {
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);

  const submitStory = (storyData: Omit<Story, 'id' | 'submittedAt' | 'status'>) => {
    const newStory: Story = {
      ...storyData,
      id: `story-${Date.now()}`,
      submittedAt: new Date(),
      status: 'pending',
    };
    setStories(prev => [newStory, ...prev]);
    toast.success('Your story has been submitted for review! 🌟');
  };

  const updateStoryStatus = (storyId: string, status: StoryStatus) => {
    setStories(prev =>
      prev.map(s => (s.id === storyId ? { ...s, status } : s))
    );
    const msg =
      status === 'approved'
        ? 'Story approved and published! 🎉'
        : 'Story has been rejected.';
    toast.success(msg);
  };

  const approvedStories = stories.filter(s => s.status === 'approved');
  const pendingStories = stories.filter(s => s.status === 'pending');

  return (
    <StoriesContext.Provider
      value={{ stories, submitStory, updateStoryStatus, approvedStories, pendingStories }}
    >
      {children}
    </StoriesContext.Provider>
  );
};

export const useStories = () => {
  const context = useContext(StoriesContext);
  if (context === undefined) {
    throw new Error('useStories must be used within a StoriesProvider');
  }
  return context;
};