// @flow
import express from 'express';
import nameService, { type NameList } from './name-service';

/**
 * Express router containing nameList methods.
 */
const router: express$Router<> = express.Router();

router.get('/nameList', (request, response) => {
  nameService
    .getAll()
    .then((rows) => response.send(rows))
    .catch((error: Error) => response.status(500).send(error));
});

router.get('/nameList/:id', (request, response) => {
  const id = Number(request.params.id);
  nameService
    .get(id)
    .then((name) => (name ? response.send(name) : response.status(404).send('Task not found')))
    .catch((error: Error) => response.status(500).send(error));
});

// Example request body: { name: "Kari Nordmann", phone: 56565656, time_created:... now() }
// Example response body: { id: 4 }
router.post('/nameList', (request, response) => {
  const data = request.body;
  if (
    data &&
    typeof data.name == 'string' &&
    data.name.length != 0 &&
    typeof data.phone == 'number' &&
    data.name.length != 0 &&
    typeof data.time_created == 'number'
  )
    nameService
      .create(data.name, data.phone, data.time_created)
      .then((id) => response.send({ id: id }))
      .catch((error: Error) => response.status(500).send(error));
  else response.status(400).send('Missing name properties');
});

router.delete('/nameList/:id', (request, response) => {
  nameService
    .delete(Number(request.params.id))
    .then((result) => response.send())
    .catch((error: Error) => response.status(500).send(error));
});

export default router;
