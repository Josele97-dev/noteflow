jest.mock('../../lib/api', () => ({
  getNotes: jest.fn(),
  getChecklists: jest.fn(),
  getIdeas: jest.fn(),

  createNote: jest.fn(),
  deleteNote: jest.fn(),
  updateNote: jest.fn(),

  createIdea: jest.fn(),
  deleteIdea: jest.fn(),
  updateIdea: jest.fn(),

  createChecklist: jest.fn(),
  deleteChecklist: jest.fn(),
  updateChecklist: jest.fn(),
}));

import { render } from '@testing-library/react-native';
import React from 'react';
import NotasScreen from '../../app/(tabs)/notas';
import { useNotesStore } from '../../store/notesStore';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../../components/items/NoteCard', () => {
  const { Text } = require('react-native');
  return ({
    note,
  }: {
    note: { id: string; title: string };
  }) => <Text>{note.title}</Text>;
});

jest.mock('../../components/lists/BaseList', () => {
  const { View, Text } = require('react-native');

  return {
    BaseList: ({
      data,
      emptyTitle,
    }: {
      data: { id: string; title: string }[];
      emptyTitle: string;
    }) => (
      <View>
        {data.length === 0 ? (
          <Text>{emptyTitle}</Text>
        ) : (
          data.map((n) => <Text key={n.id}>{n.title}</Text>)
        )}
      </View>
    ),
  };
});

describe('NotasScreen', () => {
  beforeEach(() => {
    useNotesStore.setState({
      notes: [],
      checklists: [],
      ideas: [],
      _hydrated: true,
      isLoading: false,
      error: null,
    });
  });

  it('muestra estado vacío cuando no hay notas', () => {
    const { getByText } = render(<NotasScreen />);
    expect(getByText('No hay notas aún')).toBeTruthy();
  });

  it('muestra notas cuando el store tiene datos', () => {
    useNotesStore.setState({
      notes: [
        {
          id: '1',
          title: 'Nota 1',
          content: '',
          archived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          title: 'Nota 2',
          content: '',
          archived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      checklists: [],
      ideas: [],
      _hydrated: true,
      isLoading: false,
      error: null,
    });

    const { getByText } = render(<NotasScreen />);
    expect(getByText('Nota 1')).toBeTruthy();
    expect(getByText('Nota 2')).toBeTruthy();
  });
});
