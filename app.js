const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { type } = require("os");

const teamMembers = [];

function startApp() {
    console.log("Welcome!  Let's begin creating your team!");
    createTeamMember();
}

async function createTeamMember() {
    response = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "Please provide team member's name?"
        },

        {
          type: "input",
          name: "id",
          message: "Please provide team member's id number?"
        },

        {
          type: "input",
          name: "email",
          message: "Please provide the team member's email:"
        },

        {
          type: "list",
          name: "role",
          message: "What is the team member's role?",
          choices: [
            "Manager",
            "Engineer",
            "Intern"
          ]

        }
        

    ]);

    let roleQuestion = "";

    if (response.role === "Manager") {
        roleQuestion = await inquirer.prompt([
            {
                type: "input",
                name: "officeNumber",
                message: "What is the Manager's office number?"
            }

        ]);

        const manager = new Manager(response.name, response.id, response.email, roleQuestion.officeNumber);
        teamMembers.push(manager);
    }

    if (response.role === "Engineer") {
        roleQuestion = await inquirer.prompt([
            {
                type: "input",
                name: "github",
                message: "What is the engineer's Github username?",
            }


        ]);

        const engineer = new Engineer(response.name, response.id, response.email, roleQuestion.github);
        teamMembers.push(engineer);
    }

    if (response.role === "Intern") {
        roleQuestion = await inquirer.prompt([
            {
                type: "input",
                name: "school",
                message: "What school does the intern attend?",
            }


        ]);

        const intern = new Intern(response.name, response.id, response.email, roleQuestion.school);
        teamMembers.push(intern);
    }

    console.log(teamMembers);

    askToContinue = await inquirer.prompt([
        {   
            type: "list",
            name: "continue",
            message: "Would you like to add another team member?",
            choices: [
                "Yes",
                "No"
            ]
        }
    ]);

    if (askToContinue.continue === "Yes") {

        createTeamMember();

    } else {
        console.log("Here is your team:")
        console.log(teamMembers);

        const html = render(teamMembers);

        //Make sure directory exists.  Create if not.
        if (fs.existsSync(OUTPUT_DIR) === false) {
            fs.mkdirSync(OUTPUT_DIR);
        }

        await writeFileAsync(outputPath, html);

        
        console.log("Great!  Your team html is created!");



    }




}


startApp();



// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
