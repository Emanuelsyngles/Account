//modulos externos
import inquirer from 'inquirer'
import chalk from 'chalk'

//modulos internos
import fs from 'fs';

operation()

function operation() {

    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: ['Criar conta', 'Consultar Saldo', 'Depositar', 'Sacar', 'Sair'],
    },
    ])
        .then((answer) => {

            const action = answer['action']

            if (action === 'Criar conta') {
                createAccount()
            } else if (action === 'Depositar') {
                deposit()
            } else if (action === 'Consultar Saldo') {

            } else if (action === 'Sacar') {

            }
            else if (action === 'Sair') {
                console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
                process.exit()
            }
        })
        .catch((err) => console.log(err))

}

// create an account
function createAccount() {
    console.log(chalk.bgGreen.black('Obrigado por escolher o nosso banco!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir'))

    buildAccount()

}

function buildAccount() {

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para a sua conta:'
        },
    ])
        .then(answer => {
            const accountName = answer['accountName']

            console.info(answer['accountName'])

            if (!fs.existsSync('accounts')) {
                fs.mkdirSync('accounts')
            }

            if (fs.existsSync(`accounts/${accountName}.json`)) {
                console.log(chalk.bgRed.black('Foi constatado em nosso sistema que essa conta já existe, esolha outro nome para sua conta :)'))
                buildAccount()
                return
            }

            fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function (err) {

            },
            )

            console.log(chalk.green('Parabéns, sua conta foi criada em nosso banco com sucesso!'))
            operation()

        })
        .catch((err) => console.log(err))
}

// add an amount to user account
function deposit() {

    inquirer.prompt([
        {
            name: 'actionName',
            message: 'Qual o nome da sua conta?'
        }
    ])
    .then((answer) => {

        const accountName = answer['accountName']

        // verify if account exists
        if()

    })
    .catch(err => console.log(err))

}