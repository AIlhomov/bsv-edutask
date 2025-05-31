describe("Loggin, create task, ValidToDO", () => {
  // define variables that we need on multiple occasions
  let uid; // user idsadlkasndlnad
  let name; // name of the user (firstName + ' ' + lastName)
  let email; // email of the usersjadnsandsad

  const taskTitle = "Test Task Title";
  const youtubeKey = "yk3prd8GER4"; // Use a valid video ID
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
            todos: "Watch video again", // send as string, not array
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
  });

  it("create todo with Valid describtion", () => {
    // assert that the user is now logged in
    cy.get("h1").should("contain.text", "Your tasks, " + name);

    // Verify that the task appears in the UI
    cy.contains(taskTitle).should("exist");

    // Verify that the thumbnail is rendered
    cy.get(`img[src*="${youtubeKey}"]`).should("exist");

    cy.get(`img[src*="${youtubeKey}"]`).click(); //Open detail view
    cy.get("li.todo-item").then(($items) => {
      let todoCount = $items.length;
      cy.get("li.todo-item").should("have.length", todoCount); // Ensure only one todo is present

      cy.get(".inline-form").find("input[type=text]").type("Test Todo");
      cy.get(".inline-form").find("input[type=submit]").click();

      cy.get("ul.todo-list").contains("Test Todo").should("exist");
      cy.wait(500); // wait for the todo to appear before asserting

      cy.get("li.todo-item").should("have.length", todoCount + 1); // make sure it increase by one and only one
    });
  });

  it("create todo with empty describtion", () => {
    // Verify that the task appears in the UI
    cy.contains(taskTitle).should("exist");

    // Verify that the thumbnail is rendered
    cy.get(`img[src*="${youtubeKey}"]`).should("exist");

    cy.get(`img[src*="${youtubeKey}"]`).click(); //Open detail view

    cy.get("li.todo-item").then(($items) => {
      let todoCount = $items.length;
      cy.get("li.todo-item").should("have.length", todoCount);

      cy.get(".inline-form").find("input[type=submit]").click({ force: true });
      cy.wait(500); // wait for the todo to appear before asserting
      cy.get("li.todo-item").should("have.length", todoCount); //make sure it has not increased
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
