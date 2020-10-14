// @flow

import * as React from 'react';
import { TaskList, TaskNew, TaskDetails, TaskEdit } from '../src/task-components';
import { type Task } from '../src/task-service';
import { shallow } from 'enzyme';
import { Form, Button, Column } from '../src/widgets';
import { NavLink } from 'react-router-dom';

jest.mock('../src/task-service', () => {
  class TaskService {
    getAll() {
      return Promise.resolve([
        { id: 1, title: 'Les leksjon', done: false, description: 'Gøy' },
        { id: 2, title: 'Møt opp på forelesning', done: false, description: '' },
        { id: 3, title: 'Gjør øving', done: false, description: '' },
      ]);
    }

    get(id: number) {
      {
        return Promise.resolve([{ id: 1, title: 'Les leksjon', done: false }]);
      }
    }

    update(id: number, title: string) {
      return Promise.resolve(1);
    }

    create(title: string) {
      return Promise.resolve(4); // Same as: return new Promise((resolve) => resolve(4));
    }

    delete(id: number) {
      return Promise.resolve([
        { id: 1, title: 'Les leksjon', done: false, description: 'Gøy' },
        { id: 2, title: 'Møt opp på forelesning', done: false, description: '' }
      ])
    }
  }


  return new TaskService();
});

describe('Task component tests', () => {
  test('TaskList draws correctly', (done) => {
    const wrapper = shallow(<TaskList />);

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <NavLink to="/tasks/1">Les leksjon</NavLink>,
          <NavLink to="/tasks/2">Møt opp på forelesning</NavLink>,
          <NavLink to="/tasks/3">Gjør øving</NavLink>,
        ])
      ).toEqual(true);
      done();
    });
  });
  // Adding test to check New task - button
  test('Tasklist correctly sets location on New click', (done) => {
    const wrapper = shallow(<TaskList /> );

    wrapper.find(Button.Success).simulate('click');
    //Waiting for events to finish
    setTimeout(() => {
      expect(location.hash).toEqual('#/tasks/new');
      done();
    })
  });

  test('TaskNew correctly sets location on Create click', (done) => {
    const wrapper = shallow(<TaskNew />);

    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'Kaffepause' } });
    // $FlowExpectedError
    expect(wrapper.containsMatchingElement(<Form.Input value="Kaffepause" />)).toEqual(true);

    wrapper.find(Button.Success).simulate('click');
    // Wait for events to complete
    setTimeout(() => {
      expect(location.hash).toEqual('#/tasks/4');
      done();
    });

  });

  //First TaskDetails test
  test('TaskDetails draws correctly', (done) => {
    const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />);

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <Column width={2}>Title:</Column>,
          <Column width={2}>Description:</Column>,
          <Column width={2}>Done:</Column>,
        ])
      ).toEqual(true);
      done();
    });
  });
  // Second TaskDetails test, using snapshot
  test('Test TaskDetails using snapshot', (done) => {
    const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />);

    expect(wrapper).toMatchSnapshot();
    done();
  });

  // Adding test for Edit button
  test('TaskDetails correctly sets location on Edit click', (done) => {
    const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }}/> );

    wrapper.find(Button.Success).simulate('click');
    //Waiting for events to finish
    setTimeout(() => {
      expect(location.hash).toEqual('#/tasks/1/edit');
      done();
    })
  });

// Adding tests for TaskEdit
  test('TaskEdit draws correctly', (done) => {
    const wrapper = shallow(<TaskEdit match={{ params: { id: 1 } }}/>);

    // Waiting for events to complete
    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });

  test('TaskEdit correctly sets location on Save click', (done) => {
      const wrapper = shallow(<TaskEdit match={{ params: { id: 1 } }}/>);

      wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'Test' } });
      // $FlowExpectedError
      expect(wrapper.containsMatchingElement(<Form.Input value="Test" />)).toEqual(true);

      wrapper.find(Button.Success).simulate('click');
      // Wait for events to complete
      setTimeout(() => {
        expect(location.hash).toEqual('#/tasks/1');
        done();
      });
    });

    test('TaskEdit correctly sets location on Delete click', (done) => {
      const wrapper = shallow(<TaskEdit match={{ params: { id: 1 } }}/>);

      wrapper.find(Button.Danger).simulate('click');
      // Waiting for events to finish
      setTimeout(() => {
        expect(location.hash).toEqual('#/tasks/');
        done();
      });
    });
});