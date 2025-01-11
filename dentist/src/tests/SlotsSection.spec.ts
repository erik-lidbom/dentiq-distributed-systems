import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import SlotsSection from '@/components/SlotsSection.vue'; 
import Datepicker from 'vue3-datepicker';

describe('SlotsSection.vue', () => {
    
    it('should render the correct number of slot buttons', () => {
        const wrapper = mount(SlotsSection);
        
        // Get all buttons excluding the calendar and confirm buttons
        const slotButtons = wrapper.findAll('button').filter(button => {
            return button.text() !== '' && button.text() !== 'Confirm Changes' && !button.find('i.pi-calendar').exists();
        });
        
        // Check that the correct number of slot buttons are rendered
        expect(slotButtons.length).toBe(9); 
    });

    it('buttons react correct to being clicked (active/not active)', async () => {
        const wrapper = mount(SlotsSection);
        
        // Get the slot buttons (ignoring the calendar and confirm buttons)
        const slotButtons = wrapper.findAll('button').filter(button => {
          return button.text() !== '' && button.text() !== 'Confirm Changes' && !button.find('i.pi-calendar').exists();
        });
    
    });

    it('formats the date correctly', () => {
        const wrapper = mount(SlotsSection);

        // Test if the computed date format is correct
        const formattedDate = wrapper.vm.formattedDate;
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        const expectedDate = new Date().toLocaleDateString('en-US', options);

        expect(formattedDate).toBe(expectedDate);
    });

    it('shows the calendar when the calendar button is clicked', async () => {
        const wrapper = mount(SlotsSection);

        // Initially, the calendar should not be visible
        expect(wrapper.findComponent(Datepicker).exists()).toBe(false);

        // Click the calendar button to toggle visibility
        await wrapper.find('button').trigger('click');

        // Now, the calendar should be visible
        expect(wrapper.findComponent(Datepicker).exists()).toBe(true);
    });
});
