import { mount } from '@vue/test-utils';
import GlobalNav from '@/components/GlobalNav.vue'; 
import { describe, it, expect } from 'vitest'

describe('GlobalNav', () => {
  it('renders the logo and title', () => {
    const wrapper = mount(GlobalNav);

    // Check if the logo is rendered
    const logo = wrapper.find('img');
    expect(logo.exists()).toBe(true);
    expect(logo.attributes('alt')).toBe('Logo');

    // Check if the title is rendered correctly
    const title = wrapper.find('h1');
    expect(title.text()).toBe('DentiQ');
  });

  it('displays user avatar and user name', () => {
    const wrapper = mount(GlobalNav);

    // Check if the user avatar image is rendered
    const avatar = wrapper.find('img[src="/svgs/user-avatar.svg"]');
    expect(avatar.exists()).toBe(true);
   })
})
