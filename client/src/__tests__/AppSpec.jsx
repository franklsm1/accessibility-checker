import React from 'react';
import { mount } from 'enzyme';
import App from '../App';

describe('<App />', () => {
    let wrapper;

    const setup = () => {
        wrapper = mount(<App />);
        global.Headers = jest.fn();
    };

    it('renders page with header', () => {
        setup();
        expect(wrapper.text()).toContain('Accessibility Checker UI');
    });
});
