const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Task = require('../models/task');
const User = require('../models/user');
const Taskmaster = require('../models/taskmaster');
const Type = require('../models/type');

const getTasks = async (req, res, next) => {
  let tasks;
  try {
    tasks = await Task.find()
      .populate({ path: 'taskmaster', model: Taskmaster })
      .populate({ path: 'type', model: Type });
  } catch (err) {
    const error = new HttpError(
      'Falha na busca, tente novamente mais tarde.',
      500
    );
    return next(error);
  }
  res.json({ tasks: tasks });
};

const getInit = async (req, res, next) => {
  let tasks;
  try {
    tasks = await Task.find()
      .populate({ path: 'taskmaster', model: Taskmaster })
      .populate({ path: 'type', model: Type });
  } catch (err) {
    const error = new HttpError(
      'Falha na busca, tente novamente mais tarde.',
      500
    );
    return next(error);
  }

  let taskmasters;
  try {
    taskmasters = await Taskmaster.find();
  } catch (err) {
    const error = new HttpError(
      'Falha na busca, tente novamente mais tarde.',
      500
    );
    return next(error);
  }

  let types;
  try {
    types = await Type.find();
  } catch (err) {
    const error = new HttpError(
      'Falha na busca, tente novamente mais tarde.',
      500
    );
    return next(error);
  }

  res.json({ tasks: tasks, taskmasters: taskmasters, types: types });
};

const createTask = async (req, res, next) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError('Dados inválidos, verifique seu formulário.', 422)
    );
  }

  const { description, taskmaster, type, deadline } = req.body;

  const createdTask = new Task({
    description, 
    taskmaster, 
    type, 
    deadline
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Falha na busca, tente novamente mais tarde.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Não foi possível encontrar um usuário com esse id.', 404);
    console.log(error);
    return next(error);
  }

  try {
    await createdTask.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Falha na busca, tente novamente mais tarde.',
      500
    );
    return next(error);
  }

  res.status(201).json({ task: createdTask });
};

const deleteTask = async (req, res, next) => {
  const taskId = req.params.tid;

  let task;
  try {
    task = await Task.findById(taskId);
  } catch (err) {
    const error = new HttpError(
      'Algo errado, não foi possível excluir tarefa.',
      500
    );
    return next(error);
  }

  if (!task) {
    const error = new HttpError('Não foi possível encontrar tarefa com esse id', 404);
    return next(error);
  }

  try {
    await task.remove();
  } catch (err) {
    const error = new HttpError(
      'Algo errado, não foi possível excluir tarefa.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Tarefa deletada.' });
};

exports.getTasks = getTasks;
exports.getInit = getInit;
exports.createTask = createTask;
exports.deleteTask = deleteTask;