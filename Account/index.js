//modulos externos
import inquirer from 'inquirer'
import chalk from 'chalk'

//modulos internos
import fs from 'fs';

function operation() {

    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
            'Criar conta',
            
        ]
    }])

}
