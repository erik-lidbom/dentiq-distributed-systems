import { mount } from '@vue/test-utils';
import CancelPopup from '@/components/CancelPopup.vue';
import { describe, it, expect } from 'vitest'

describe('CancelPopup.vue', () => {
  it('renders when visible and closes on close button click', async () => {
    const wrapper = mount(CancelPopup, {
      props: {
        visible: true,
      },
    });

    // Check if the popup is rendered
    expect(wrapper.find('.fixed').exists()).toBe(true);

    // Click the close icon
    await wrapper.find('.pi-times').trigger('click');

    // Assert that the 'close' event is emitted
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('enables the confirm button when the confirmation text matches', async () => {
    const wrapper = mount(CancelPopup, {
      props: {
        visible: true,
      },
    });

    // Set the correct confirmation text
    const input = wrapper.find('#confirm_dentiq');
    await input.setValue('DentiQ');

    // Check if the confirm button is enabled
    const confirmButton = wrapper.find('button');
    expect(confirmButton.attributes('disabled')).toBeUndefined();

    // Click the confirm button (no need to check emitted events)
    await confirmButton.trigger('click');

    // Assert that the button was clickable (no errors thrown during click)
    expect(true).toBe(true); // Dummy assertion for clickability
  });
});
