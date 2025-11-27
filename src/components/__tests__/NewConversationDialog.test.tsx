import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NewConversationDialog } from '../NewConversationDialog'

describe('NewConversationDialog', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <NewConversationDialog
        isOpen={false}
        onClose={vi.fn()}
        onCreate={vi.fn()}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders dialog when isOpen is true', () => {
    render(
      <NewConversationDialog
        isOpen={true}
        onClose={vi.fn()}
        onCreate={vi.fn()}
      />
    )
    expect(screen.getByText('New Conversation')).toBeInTheDocument()
  })

  it('renders required fields', () => {
    render(
      <NewConversationDialog
        isOpen={true}
        onClose={vi.fn()}
        onCreate={vi.fn()}
      />
    )
    expect(screen.getByLabelText(/Broker \*/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Line of Business \*/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Business Type \*/)).toBeInTheDocument()
  })

  it('shows error when broker is empty', async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn()
    render(
      <NewConversationDialog
        isOpen={true}
        onClose={vi.fn()}
        onCreate={onCreate}
      />
    )

    const createButton = screen.getByRole('button', { name: /Create/ })
    await user.click(createButton)

    expect(screen.getByText('Broker is required')).toBeInTheDocument()
    expect(onCreate).not.toHaveBeenCalled()
  })

  it('calls onCreate with metadata when form is valid', async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn().mockResolvedValue(undefined)
    render(
      <NewConversationDialog
        isOpen={true}
        onClose={vi.fn()}
        onCreate={onCreate}
      />
    )

    const brokerInput = screen.getByPlaceholderText('Enter broker name...')
    const lobSelect = screen.getByDisplayValue('Select LOB...')
    const newBusinessRadio = screen.getByLabelText('New Business')

    await user.type(brokerInput, 'Acme Insurance')
    await user.selectOptions(lobSelect, 'commercial_general_liability')
    await user.click(newBusinessRadio)

    const createButton = screen.getByRole('button', { name: /Create/ })
    await user.click(createButton)

    expect(onCreate).toHaveBeenCalledWith({
      broker: 'Acme Insurance',
      lob: 'commercial_general_liability',
      businessType: 'new_business',
    })
  })

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <NewConversationDialog
        isOpen={true}
        onClose={onClose}
        onCreate={vi.fn()}
      />
    )

    const cancelButton = screen.getByRole('button', { name: /Cancel/ })
    await user.click(cancelButton)

    expect(onClose).toHaveBeenCalled()
  })

  it('disables form when isLoading is true', () => {
    render(
      <NewConversationDialog
        isOpen={true}
        onClose={vi.fn()}
        onCreate={vi.fn()}
        isLoading={true}
      />
    )

    const brokerInput = screen.getByPlaceholderText('Enter broker name...')
    expect(brokerInput).toBeDisabled()
  })
})

