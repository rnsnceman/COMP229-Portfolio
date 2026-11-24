import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contact from '../../src/pages/Contact';
import { api } from '../../src/lib/api';
vi.mock('../../src/lib/api', () => ({ api: vi.fn() }));
async function fill(user) {
  await user.type(screen.getByLabelText('First name'), 'Demo');
  await user.type(screen.getByLabelText('Last name'), 'Visitor');
  await user.type(screen.getByLabelText('Email address'), 'visitor@example.com');
  await user.type(screen.getByLabelText('Contact number'), '4165550123');
  await user.type(screen.getByLabelText('Message'), 'A website project inquiry.');
}
describe('Contact page', () => {
  it('labels required inputs and uses appropriate email/phone input types', () => {
    render(<Contact />);
    expect(screen.getByLabelText('First name')).toBeRequired();
    expect(screen.getByLabelText('Email address')).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText('Contact number')).toHaveAttribute('type', 'tel');
    expect(screen.getByLabelText('Message')).toBeRequired();
  });
  it('prevents an empty form from making a request', async () => {
    const user = userEvent.setup(); render(<Contact />);
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(api).not.toHaveBeenCalled();
  });
  it('maps controlled inputs to the backend schema and clears only after success', async () => {
    api.mockResolvedValueOnce({ _id: 'contact-1' });
    const user = userEvent.setup(); render(<Contact />); await fill(user);
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(api).toHaveBeenCalledWith('/contacts', { method: 'POST', body: JSON.stringify({ firstname: 'Demo', lastname: 'Visitor', email: 'visitor@example.com', phone: '4165550123', message: 'A website project inquiry.' }) });
    expect(await screen.findByRole('status')).toHaveTextContent('your message has been received');
    expect(screen.getByLabelText('First name')).toHaveValue('');
    expect(screen.getByLabelText('Message')).toHaveValue('');
  });
  it('preserves the inquiry after a server failure and enables retry', async () => {
    api.mockRejectedValueOnce(new Error('Service unavailable.'));
    const user = userEvent.setup(); render(<Contact />); await fill(user);
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Service unavailable.');
    expect(screen.getByLabelText('Message')).toHaveValue('A website project inquiry.');
    expect(screen.getByRole('button', { name: 'Send message' })).toBeEnabled();
  });
  it('disables the send button while the API request is pending', async () => {
    let finish; api.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
    const user = userEvent.setup(); render(<Contact />); await fill(user);
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled();
    finish({ _id: 'contact-2' });
    await waitFor(() => expect(screen.getByRole('button', { name: 'Send message' })).toBeEnabled());
  });
});
