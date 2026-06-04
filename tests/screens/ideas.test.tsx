jest.mock('../../lib/api', () => ({
  getNotes: jest.fn(),
  getChecklists: jest.fn(),
  getIdeas: jest.fn(),

  createIdea: jest.fn(),
  deleteIdea: jest.fn(),
  updateIdea: jest.fn(),
}));

import { render } from '@testing-library/react-native';
import React from 'react';
import IdeasScreen from '../../app/(tabs)/ideas';
import { useNotesStore } from '../../store/notesStore';

jest.mock('../../components/items/IdeaCard', () => {
  const { Text } = require('react-native');
  return ({ idea }: any) => <Text>{idea.title}</Text>;
});

jest.mock('../../components/lists/BaseList', () => {
  const { View, Text } = require('react-native');

  return {
    BaseList: ({ data, emptyTitle }: any) => (
      <View>
        {data.length === 0 ? (
          <Text>{emptyTitle}</Text>
        ) : (
          data.map((i: any) => <Text key={i.id}>{i.title}</Text>)
        )}
      </View>
    ),
  };
});

describe('IdeasScreen', () => {
  beforeEach(() => {
    useNotesStore.setState({
      notes: [],
      ideas: [],
      checklists: [],
      _hydrated: true,
    });
  });

  it('muestra estado vacío', () => {
    const { getByText } = render(<IdeasScreen />);
    expect(getByText('No hay ideas aún')).toBeTruthy();
  });

  it('muestra ideas cuando existen', () => {
    useNotesStore.setState({
      notes: [],
      ideas: [
        {
          id: '1',
          title: 'Idea 1',
          content: '',
          color: '#fff',
          tags: [],
          archived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      checklists: [],
      _hydrated: true,
    });

    const { getByText } = render(<IdeasScreen />);

    expect(getByText('Idea 1')).toBeTruthy();
  });
});