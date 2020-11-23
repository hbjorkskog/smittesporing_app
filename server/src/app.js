// @flow

import express from 'express';
import nameRouter from './name-router';

/**
 * Express application.
 */
const app: express$Application<> = express();

app.use(express.json());

// Since API is not compatible with v1, API version is increased to v2
app.use('/api/v2', nameRouter);

export default app;
