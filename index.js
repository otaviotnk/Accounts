//Módulos internos
const fs = require("fs")

//Módulos externos
const inquirer = require('inquirer')
const chalk = require('chalk')

console.log(chalk.blue("Iniciando o Projeto"))

operation()

function operation() {
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        messages: 'O que você deseja fazer?',
        choices: [
            'Criar conta',
            'Consultar saldo',
            'Depositar',
            'Sacar',
            'Sair'
        ]
    }]).then((answer) => {
        const action = answer['action']
        if (action == 'Criar conta') {
            createAccount()
        }
        else if (action == 'Consultar saldo') {
            getAccountBalance()
        }
        else if (action == 'Depositar') {
            deposit()
        }
        else if (action == 'Sacar') {
            //createAccount()
        }
        else if (action == 'Sair') {
            console.clear()
            console.log(chalk.bgBlue.black("Obrigado por usar nosso sistema!"))
            process.exit()
            //createAccount()
        }
    }).catch((err) => console.log(err))
}

//Criar conta
function createAccount() {
    console.clear()
    console.log(chalk.bgGreen.black("Parabéns por escolher nosso banco!"))
    console.log(chalk.green("Defina as opções da sua conta:"))
    buildAccount()
}
function buildAccount() {
    inquirer.prompt([
        {
            name: "accountName",
            message: "Informe o nome da conta"
        }
    ]).then((answer) => {
        const accountName = answer['accountName']
        console.info(accountName)

        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        if (fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.white("Conta já existente!"))
            buildAccount()
            return
        }


        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 10}', function (err) {
            console.log(err)
        })

        console.clear()
        console.log(chalk.bgGreen.black("Sucesso! Sua conta foi criada!"))

        returnToOperation()

    }).catch((err) => console.log(err))
}

function deposit() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer) => {
        const accountName = answer['accountName']

        if (!accountExists(accountName)) {
            return deposit()
        }
        inquirer.prompt([
            {
                name: 'amount',
                message: "Qual o valor do depósito?"
            }
        ]).then((answer) => {
            const amount = answer['amount']

            addAmount(accountName, amount)
            returnToOperation()


        }).catch((err) => console.log(err))


    }).catch((err) => console.log(err))
}

function accountExists(accountName) {
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.clear()
        console.log(chalk.bgRed.white("Conta incorreta! Informe o nome novamente"))
        return false
    }
    return true
}

function addAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgYellowBright.black("Ocorreu um erro! Tente novamente."))
        return deposit()
    }
    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(`accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        })

    console.clear()
    console.log(chalk.bgGreen.black(`Valor depositado: ${amount}. Total: ${accountData.balance}`))
}

function getAccount(accountName) {
    const accountJson = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: "utf8",
        flag: 'r'
    })

    return JSON.parse(accountJson)
}

function getAccountBalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: "Qual o nome da conta?"
        }
    ]).then((answer) => {
        const accountName = answer['accountName']

        if (!fs.existsSync(`accounts/${accountName}.json`)) {
            console.clear()
            console.log(chalk.bgRed.white("Conta incorreta! Informe o nome novamente"))
            return getAccountBalance()
        }

        const accountData = getAccount(accountName)

        console.log(chalk.bgBlue.black(`Olá, seu saldo é: ${accountData.balance}`))

        returnToOperation()


    }).catch((err) => console.log(err))
}

function withDraw() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer) => {
        const accountName = answer['accountName']

        if (!accountExists(accountName)) {
            console.log(chalk.bgYellowBright.black("Ocorreu um erro! Tente novamente."))
            return withDraw()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quando você deseja sacar?'
            }
        ]).then((answer) => {
            const amount = answer['amount']

            removeAmount(accountName, amount)

            returnToOperation()

        }).catch((err) => console.log(err))


        console.clear()
        console.log(chalk.bgGreen.black(`Valor depositado: ${amount}. Total: ${accountData.balance}`))
    }).catch((err) => console.log(err))
}

function removeAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgYellowBright.black("Ocorreu um erro! Tente novamente."))
        return withDraw()
    }

    if (accountData.balance < amount) {
        console.log(chalk.bgYellowBright.black("O valor de saque está acima do disponível na conta."))
        return withDraw()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(`accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        })

    console.clear()

    console.log(chalk.bgGreen.black(`Valor retirado: ${amount}. Total: ${accountData.balance}`))

}

function returnToOperation() {
    const timer = setInterval(() => {
        operation()
        clearInterval(timer);
    }, 2000);
}


