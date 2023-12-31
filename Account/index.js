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
        choices: ['Criar conta', 'Consultar Saldo', 'Depositar', 'Sacar', 'Remover Conta', 'Sair',]
    },
    ])
        .then((answer) => {

            const action = answer['action']

            if (action === 'Criar conta') {
                createAccount()
            } else if (action === 'Depositar') {
                deposit()
            } else if (action === 'Consultar Saldo') {
                getAccountBalance()
            } else if (action === 'Sacar') {
                widthdraw()
            } else if (action === 'Remover Conta') {
                offaccount()
            } else if (action === 'Sair') {
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
                console.log(err)
            },
            )

            console.log(chalk.green('Parabéns, sua conta foi criada em nosso banco com sucesso!'))
            operation()

        })
        .catch((err) => console.log(err))
}

// add an amount to user account
function deposit() {
    inquirer
        .prompt([
            {
                name: 'accountName',
                message: 'Qual o nome da sua conta?',
            },
        ])
        .then((answer) => {
            const accountName = answer['accountName']

            if (!checkAccount(accountName)) {
                return deposit()
            }

            inquirer
                .prompt([
                    {
                        name: 'amount',
                        message: 'Quanto você deseja depositar?',
                    },
                ])
                .then((answer) => {
                    const amount = answer['amount']

                    addAmount(accountName, amount)
                    operation()
                })
        })
}

function checkAccount(accountName) {
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe, escolha uma conta existente!'))
        return false
    }

    return true
}

function addAmount(accountName, amount) {

    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        },
    )
    console.log(chalk.bgBlack.green(`Foi depositado um valor de R$${amount} na sua conta!`))
}

function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r'
    })

    return JSON.parse(accountJSON)
}

// show account balance

function getAccountBalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        },
    ])
        .then((answer) => {
            const accountName = answer['accountName']

            if (!checkAccount(accountName)) {
                return getAccountBalance
            }

            const accountData = getAccount(accountName)

            console.log(chalk.bgBlue.black`Olá, o saldo da sua conta é de R$${accountData.balance}`,
            ),
                operation()
        })
}

//widthdraw an amout from user account

function widthdraw() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da conta que você deseja sacar um valor?'
        },
    ])
        .then((answer) => {

            const accountName = answer['accountName']

            if (!checkAccount(accountName)) {

                return widthdraw()

            }

            inquirer.prompt([
                {
                    name: 'amount',
                    message: 'Quanto você deseja sacar? R$'
                }
            ])
                .then((answer) => {

                    const amount = answer['amount']

                    removeAmount(accountName, amount)
                    widthdraw()

                })
                .catch(err => console.log(err))

        })
        .catch(err => console.log(err))
}

function removeAmount(accountName, amount) {

    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return widthdraw()
    }

    if (accountData.balance < amount) {
        console.log(chalk.bgRed.black('O valor que você está tentando sacar é maior que o saldo existente, tente outro valor possivel!'))
        return widthdraw()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        },
    )

    console.log(chalk.green(`Foi realizado um saque de R$${amount} da sua conta!`))
    operation()
}

// Remove account

function offaccount() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da conta que você deseja desvincular ao account?'
        },
    ])
        .then((answer) => {
            const accountName = answer['accountName']
            inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'confirmation',
                    message: `Você tem certeza que deseja excluir a conta ${accountName}?`
                }
            ])
                .then((confirmAnswer) => {
                    if (confirmAnswer['confirmation']) {
                        removeAccount(accountName)
                    } else {
                        console.log(chalk.bgRed.black('Exclusão da conta cancelada!'))
                        operation()
                    }
                })
                .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
}

function removeAccount(accountName) {
    fs.unlink(`accounts/${accountName}.json`, (err) => {
        if (err) {
            console.log(chalk.bgRed.black('Erro ao excluir a conta, tente novamente masi tarde!'))
        } else {
            console.log(chalk.bgGreen.black(`A conta ${accountName} foi excluida com sucesso, até uma próxima!`))
        }
        operation()
    })
}



