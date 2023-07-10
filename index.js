const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let tasks = [
  {
    id: 1,
    descricao: "Estudar React",
    prazo: "2023-07-12T10:00:00",
    criacao: "2023-07-10T08:30:00",
    status: "to-do",
  },
  {
    id: 2,
    descricao: "Atividade mentoria node.js - Matheus",
    prazo: "2023-07-10T14:00:00",
    criacao: "2023-07-07T13:45:00",
    status: "to-do",
  },
];

// Adicionar sempre o proximo ID
function generateId() {
  return tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
}

// Adicionar um item de TODO
app.post('/todo', (req, res) => {
  const { descricao, prazo } = req.body;
  const criacao = new Date().toISOString();
  const id = generateId();

  const newTask = {
    id,
    descricao,
    prazo,
    criacao,
    status: "to-do",
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Finalizar um item de TODO
app.put('/todo/:id/finalizar', (req, res) => {
  const taskId = parseInt(req.params.id);

  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }

  if (task.status === "done") {
    return res.status(400).json({ error: 'A tarefa já está finalizada' });
  }

  task.status = "done";
  task.conclusao = new Date().toISOString();

  res.json(task);
});

// Editar um item de TODO
app.put('/todo/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { descricao, prazo } = req.body;

  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }

  task.descricao = descricao;
  task.prazo = prazo;
  task.ultimaEdicao = new Date().toISOString();

  res.json(task);
});

// Listar todos os itens de TODO
app.get('/todo', (req, res) => {
  const now = new Date().toISOString();
  const tasksWithStatus = tasks.map((task) => {
    const atrasado = task.prazo < now;

    return {
      ...task,
      atrasado,
    };
  });

  res.json(tasksWithStatus);
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
