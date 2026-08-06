import { describe, expect, it } from 'vitest'
import { emptyForm, hasErrors, validate } from './validation'

const valid = {
  name: 'Jane Doe',
  email: 'jane@company.com',
  phone: '',
  service: '',
  message: 'We need a network refresh across two Lagos offices.',
}

describe('contact form validation', () => {
  it('accepts a complete submission', () => {
    expect(validate(valid)).toEqual({})
    expect(hasErrors(validate(valid))).toBe(false)
  })

  it('requires name, email and message', () => {
    const errors = validate(emptyForm)
    expect(errors.name).toBeDefined()
    expect(errors.email).toBeDefined()
    expect(errors.message).toBeDefined()
  })

  it('treats whitespace-only values as empty', () => {
    const errors = validate({ ...valid, name: '   ', message: '  \n ' })
    expect(errors.name).toBeDefined()
    expect(errors.message).toBeDefined()
  })

  it.each(['jane', 'jane@', 'jane@company', 'jane doe@company.com', '@company.com'])(
    'rejects malformed email %s',
    (email) => {
      expect(validate({ ...valid, email }).email).toBeDefined()
    },
  )

  it.each(['jane@company.com', 'j.doe+tag@sub.company.co.uk'])('accepts email %s', (email) => {
    expect(validate({ ...valid, email }).email).toBeUndefined()
  })

  it('leaves an empty phone alone but rejects a bad one', () => {
    expect(validate({ ...valid, phone: '' }).phone).toBeUndefined()
    expect(validate({ ...valid, phone: '+234 705 045 8935' }).phone).toBeUndefined()
    expect(validate({ ...valid, phone: '12345' }).phone).toBeDefined()
    expect(validate({ ...valid, phone: 'call me' }).phone).toBeDefined()
  })

  it('rejects a message that is too short to act on', () => {
    expect(validate({ ...valid, message: 'help' }).message).toBeDefined()
  })
})
