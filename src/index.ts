#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer'); 
import { Answers, Separator } from 'inquirer'
const commander = require('commander');
const program = new commander.Command();
import { App } from '@aws-cdk/core';
import { DynamoAlarms } from '../src/dynamo-alarms';
import { execSync } from 'child_process';

clear();
console.log(
  chalk.white(
    figlet.textSync('cdk-alarms-cli', { horizontalLayout: 'full' })
  )
);

program
  .version('0.0.1')
  .description("CLI to help you write your CFN alarms")
  .parse(process.argv);

console.log('Hey! Welcome to cdk-alarms-cli')
console.log('I\'ll be helping you create some basic common alarms\n')

const questions = [
  {
    type: 'input',
    name: 'userName',
    message: 'First of all, what\'s your name?',
    default: 'Cool Name'
  },
  {
    type: 'list',
    name: 'alarmType',
    message: 'Wow! What a cool name. \nWhat kind of alarms are we making today?',
    choices: [
      'DynamoDB',
      'Lambda',
      'Other (in the future)'
    ]
  },
  {
    type: 'confirm',
    name: 'ddbconfirm',
    message: 'Just to confirm, we want DynamoDB alarms?',
    when: (answers: any) => {
      return answers.alarmType === 'DynamoDB'
    }
  },
  {
    type: 'confirm',
    name: 'lambdaconfirm',
    message: 'Lambda is not supported yet.. sorry',
    when: (answers: any) => {
      return answers.alarmType === 'Lambda'
    }
  }
]

const collectInputs = async (inputs: Answers[] = []): Promise<Answers[]> => {
  const prompts = [
    {
      type: 'input',
      name: 'inputValue',
      message: 'Enter your table name: '
    },
    {
      type: 'confirm',
      name: 'again',
      message: 'Enter another table? ',
    }
  ];

  const { again, ...answers } = await inquirer.prompt(prompts);

  const newInputs = inputs.concat(answers)
  return again ? collectInputs(newInputs) : newInputs;
};

const collectAlarmTypes = (): Promise<Answers> => {
  const choices = [
    new Separator(' === The Alarm Options === '),
    {
      name: 'ReadThrottlingAlarm'
    },
    {
      name: 'More to Come! (don\'t select)'
    }
  ]

  return inquirer.prompt([{
    type: 'checkbox',
    message: 'Select Alarms (then hit enter)',
    name: 'alarms',
    choices: choices
  }])
};

inquirer.prompt(questions).then(() => {
  console.log('Great! I\'ll be asking for some info now.\n')

  collectInputs().then(async (inputs: Answers[]) => {
    console.log(`\nWow! So many amazing tables you have. I count ${inputs.length} of them\n`)

    const alarmTypes: Answers = await collectAlarmTypes()

    console.log('Amazing! You must really like alarms.\n\n')
    console.log('I\'m going to make a CFN template for you and open it up.\n\n')
      
    const app = new App({
        outdir: 'cdk.out'
    });
    new DynamoAlarms(
      app,
      'DynamoAlarms',
      inputs.map((input: Answers) => input.inputValue),
      alarmTypes.alarms
    );
    app.synth()

    setTimeout(() => {
      clear();
      console.log(
        chalk.white(
          figlet.textSync('Goodbye', { horizontalLayout: 'full' })
        )
      );
      execSync(`code ./cdk.out/DynamoAlarms.template.json`)
    }, 2000)
  })
    
});
