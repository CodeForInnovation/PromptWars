import { render, screen } from '@testing-library/react'
import FocusMode from '../src/components/FocusMode'
import { Task } from '../src/types'

describe('FocusMode', () => {
  it('renders loading state when tasks are undefined', () => {
    render(<FocusMode tasks={undefined} />)
    expect(screen.getByRole('status')).toHaveTextContent('Loading...')
  })

  it('renders empty state when there are no tasks', () => {
    render(<FocusMode tasks={[]} />)
    expect(screen.getByText(/You have no pending tasks/i)).toBeInTheDocument()
  })

  it('renders a list of tasks', () => {
    const mockTasks: Task[] = [
      { id: '1', title: 'Task 1', description: 'Desc 1', assigned_to: 'User', status: 'pending' },
      { id: '2', title: 'Task 2', description: 'Desc 2', assigned_to: 'User', status: 'blocked' }
    ]
    render(<FocusMode tasks={mockTasks} />)
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
    
    // Check if the blocked status is rendered
    expect(screen.getByText('BLOCKED')).toBeInTheDocument()
    expect(screen.getByText('PENDING')).toBeInTheDocument()
  })
})
