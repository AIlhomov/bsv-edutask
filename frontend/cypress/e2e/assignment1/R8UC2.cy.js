describe("check and uncheck existing ToDO items", () => {
  // define variables that we need on multiple occasions
  let uid; // user idsadlkasndlnad
  let name; // name of the user (firstName + ' ' + lastName)
  let email; // email of the usersjadnsandsad
  let taskTitle = "Test Task Title";
  let youtubeKey = "yk3prd8GER4"; // Use a valid video ID
  let todoDescription = "Watch video";
  let checkMeTodo = "Check me";
  let unCheckMeTodo = "Uncheck me";

  let taskCounter = 0;
  let toDoCounter = 0;
  const taskDescription = "(karma was here hehehe)";

  before(function () {
    // create a fabricated user from a fixture
    cy.fixture("user.json").then((user) => {
      cy.request({
        method: "POST",
        url: "http://localhost:5000/users/create",
        form: true,
        body: user,
      }).then((response) => {
        uid = response.body._id.$oid;
        name = user.firstName + " " + user.lastName;
        email = user.email;

        return cy
          .request({
            method: "POST",
            url: "http://localhost:5000/tasks/create",
            form: true,
            body: {
              title: taskTitle,
              description: taskDescription,
              userid: uid,
              url: youtubeKey,
              todos: "Watch video again",
            },
          })
          .then((todoResponse) => {
            // Add a todo item to the task
            // Get the task ID from the response (first task in the returned list)
            const createdTasks = todoResponse.body;
            let taskId = null;
            if (Array.isArray(createdTasks) && createdTasks.length > 0) {
              // Try to get the _id from the first task
              taskId = createdTasks[0]._id?.$oid || createdTasks[0]._id;
            }
            // Use the same description as in the test assertions
            return cy
              .request({
                method: "POST",
                url: "http://localhost:5000/todos/create",
                form: true,
                body: {
                  taskid: taskId,
                  description: checkMeTodo, // This matches the test assertions
                },
              })
              .then(() => {
                // Create a checked todo
                return cy.request({
                  method: "POST",
                  url: "http://localhost:5000/todos/create",
                  form: true,
                  body: {
                    taskid: taskId,
                    description: unCheckMeTodo,
                    done: true,
                  },
                });
              });
          });
      });
    });
  });

  beforeEach(function () {
    // enter the main main page
    cy.visit("http://localhost:3000");
    cy.contains("div", "Email Address").find("input[type=text]").type(email);
    // alternative, imperative way of detecting that input field
    //cy.get('.inputwrapper #email')
    //    .type(email)
    // submit the form on this page
    cy.get("form").submit();
    // assert that the user is now logged in
    cy.get("h1").should("contain.text", "Your tasks, " + name);
    cy.get(`img[src*="${youtubeKey}"]`).click(); //Open detail view
  });

  it("Mark an undone task as done", () => {
    cy.get(".container-element").then(($items) => {
      taskCounter = $items.length;

      cy.contains(" ul.todo-list li.todo-item", checkMeTodo).within(() => {
        cy.get(".checker").click();
        cy.get(".checker").should("have.class", "checked");
        cy.get(".editable") // or the selector for the todo text
          .should("have.css", "text-decoration-line", "line-through");
      });
    });
  });

  it("Mark a done task as undone", () => {
    cy.get(".container-element").then(($items) => {
      taskCounter = $items.length;

      cy.contains(" ul.todo-list li.todo-item", unCheckMeTodo).within(() => {
        cy.get(".checker").should("have.class", "checked");
        cy.get(".checker").click();
        cy.get(".checker").should("have.class", "unchecked");
        cy.get(".editable") // or the selector for the todo text
          .should("not.have.css", "text-decoration-line", "line-through");
      });
    });
  });

  after(function () {
    // clean up by deleting the user from the database
    cy.request({
      method: "DELETE",
      url: `http://localhost:5000/users/${uid}`,
    }).then((response) => {
      cy.log(response.body);
    });
  });
});
