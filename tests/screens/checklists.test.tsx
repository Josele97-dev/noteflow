jest.mock('../../lib/api', () => ({
  getNotes: jest.fn(),
  getChecklists: jest.fn(),
  getIdeas: jest.fn(),

  createChecklist: jest.fn(),
  deleteChecklist: jest.fn(),
  updateChecklist: jest.fn(),
}));

import { render } from '@testing-library/react-native';
import React from 'react';
import ChecklistsScreen from '../../app/(tabs)/checklists';
import { useNotesStore } from '../../store/notesStore';

jest.mock('../../components/items/ChecklistCard', () => {
  const { Text } = require('react-native');
  return ({
    checklist,
  }: {
    checklist: { id: string; title: string };
  }) => <Text>{checklist.title}</Text>;
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
          data.map((c) => <Text key={c.id}>{c.title}</Text>)
        )}
      </View>
    ),
  };
});

describe('ChecklistsScreen', () => {
  beforeEach(() => {
    useNotesStore.setState({
      notes: [],
      ideas: [],
      checklists: [],
      _hydrated: true,
      isLoading: false,
      error: null,
    });
  });

  it('muestra estado vacío', () => {
    const { getByText } = render(<ChecklistsScreen />);
    expect(getByText('No hay tareas aún')).toBeTruthy();
  });

  it('muestra tareas cuando existen', () => {
    useNotesStore.setState({
      notes: [],
      ideas: [],
      checklists: [
        {
          id: '1',
          title: 'Tarea 1',
          items: [],
          archived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      _hydrated: true,
      isLoading: false,
      error: null,
    });

    const { getByText } = render(<ChecklistsScreen />);
    expect(getByText('Tarea 1')).toBeTruthy();
  });
});
