// @flow

import * as React from 'react';
import { TaskList, TaskDetails, TaskEdit, TaskNew } from '../src/task-components';
import { type Task } from '../src/task-service';
import { shallow } from 'enzyme';
import { Form, Button, Column } from '../src/widgets';
import { NavLink } from 'react-router-dom';

jest.mock('../src/task-service', () => {
  class TaskService {
    getAll() {
      return Promise.resolve([
        { id: 1, title: 'Les leksjon', description: 'Les nøye', done: true },
        { id: 2, title: 'Møt opp på forelesning', description: 'I tide', done: false },
        { id: 3, title: 'Gjør øving', description: 'Før fristen', done: false },
      ]);
    }

    get(id: number) {
      return Promise.resolve({ id: 1, title: 'Les leksjon', description: 'Les nøye', done: true });
    }

    create(title: string) {
      return Promise.resolve(4); // Same as: return new Promise((resolve) => resolve(4));
    }

    update(task: Task) {
      return Promise.resolve();
    }

    delete(id: number) {
      return Promise.resolve();
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

  test('TaskDetails draws correctly', (done) => {
    const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <Column>Les leksjon</Column>,
          <Column>Les nøye</Column>,
          // $FlowExpectedError
          <Form.Checkbox checked={true} />,
        ])
      ).toEqual(true);
      done();
    });
  });

  test('TaskDetails draws correctly (using snapshot)', (done) => {
    const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });

  test('TaskDetails correctly sets location on edit', (done) => {
    const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <Column>Les leksjon</Column>,
          <Column>Les nøye</Column>,
          // $FlowExpectedError
          <Form.Checkbox checked={true} />,
        ])
      ).toEqual(true);

      wrapper.find(Button.Success).simulate('click');

      setTimeout(() => {
        expect(location.hash).toEqual('#/tasks/1/edit');
        done();
      });
    });
  });

  test('TaskEdit draws correctly', (done) => {
    const wrapper = shallow(<TaskEdit match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          // $FlowExpectedError
          <Form.Input value="Les leksjon" />,
          // $FlowExpectedError
          <Form.TextArea value="Les nøye" />,
          // $FlowExpectedError
          <Form.Checkbox checked={true} />,
        ])
      ).toEqual(true);
      done();
    });
  });

  test('TaskEdit correctly sets location on save', (done) => {
    const wrapper = shallow(<TaskEdit match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          // $FlowExpectedError
          <Form.Input value="Les leksjon" />,
          // $FlowExpectedError
          <Form.TextArea value="Les nøye" />,
          // $FlowExpectedError
          <Form.Checkbox checked={true} />,
        ])
      ).toEqual(true);

      wrapper
        .find(Form.Input)
        .simulate('change', { currentTarget: { value: 'Les leksjon igjen' } });
      // $FlowExpectedError
      expect(wrapper.containsMatchingElement(<Form.Input value="Les leksjon igjen" />)).toEqual(
        true
      );

      wrapper
        .find(Form.TextArea)
        .simulate('change', { currentTarget: { value: 'Les ekstra nøye' } });
      // $FlowExpectedError
      expect(wrapper.containsMatchingElement(<Form.TextArea value="Les ekstra nøye" />)).toEqual(
        true
      );

      wrapper.find(Button.Success).simulate('click');

      setTimeout(() => {
        expect(location.hash).toEqual('#/tasks/1');
        done();
      });
    });
  });

  test('TaskEdit correctly sets location on delete', (done) => {
    const wrapper = shallow(<TaskEdit match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          // $FlowExpectedError
          <Form.Input value="Les leksjon" />,
          // $FlowExpectedError
          <Form.TextArea value="Les nøye" />,
          // $FlowExpectedError
          <Form.Checkbox checked={true} />,
        ])
      ).toEqual(true);

      wrapper.find(Button.Danger).simulate('click');

      setTimeout(() => {
        expect(location.hash).toEqual('#/tasks');
        done();
      });
    });
  });

  test('TaskNew correctly sets location on create', (done) => {
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
});