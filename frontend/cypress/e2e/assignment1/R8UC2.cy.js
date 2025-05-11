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

      cy.get(`img[src*="${youtubeKey}"]`).click(); //Open detail view

      cy.get(".container-element").should("have.length", taskCounter + 1); // Ensure only one todo is present
    });
  });

  it("create todo with Valid describtion", () => {
    cy.get(".container-element").then(($items) => {
      taskCounter = $items.length;

      cy.get(`img[src*="${youtubeKey}"]`).click(); //Open detail view

      cy.get("li.todo-item").then(($items) => {
        //get the number of todos
        toDoCounter = $items.length;

        cy.get("li.todo-item").should("have.length", toDoCounter); // double check that we are in the right task

        cy.get(".inline-form")
          .find("input[type=text]")
          .type("Test Todo" + toDoCounter);
        cy.get(".inline-form").find("input[type=submit]").click();

        cy.get("ul.todo-list").contains("Test Todo").should("exist");
        cy.get("li.todo-item").should("have.length", toDoCounter + 1); // make sure it increased by
      });
    });
  });

  it("Main scenario: check the existing TODOOOO", () => {
    cy.get(".container-element").then(($items) => {
      taskCounter = $items.length;

      cy.get(`img[src*="${youtubeKey}"]`).click(); //Open detail view

      cy.contains(" ul.todo-list li.todo-item", todoDescription).within(() => {
        cy.get(".checker").click();
        cy.get(".checker").should("have.class", "checked");
      });
    });
  });

  it("Alt Scenario: UNcheck the existing TODOOOO", () => {
    cy.get(".container-element").then(($items) => {
      taskCounter = $items.length;

      cy.get(`img[src*="${youtubeKey}"]`).click(); //Open detail view

      cy.contains(" ul.todo-list li.todo-item", todoDescription).within(() => {
        cy.get(".checker").should("have.class", "checked");
        cy.get(".checker").click();
        cy.get(".checker").should("have.class", "unchecked");
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
