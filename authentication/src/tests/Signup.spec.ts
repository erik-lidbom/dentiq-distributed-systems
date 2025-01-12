import { mount } from '@vue/test-utils'
import SignupView from '@/views/SignupView.vue'
import SignupForm from '@/components/SignupForm.vue'
import DentiQBanner from '@/components/DentiQBanner.vue'
import { describe, it, expect, beforeEach } from 'vitest'

describe('SignupView.vue', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(SignupView)
  })

  it('renders SignupForm and DentiQBanner correctly', () => {
    expect(wrapper.findComponent(SignupForm).exists()).toBe(true)
    expect(wrapper.findComponent(DentiQBanner).exists()).toBe(true)
  })

  it('shows validation errors for empty inputs', async () => {
    const form = wrapper.find('form')

    // Trigger form submission
    await form.trigger('submit.prevent')

    // Check for validation error messages
    expect(wrapper.text()).toContain('Full Name is required.')
    expect(wrapper.text()).toContain('Personal number is required.')
    expect(wrapper.text()).toContain('Email is required.')
    expect(wrapper.text()).toContain('Password is required.')
    expect(wrapper.text()).toContain('Confirm password is required.')
  })

  it('shows validation error for invalid email format', async () => {
    const emailInput = wrapper.find('input[type="email"]')

    // Set an invalid email
    await emailInput.setValue('invalid-email')

    // Trigger form submission
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Invalid email address.')
  })

  it('shows error when passwords do not match', async () => {
    const passwordInput = wrapper.find('input[placeholder="Password"]')
    const confirmPasswordInput = wrapper.find('input[placeholder="Confirm password"]')

    // Set different passwords
    await passwordInput.setValue('password123')
    await confirmPasswordInput.setValue('password456')

    // Trigger form submission
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Passwords do not match.')
  })

  // TODO: Add test for signing up (all fields are valid)
})
