describe("login and check a todo in a task", () => {
  // define variables that we need on multiple occasions
  // define variables that we need on multiple occasions
  let uid; // user idsadlkasndlnad
  let name; // name of the user (firstName + ' ' + lastName)
  let email; // email of the usersjadnsandsad
  let taskTitle = "Test Task Title";
  let youtubeKey = "yk3prd8GER4"; // Use a valid video ID
  let todoDescription = "delete me";

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

        return cy.request({
          method: "POST",
          url: "http://localhost:5000/tasks/create",
          form: true,
          body: {
            title: taskTitle,
            description: taskDescription,
            userid: uid,
            url: youtubeKey,
            todos: todoDescription,
          },
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
  });

  it("Delete a todo item", () => {
    cy.get(".container-element").then(($items) => {
      taskCounter = $items.length;

      cy.get(`img[src*="${youtubeKey}"]`).click(); //Open detail view
      cy.get("li.todo-item").then(($items) => {
        //get the number of todos
        toDoCounter = $items.length;

        cy.contains(" ul.todo-list li.todo-item", todoDescription).within(
          () => {
            // CLICK 2 TIMES ON THE REMOVER BUTTON
            // this is a workaround for the fact that the first click does not remove the todo
            cy.get(".remover").click({ force: true });
            cy.get(".remover").click({ force: true });
          }
        );
        //cy.wait(500); // Wait for the UI to update
        cy.get("li.todo-item").should("have.length", toDoCounter - 1); // Ensure only one todo is present
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
