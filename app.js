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
