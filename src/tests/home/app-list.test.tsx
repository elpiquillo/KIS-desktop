import { cleanup, render, screen } from '@testing-library/react';
import { describe, beforeEach, vi } from 'vitest';

import '@testing-library/jest-dom';
import HomeView from 'src/sections/home/view';
import ApplicationsList from 'src/sections/home/apps-list';
import { APPLICATIONS_MOCK } from 'src/__mocks__/applications.mock';

describe('App list page', () => {
  beforeEach(() => {
    cleanup();
    render(<HomeView />);
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  describe('App list view', () => {
    it('should render the app view', () => {
      expect(screen.getByTestId('applications-list-container')).toBeInTheDocument();
    });
  });

  describe('App list header', () => {
    it('should render the search input', () => {
      expect(screen.getByTestId('input-search')).toBeInTheDocument();
    });

    it('should render the header container', () => {
      expect(screen.getByTestId('applications-list-header')).toBeInTheDocument();
    });

    it('should render the title', () => {
      expect(screen.getByPlaceholderText('Search by name')).toBeInTheDocument();
    });
  });

  describe('App list content', () => {
    beforeEach(() => {
      cleanup();
      render(
        <ApplicationsList
          headerActions={null}
          loading={false}
          title="Title test"
          searchValue=""
          applications={APPLICATIONS_MOCK}
        />
      );
    });

    it('should render the app list', () => {
      expect(screen.getByTestId('applications-list-container')).toBeInTheDocument();
    });

    it('should render the applications list grid', () => {
      expect(screen.getByTestId('application-grid')).toBeInTheDocument();
    });
    it('should render all the application name', () => {
      expect(screen.getByText('Portail Client')).toBeInTheDocument();
      expect(screen.getByText('Suivi prospects & clients')).toBeInTheDocument();
      expect(screen.getByText('App qui crash')).toBeInTheDocument();
      expect(screen.getByText('Basic Demo')).toBeInTheDocument();
      expect(screen.getByText('Calendrier')).toBeInTheDocument();
      expect(screen.getByText('Efficience commerciale')).toBeInTheDocument();
      expect(screen.getByText('FUll title test')).toBeInTheDocument();
      expect(screen.getByText('Gestion Fournisseurs')).toBeInTheDocument();
      expect(screen.getByText('Gestion prospects')).toBeInTheDocument();
      expect(screen.getByText('Gestionnaire de tâches')).toBeInTheDocument();
    });
  });
});
