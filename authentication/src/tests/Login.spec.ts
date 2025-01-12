import { mount } from '@vue/test-utils'
import LoginView from '@/views/LoginView.vue'
import LoginForm from '@/components/LoginForm.vue'
import DentiQBanner from '@/components/DentiQBanner.vue'
import { describe, it, expect, beforeEach } from 'vitest'

// Note: Issue with router and font-awesome

describe('LoginView.vue', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(LoginView)
  })

  it('renders LoginForm and DentiQBanner correctly', () => {
    // Test that LoginForm is rendered
    expect(wrapper.findComponent(LoginForm).exists()).toBe(true)

    // Test that DentiQBanner is rendered
    expect(wrapper.findComponent(DentiQBanner).exists()).toBe(true)
  })

  it('can type into the email and password inputs', async () => {
    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')

    // Simulate typing into the email input
    await emailInput.setValue('test@example.com')
    expect(emailInput.element.value).toBe('test@example.com')

    // Simulate typing into the password input
    await passwordInput.setValue('password123')
    expect(passwordInput.element.value).toBe('password123')
  })

  it('shows validation errors for empty inputs', async () => {
    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')

    // Clear the inputs to trigger validation errors
    await emailInput.setValue('')
    await passwordInput.setValue('')
    
    // Simulate form submission (without actual submission, to trigger validation)
    await wrapper.find('form').trigger('submit.prevent')

    // Check if error messages are displayed
    expect(wrapper.text()).toContain('Email is required.')
    expect(wrapper.text()).toContain('Password is required.')
  })

  it('shows validation error for invalid email format', async () => {
    const emailInput = wrapper.find('input[type="email"]')

    // Set an invalid email
    await emailInput.setValue('invalid-email')

    // Simulate form submission to trigger validation
    await wrapper.find('form').trigger('submit.prevent')

    // Check if the correct error message is shown
    expect(wrapper.text()).toContain('Invalid email address.')

  })
})
