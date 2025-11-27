import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMetadata } from '../useMetadata'
import * as chatService from '../../services/chatService'

vi.mock('../../services/chatService')
vi.mock('../../services/logger')

describe('useMetadata', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with empty metadata when not provided', () => {
    const { result } = renderHook(() => ({
      conversationId: 'conv-1',
      initialMetadata: undefined,
    }))

    expect(result.current).toBeDefined()
  })

  it('initializes with provided metadata', () => {
    const initialMetadata = { broker: 'Acme', lob: 'cgl' }
    const { result } = renderHook(() =>
      useMetadata({
        conversationId: 'conv-1',
        initialMetadata,
      })
    )

    expect(result.current.metadata).toEqual(initialMetadata)
  })

  it('updates metadata field', async () => {
    const { result } = renderHook(() =>
      useMetadata({
        conversationId: 'conv-1',
        initialMetadata: { broker: 'Acme' },
      })
    )

    vi.mocked(chatService.chatService.updateConversationMetadata).mockResolvedValue(undefined)

    await act(async () => {
      await result.current.updateField('client', 'ABC Corp')
    })

    expect(result.current.metadata.client).toBe('ABC Corp')
  })

  it('adds tag to metadata', async () => {
    const { result } = renderHook(() =>
      useMetadata({
        conversationId: 'conv-1',
        initialMetadata: { broker: 'Acme', tags: ['urgent'] },
      })
    )

    vi.mocked(chatService.chatService.updateConversationMetadata).mockResolvedValue(undefined)

    await act(async () => {
      await result.current.addTag('follow-up')
    })

    expect(result.current.metadata.tags).toContain('follow-up')
    expect(result.current.metadata.tags).toContain('urgent')
  })

  it('removes tag from metadata', async () => {
    const { result } = renderHook(() =>
      useMetadata({
        conversationId: 'conv-1',
        initialMetadata: { broker: 'Acme', tags: ['urgent', 'follow-up'] },
      })
    )

    vi.mocked(chatService.chatService.updateConversationMetadata).mockResolvedValue(undefined)

    await act(async () => {
      await result.current.removeTag('urgent')
    })

    expect(result.current.metadata.tags).not.toContain('urgent')
    expect(result.current.metadata.tags).toContain('follow-up')
  })

  it('does not add duplicate tags', async () => {
    const { result } = renderHook(() =>
      useMetadata({
        conversationId: 'conv-1',
        initialMetadata: { broker: 'Acme', tags: ['urgent'] },
      })
    )

    vi.mocked(chatService.chatService.updateConversationMetadata).mockResolvedValue(undefined)

    await act(async () => {
      await result.current.addTag('urgent')
    })

    expect(result.current.metadata.tags?.filter(t => t === 'urgent')).toHaveLength(1)
  })

  it('clears metadata', () => {
    const { result } = renderHook(() =>
      useMetadata({
        conversationId: 'conv-1',
        initialMetadata: { broker: 'Acme', lob: 'cgl' },
      })
    )

    act(() => {
      result.current.clearMetadata()
    })

    expect(result.current.metadata).toEqual({})
  })
})

