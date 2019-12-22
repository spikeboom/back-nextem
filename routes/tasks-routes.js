const express = require('express');
const { check } = require('express-validator');

const tasksControllers = require('../controllers/tasks-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

router.get('/', tasksControllers.getTasks);

router.post(
  '/',
  [
    check('description')
      .isLength({ min: 5 }),
    check('taskmaster')
      .not()
      .isEmpty(),
    check('type')
      .not()
      .isEmpty(),
    check('deadline')
      .not()
      .isEmpty()
  ],
  tasksControllers.createTask
);

router.get('/init', tasksControllers.getInit);

router.delete('/:tid', tasksControllers.deleteTask);

module.exports = router;
