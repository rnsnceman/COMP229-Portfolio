import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ResourceList from '../../src/components/ResourceList';
import { api } from '../../src/lib/api';
import { useAuth } from '../../src/context/AuthContext';
vi.mock('../../src/lib/api', () => ({ api: vi.fn() }));
vi.mock('../../src/context/AuthContext', () => ({ useAuth: vi.fn() }));
function show() { useAuth.mockReturnValue({ user: { role: 'user' } }); return render(<MemoryRouter><ResourceList resource="projects" /></MemoryRouter>); }
describe('Database-backed project list', () => {
  it('announces loading while the request is unresolved', () => {
    api.mockReturnValueOnce(new Promise(() => {})); show();
    expect(screen.getByRole('status')).toHaveTextContent('Loading projects');
  });
  it('renders database values and safe external project links', async () => {
    api.mockResolvedValueOnce([{ _id: 'p1', title: 'Test project', description: 'Saved description', url: 'https://example.com', image: '/assets/test.webp' }]); show();
    expect(await screen.findByRole('heading', { name: 'Test project' })).toBeVisible();
    expect(screen.getByRole('link', { name: /Visit project/ })).toHaveAttribute('rel', 'noreferrer');
    expect(screen.queryByRole('link', { name: 'Manage portfolio' })).not.toBeInTheDocument();
  });
  it('shows a readable empty state', async () => {
    api.mockResolvedValueOnce([]); show();
    expect(await screen.findByText('No projects have been added yet.')).toBeVisible();
  });
  it('offers a working retry after a failed fetch', async () => {
    api.mockRejectedValueOnce(new Error('Database unavailable')).mockResolvedValueOnce([]);
    const user = userEvent.setup(); show();
    expect(await screen.findByRole('alert')).toHaveTextContent('Database unavailable');
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText('No projects have been added yet.')).toBeVisible();
    expect(api).toHaveBeenCalledTimes(2);
  });
  it('shows a management link for an Admin', async () => {
    api.mockResolvedValueOnce([]); useAuth.mockReturnValue({ user: { role: 'admin' } });
    render(<MemoryRouter><ResourceList resource="projects" /></MemoryRouter>);
    expect(await screen.findByRole('link', { name: 'Manage portfolio' })).toHaveAttribute('href', '/manage');
  });
});
