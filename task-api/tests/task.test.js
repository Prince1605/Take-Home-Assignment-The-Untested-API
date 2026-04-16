const request = require("supertest");
const app = require("../src/app");
const taskService = require("../src/services/taskService");

afterEach(() => {
  taskService._reset();
});

// it gives all tasks checkking get 
describe("GET /tasks", () => {

  test("should return all tasks with status 200", async () => {
    const res = await request(app).get("/tasks");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true); // response array hona chahiye
  });

});

// Now-> we are checking the post api for tast and giving title to it checking is it gives result as failure or pass;
describe("POST /tasks", () => {

  test("create task successfully", async () => {
    const res = await request(app).post("/tasks").send({
      title: "My Task"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("My Task");
  });

  test("fail if title missing", async () => {
    const res = await request(app).post("/tasks").send({});

    expect(res.statusCode).toBe(400);
  });

});
// checking the delete route
describe("DELETE /tasks/:id", () => {

test("delete task successfully", async () => {
  const createRes = await request(app).post("/tasks").send({
    title: "Task to delete"
  });

  const taskId = createRes.body.id;

  const res = await request(app).delete(`/tasks/${taskId}`);

  expect(res.statusCode).toBe(204);
});

  test("fail if task not found", async () => {
    const res = await request(app).delete("/tasks/9999");

    expect(res.statusCode).toBe(404);
  });

});

//test for status
describe("GET /tasks/stats", () => {

  test("should return correct stats", async () => {
    // create tasks here we are creating task 
    await request(app).post("/tasks").send({
      title: "Task 1",
      status: "todo"
    });
    //2nd tasks
    await request(app).post("/tasks").send({
      title: "Task 2",
      status: "done"
    });
    //now getiing the response from the server
    const res = await request(app).get("/tasks/stats");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("todo");
    expect(res.body).toHaveProperty("done");
    expect(res.body).toHaveProperty("overdue");
  });

});

// Pagination Checkiing
describe("GET /tasks pagination",() => {

  test("should return correct first page",async () => {
    // create 3 tasks
    await request(app).post("/tasks").send({title:"Task 1"});
    await request(app).post("/tasks").send({title:"Task 2"});
    await request(app).post("/tasks").send({title:"Task 3"});

    const res = await request(app).get("/tasks?page=1&limit=2");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);

    // expected first task
    expect(res.body[0].title).toBe("Task 1"); 
  });

});

// Assigning to task to user 
describe("PATCH /tasks/:id/assign", () => {

  test("assign task to user", async () => {
    const createRes = await request(app).post("/tasks").send({
      title: "Assign me"
    });

    const id = createRes.body.id;

    const res = await request(app)
      .patch(`/tasks/${id}/assign`)
      .send({ userId: "user-1" });

    expect(res.statusCode).toBe(200);
    expect(res.body.assignedTo).toBe("user-1");
  });

  test("fail if userId missing", async () => {
    const createRes = await request(app).post("/tasks").send({
      title: "Test"
    });

    const id = createRes.body.id;

    const res = await request(app)
      .patch(`/tasks/${id}/assign`)
      .send({});

    expect(res.statusCode).toBe(400);
  });

});