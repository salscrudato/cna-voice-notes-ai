import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MetadataChips } from '../MetadataChips'
import type { ConversationMetadata } from '../../types'

describe('MetadataChips', () => {
  it('renders nothing when metadata is empty', () => {
    const { container } = render(<MetadataChips metadata={{}} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders broker, lob, and business type chips', () => {
    const metadata: ConversationMetadata = {
      broker: 'Acme Insurance',
      lob: 'commercial_general_liability',
      businessType: 'new_business',
    }
    render(<MetadataChips metadata={metadata} />)

    expect(screen.getByText(/Broker:/)).toBeInTheDocument()
    expect(screen.getByText('Acme Insurance')).toBeInTheDocument()
    expect(screen.getByText(/LOB:/)).toBeInTheDocument()
    expect(screen.getByText('commercial_general_liability')).toBeInTheDocument()
    expect(screen.getByText(/Type:/)).toBeInTheDocument()
    expect(screen.getByText('new_business')).toBeInTheDocument()
  })

  it('renders tags as removable chips', () => {
    const metadata: ConversationMetadata = {
      broker: 'Acme',
      tags: ['urgent', 'follow-up'],
    }
    const onRemoveTag = vi.fn()
    render(<MetadataChips metadata={metadata} onRemoveTag={onRemoveTag} />)

    expect(screen.getByText('urgent')).toBeInTheDocument()
    expect(screen.getByText('follow-up')).toBeInTheDocument()
  })

  it('calls onRemoveTag when tag remove button is clicked', async () => {
    const user = userEvent.setup()
    const metadata: ConversationMetadata = {
      broker: 'Acme',
      tags: ['urgent'],
    }
    const onRemoveTag = vi.fn()
    render(<MetadataChips metadata={metadata} onRemoveTag={onRemoveTag} />)

    const removeButtons = screen.getAllByLabelText(/Remove tag/)
    await user.click(removeButtons[0])

    expect(onRemoveTag).toHaveBeenCalledWith('urgent')
  })

  it('renders edit button when onEdit is provided', async () => {
    const user = userEvent.setup()
    const metadata: ConversationMetadata = { broker: 'Acme' }
    const onEdit = vi.fn()
    render(<MetadataChips metadata={metadata} onEdit={onEdit} />)

    const editButton = screen.getByRole('button', { name: /Edit metadata/ })
    await user.click(editButton)

    expect(onEdit).toHaveBeenCalled()
  })

  it('applies compact styling when compact prop is true', () => {
    const metadata: ConversationMetadata = { broker: 'Acme' }
    const { container } = render(<MetadataChips metadata={metadata} compact={true} />)

    const chipContainer = container.querySelector('div')
    expect(chipContainer).toHaveClass('text-xs')
  })
})

