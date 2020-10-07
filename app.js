const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util= require("util")
const writeFileAsync=util.promisify(fs.writeFile)
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
let members=[]
async function init(){
    try{
        let size= await teamsize();
        let team = size.teamsize;
        if (team === 0){
            return;
        }else for (i= 0; i < team; i++){
            let employee = await createemployee();
            let name = employee.name;
            let id = employee.id;
            let email = employee.email;
            let title = employee.title
            switch (title){
                case "Manager":
                    let z = await createManager();
                    let number = z.number;
                    let manager= new Manager (name,id,email,number);
                    members.push(manager);
                    break;
                case "Intern":
                    let y = await createIntern();
                    let school = y.school;
                    let intern= new Intern (name,id,email,school);
                    members.push(intern);
                    break;
                case "Engineer":
                    let x = await createEngineer();
                    let github = x.github
                    let engineer = new Engineer(name,id,email,github);
                    members.push(engineer);
                    break;

            }
        }
        await generatehtml(members)
    }catch(err){
        console.log(err)
    }

};

function teamsize(){
    return inquirer.prompt({
        type:"number",
        message:"Number of team members:",
        name: "teamsize"
    })
}
function generatehtml(){
    return writeFileAsync("./index.html", render(members))
}
function createemployee(){
    const questions = [{
        type: "input",
        message: "Employee Name:",
        name: "name"
    },
    {
        type: "input",
        message: "Employee ID:",
        name: "id"
    },
    {
        type: "input",
        message: "Employee Email:",
        name: "email"
    },
    {
        type: "list",
        message: "Employee Title:",
        name: "title",
        choices: ["Engineer", "Intern", "Manager"]
    }]
    return inquirer.prompt(questions)
}


function createEngineer(){
    return inquirer.prompt({
        type:"input",
        message:"Engineer Github:",
        name:"github",
    })
}
function createIntern(){
    return inquirer.prompt({
        type:"input",
        message:"Intern's School:",
        name:"school"
    })
}

function createManager(){
    return inquirer.prompt({
        type:"input",
        message:"Manager's Office Number:",
        name:"number",
    })

}
init();

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
