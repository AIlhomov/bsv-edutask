describe("login and check a todo in a task", () => {
  // define variables that we need on multiple occasions
  let uid; // user idsadlkasndlnad
  let name; // name of the user (firstName + ' ' + lastName)
  let email; // email of the usersjadnsandsad
  let taskTitle = "Test Task Title";
  let youtubeKey = "dQw4w9WgXcQ"; // Use a valid video ID
  let todoDescription = "Watch video";

  let taskCounter = 0;
  let toDoCounter = 0;
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

  it("create the task", () => {
    cy.get(".container-element").then(($items) => {
      taskCounter = $items.length;

      cy.get(".inputwrapper #title").type(taskTitle + taskCounter);
      cy.get(".inputwrapper #url").type(youtubeKey);
      cy.get("form").submit();

      cy.contains(taskTitle).should("exist");

      cy.get(`img[src*="${youtubeKey}"]`).should("exist");

      cy.get(`img[src*="${youtubeKey}"]`)
        .eq(taskCounter - 1) //index of the last task
        .click(); //Open detail view

      cy.get(".container-element").should("have.length", taskCounter + 1); // Ensure only one todo is present
    });
  });

  it("Delete a todo item", () => {
    cy.get(".container-element").then(($items) => {
      taskCounter = $items.length;

      cy.get(`img[src*="${youtubeKey}"]`)
        .eq(taskCounter - 1)
        .click(); //Open detail view
      cy.get("li.todo-item").then(($items) => {
        //get the number of todos
        toDoCounter = $items.length;

        cy.contains(" ul.todo-list li.todo-item", todoDescription).within(
          () => {
            cy.get(".remover").click();
          }
        );
        cy.wait(1000); // Wait for the UI to update
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
