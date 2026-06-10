import * as api from '../../lib/api';
import { useNotesStore } from '../../store/notesStore';

jest.mock('../../lib/api', () => ({
  getNotes: jest.fn().mockResolvedValue([]),
  getChecklists: jest.fn().mockResolvedValue([]),
  getIdeas: jest.fn().mockResolvedValue([]),

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

const mockedApi = api as jest.Mocked<typeof api>;

describe('notesStore', () => {
  beforeEach(() => {
    useNotesStore.setState({
      notes: [],
      checklists: [],
      ideas: [],
      _hydrated: false,
      isLoading: false,
      error: null,
    });

    jest.clearAllMocks();
  });

  it('se inicializa vacío', () => {
    const state = useNotesStore.getState();

    expect(state.notes).toEqual([]);
    expect(state.checklists).toEqual([]);
    expect(state.ideas).toEqual([]);
  });

  it('fetchAll carga datos y activa _hydrated', async () => {
    await useNotesStore.getState().fetchAll();

    const state = useNotesStore.getState();
    expect(state._hydrated).toBe(true);
  });

  it('addNote añade una nota', async () => {
    mockedApi.createNote.mockResolvedValue({
      id: '1',
      title: 'Mi nota',
      content: 'Contenido de prueba',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await useNotesStore.getState().addNote({
      title: 'Mi nota',
      content: 'Contenido de prueba',
    });

    expect(useNotesStore.getState().notes).toHaveLength(1);
    expect(useNotesStore.getState().notes[0].title).toBe('Mi nota');
  });

  it('deleteNote elimina una nota', async () => {
    useNotesStore.setState({
      notes: [
        {
          id: '1',
          title: 'Nota para eliminar',
          content: 'Este contenido desaparecerá',
          archived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    mockedApi.deleteNote.mockResolvedValue(undefined);

    await useNotesStore.getState().deleteNote('1');

    expect(useNotesStore.getState().notes).toHaveLength(0);
  });

  it('archiveNote marca como archivada', async () => {
    useNotesStore.setState({
      notes: [
        {
          id: '1',
          title: 'Nota para archivar',
          content: 'Contenido de la nota',
          archived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    mockedApi.updateNote.mockResolvedValue({});

    await useNotesStore.getState().archiveNote('1');

    expect(useNotesStore.getState().notes[0].archived).toBe(true);
  });

  it('unarchiveNote desmarca archivada', async () => {
    useNotesStore.setState({
      notes: [
        {
          id: '1',
          title: 'Nota archivada',
          content: 'Contenido de la nota archivada',
          archived: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    mockedApi.updateNote.mockResolvedValue({});

    await useNotesStore.getState().unarchiveNote('1');

    expect(useNotesStore.getState().notes[0].archived).toBe(false);
  });

  it('addIdea añade una idea', async () => {
    mockedApi.createIdea.mockResolvedValue({
      id: '2',
      title: 'Idea de negocio',
      content: 'Descripción de la idea',
      color: '#FFD700',
      tags: ['startup', 'tech'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await useNotesStore.getState().addIdea({
      title: 'Idea de negocio',
      content: 'Descripción de la idea',
      color: '#FFD700',
      tags: ['startup', 'tech'],
    });

    expect(useNotesStore.getState().ideas).toHaveLength(1);
  });

  it('deleteIdea elimina una idea', async () => {
    useNotesStore.setState({
      ideas: [
        {
          id: '2',
          title: 'Idea para eliminar',
          content: 'Descripción que desaparecerá',
          color: '#FF6B6B',
          tags: ['diseño'],
          archived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    mockedApi.deleteIdea.mockResolvedValue(undefined);

    await useNotesStore.getState().deleteIdea('2');

    expect(useNotesStore.getState().ideas).toHaveLength(0);
  });

  it('archiveIdea marca idea como archivada', async () => {
    useNotesStore.setState({
      ideas: [
        {
          id: '2',
          title: 'Idea para archivar',
          content: 'Descripción de la idea',
          color: '#6C63FF',
          tags: ['proyecto'],
          archived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    mockedApi.updateIdea.mockResolvedValue({});

    await useNotesStore.getState().archiveIdea('2');

    expect(useNotesStore.getState().ideas[0].archived).toBe(true);
  });

  it('unarchiveIdea desmarca idea como archivada', async () => {
    useNotesStore.setState({
      ideas: [
        {
          id: '2',
          title: 'Idea archivada',
          content: 'Descripción de la idea archivada',
          color: '#4CAF50',
          tags: ['pendiente'],
          archived: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    mockedApi.updateIdea.mockResolvedValue({});

    await useNotesStore.getState().unarchiveIdea('2');

    expect(useNotesStore.getState().ideas[0].archived).toBe(false);
  });

  it('addChecklist añade una tarea', async () => {
    mockedApi.createChecklist.mockResolvedValue({
      id: '3',
      title: 'Lista de la compra',
      items: [
        { id: 'i1', text: 'Leche', isCompleted: false },
        { id: 'i2', text: 'Pan', isCompleted: false },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await useNotesStore.getState().addChecklist({
      title: 'Lista de la compra',
      items: [
        { id: 'i1', text: 'Leche', isCompleted: false },
        { id: 'i2', text: 'Pan', isCompleted: false },
      ],
    });

    expect(useNotesStore.getState().checklists).toHaveLength(1);
  });

  it('deleteChecklist elimina una tarea', async () => {
    useNotesStore.setState({
      checklists: [
        {
          id: '3',
          title: 'Lista para eliminar',
          items: [{ id: 'i1', text: 'Tarea pendiente', isCompleted: false }],
          archived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    mockedApi.deleteChecklist.mockResolvedValue(undefined);

    await useNotesStore.getState().deleteChecklist('3');

    expect(useNotesStore.getState().checklists).toHaveLength(0);
  });

  it('archiveChecklist marca tarea como archivada', async () => {
    useNotesStore.setState({
      checklists: [
        {
          id: '3',
          title: 'Lista para archivar',
          items: [{ id: 'i1', text: 'Tarea completada', isCompleted: true }],
          archived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    mockedApi.updateChecklist.mockResolvedValue({});

    await useNotesStore.getState().archiveChecklist('3');

    expect(useNotesStore.getState().checklists[0].archived).toBe(true);
  });

  it('unarchiveChecklist desmarca tarea como archivada', async () => {
    useNotesStore.setState({
      checklists: [
        {
          id: '3',
          title: 'Lista archivada',
          items: [{ id: 'i1', text: 'Tarea archivada', isCompleted: false }],
          archived: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    mockedApi.updateChecklist.mockResolvedValue({});

    await useNotesStore.getState().unarchiveChecklist('3');

    expect(useNotesStore.getState().checklists[0].archived).toBe(false);
  });
});