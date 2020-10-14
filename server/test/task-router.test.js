// @flow

import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import taskService, { type Task } from '../src/task-service';

const testTasks: Task[] = [
  { id: 1, title: 'Les leksjon', description: 'Les nøye', done: false },
  { id: 2, title: 'Møt opp på forelesning', description: 'I tide', done: false },
  { id: 3, title: 'Gjør øving', description: 'Før fristen', done: false },
];

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

let webServer;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3001, () => done());
});

beforeEach((done) => {
  // Delete all tasks, and reset id auto-increment start value
  pool.query('TRUNCATE TABLE Tasks', (error) => {
    if (error) return done.fail(error);

    testTasks
      .reduce(
        (prev, cur) => prev.then(() => taskService.create(cur.title, cur.description)),
        Promise.resolve()
      )
      .then(() => done());
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done.fail(new Error());
  webServer.close(() => pool.end(() => done()));
});

describe('Fetch tasks (GET)', () => {
  test('Fetch all tasks (200 OK)', (done) => {
    axios.get<Task[]>('/tasks').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testTasks);
      done();
    });
  });

  test('Fetch task (200 OK)', (done) => {
    axios.get<Task>('/tasks/1').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testTasks[0]);
      done();
    });
  });

  test('Fetch task (404 Not Found)', (done) => {
    axios
      .get<Task>('/tasks/4')
      .then((response) => done.fail(new Error()))
      .catch((error: Error) => {
        expect(error.message).toEqual('Request failed with status code 404');
        done();
      });
  });
});

describe('Update task (PUT)', () => {
  test('Update task (200 OK)', (done) => {
    axios
      .put<{}, void>('/tasks', {
        id: 1,
        title: 'Les leksjon igjen',
        description: 'Les ekstra nøye',
        done: true,
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        done();
      });
  });

  test('Update task (400)', (done) => {
    axios
      .put<{}, number>('/tasks', {
        id: 1,
        title: '',
        description: 'Les ekstra nøye',
      })
      .catch((error: Error) => {
        expect(error.message).toEqual('Request failed with status code 400');
        done();
      });
  });
});

describe('Create new task (POST)', () => {
  test('Create new task (200 OK)', (done) => {
    axios
      .post<{}, number>('/tasks', { title: 'Kaffepause', description: 'Svart kaffe' })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual({ id: 4 });
        done();
      });
  });

  test('Create new task (400)', (done) => {
    axios
      .post<{}, number>('/tasks', { title: '', description: 'Svart kaffe' })
      .catch((error: Error) => {
        expect(error.message).toEqual('Request failed with status code 400');
        done();
      });
  });
});

describe('Delete task (DELETE)', () => {
  test('Delete task (200 OK)', (done) => {
    axios.delete('/tasks/2').then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });

  test('Delete task (500)', (done) => {
    axios.delete('/tasks/10').catch((error: Error) => {
      expect(error.message).toEqual('Request failed with status code 500');
      done();
    });
  });
});