#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer'); 
import { Answers, Separator } from 'inquirer'
const commander = require('commander');
const program = new commander.Command();
import { App } from '@aws-cdk/core';
import { DynamoAlarms } from './dynamo-alarms';
import { execSync } from 'child_process';
import { alarmTypeToConstruct as dynamoAlarmTypes } from './alarmTypes/dynamodb/AlarmTypeToConstruct'
import { alarmTypeToConstruct as lambdaAlarmTypes } from './alarmTypes/lambda/AlarmTypeToConstruct'
import { LambdaAlarms } from './lambda-alarms';

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
    message: 'Just to confirm, we want Lambda alarms?',
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
      message: 'Enter your resource name: '
    },
    {
      type: 'confirm',
      name: 'again',
      message: 'Enter another resource? ',
    }
  ];

  const { again, ...answers } = await inquirer.prompt(prompts);

  const newInputs = inputs.concat(answers)
  return again ? collectInputs(newInputs) : newInputs;
};

const collectAlarmTypes = (baseTypes: Record<string, any>): Promise<Answers> => {
  let alarmTypes: any[] = Object.keys(baseTypes).map((key: string ) => ({ name: key }));

  alarmTypes.unshift(new Separator(' === The Alarm Options === '))
  alarmTypes.push({ name: 'More options to come...' })

  return inquirer.prompt([{
    type: 'checkbox',
    message: 'Select Alarms with space (then hit enter)',
    name: 'alarms',
    choices: alarmTypes
  }])
};

inquirer.prompt(questions).then((answers: any) => {
  console.log('Great! I\'ll be asking for some info now.\n')

  collectInputs().then(async (inputs: Answers[]) => {
    console.log(`\nWow! So many amazing tables you have. I count ${inputs.length} of them\n`)

    const baseTypes = answers.alarmType === 'DynamoDB' ? dynamoAlarmTypes : lambdaAlarmTypes
    const alarmTypes: Answers = await collectAlarmTypes(baseTypes)

    console.log('Amazing! You must really like alarms.\n\n')
    console.log('I\'m going to make a CFN template for you and open it up.\n\n')
      
    const app = new App({
        outdir: 'cdk.out'
    });

    answers.alarmType === 'DynamoDB' ? 
      new DynamoAlarms(
        app,
        'DynamoDBAlarms',
        inputs.map((input: Answers) => input.inputValue),
        alarmTypes.alarms
      ) :
      new LambdaAlarms(
        app,
        'LambdaAlarms',
        inputs.map((input: Answers) => input.inputValue),
        alarmTypes.alarms
      )

    app.synth()

    setTimeout(() => {
      clear();
      console.log(
        chalk.white(
          figlet.textSync('Goodbye', { horizontalLayout: 'full' })
        )
      );
      execSync(`code ./cdk.out/${answers.alarmType}Alarms.template.json`)
    }, 2000)
  })
    
});
