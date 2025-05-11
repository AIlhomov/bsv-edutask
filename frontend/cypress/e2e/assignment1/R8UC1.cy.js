describe("Loggin, create task, ValidToDO", () => {
  // define variables that we need on multiple occasions
  let uid; // user idsadlkasndlnad
  let name; // name of the user (firstName + ' ' + lastName)
  let email; // email of the usersjadnsandsad

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
  });

  it("create todo with Valid describtion", () => {
    // assert that the user is now logged in
    cy.get("h1").should("contain.text", "Your tasks, " + name);

    const taskTitle = "Test Task Title";
    const youtubeKey = "dQw4w9WgXcQ"; // Use a valid video ID

    cy.get(".inputwrapper #title").type(taskTitle);
    cy.get(".inputwrapper #url").type(youtubeKey);
    cy.get("form").submit();

    // Verify that the task appears in the UI
    cy.contains(taskTitle).should("exist");

    // Verify that the thumbnail is rendered
    cy.get(`img[src*="${youtubeKey}"]`).should("exist");

    cy.get(`img[src*="${youtubeKey}"]`).click(); //Open detail view
    cy.get("li.todo-item").should("have.length", 1); // Ensure only one todo is present

    cy.get(".inline-form").find("input[type=text]").type("Test Todo");
    cy.get(".inline-form").find("input[type=submit]").click();

    cy.get("ul.todo-list").contains("Test Todo").should("exist");
    cy.get("li.todo-item").should("have.length", 2); // Ensure only one todo is present
  });

  it("create todo with empty describtion", () => {
    const taskTitle = "sec Task Title2";
    const youtubeKey = "u8vMu7viCm8"; // Use a valid video ID

    cy.get(".inputwrapper #title").type(taskTitle);
    cy.get(".inputwrapper #url").type(youtubeKey);
    cy.get("form").submit();

    // Verify that the task appears in the UI
    cy.contains(taskTitle).should("exist");

    // Verify that the thumbnail is rendered
    cy.get(`img[src*="${youtubeKey}"]`).should("exist");

    cy.get(`img[src*="${youtubeKey}"]`).click(); //Open detail view

    cy.get(".inline-form").find("input[type=submit]").click();

    // cy.get(".todo-list").contains(emptyTodo).should("exist");
    cy.wait(1000); // Wait for the UI to updatekkk

    cy.get("li.todo-item").should("have.length", 1); // Ensure only one todo is present
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
