import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import index from '../index';

jest.mock('react-dom');

describe('index', () => {
    it('renders without crashing', () => {
        shallow(<index />);
        expect(ReactDOM.render).toHaveBeenCalledTimes(1);
    });
});
