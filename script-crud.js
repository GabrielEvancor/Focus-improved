// encontrar o botao adicionar tarefa
const btnAdicionartarefa = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textArea = document.querySelector('.app__form-textarea');
let listaTarefas = JSON.parse(localStorage.getItem('tarefas')) || []; //Lista que guarda todas as tarefas que estamos criando
const ulListaTarefas = document.querySelector('.app__section-task-list')
const paragrafoDescricaotarefa = document.querySelector('.app__section-active-task-description')
const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRemoverTodas = document.querySelector('#btn-remover-todas');
let tarefaSelecionada = null;
let liTarefaSelecionada = null;


function atualizarTarefas () {
    localStorage.setItem('tarefas', JSON.stringify(listaTarefas));
}

function criarElementotarefa(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg =  document.createElement('svg');
    svg.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
        <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
    </svg>
    `
    const paragrafo = document.createElement('p');
    paragrafo.textContent = tarefa.descricao;
    paragrafo.classList.add('app__section-task-list-item-description')

    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');

    botao.onclick = () => {
        const novaDescricao = prompt("Qual é o novo nome da tarefa?");
        //console.log('Nova descriçao da tarefa: ', novaDescricao)
        if (novaDescricao){
            paragrafo.textContent = novaDescricao;
            tarefa.descricao = novaDescricao;
            atualizarTarefas();
        }
    }

    const imagemBotao = document.createElement('img');
    imagemBotao.setAttribute('src', 'imagens/edit.png');

    botao.append(imagemBotao);
    li.append(svg);
    li.append(paragrafo);
    li.append(botao);
    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete')
        botao.setAttribute('disabled', 'disabled')    
    }
    else {
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(elemento => {
                    elemento.classList.remove('app__section-task-list-item-active')
                })
    
            if (tarefaSelecionada == tarefa) {
                paragrafoDescricaotarefa.textContent = ''
                tarefaSelecionada = null;
                liTarefaSelecionada = null;
                return
            }
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li
            paragrafoDescricaotarefa.textContent = tarefa.descricao
            li.classList.add('app__section-task-list-item-active')
        }
        return li;
    }
}

btnAdicionartarefa.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden');
})

formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault(); // Faz com que o navegador nao de refresh sempre que for adicionado uma tarefa
    //criando o objeto que possui oq esta sendo escrito em tarefa
    const tarefa = {
        descricao: textArea.value
    }
    /*Adicionando a tarefa dentro da lista de tarefas 
    Local Storage serve para guardar informacoes que nao podem ser
    perdidas a cada refresh dado no navegador. Estamos guardando num local
    chamado 'tarefas' lista de tarefas que criamos

    Utilizamos a API JSON para fazermos a conversao do objeto tarefa
    em uma string para ficar armazenada no nosso Local Storage, pois ela
    so trabalha com Strings
    */
    listaTarefas.push(tarefa);
    const elementoTarefa = criarElementotarefa(tarefa);
    ulListaTarefas.append(elementoTarefa);
    atualizarTarefas();
    textArea.value = ''
    formAdicionarTarefa.classList.add('hidden')

})

listaTarefas.forEach(tarefa => {
    const elementoTarefa = criarElementotarefa(tarefa);
    ulListaTarefas.append(elementoTarefa);
});

document.addEventListener('FocoFinalizado', () => {
    if (tarefaSelecionada && liTarefaSelecionada){
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active')
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled')
        tarefaSelecionada.completa = true
        atualizarTarefas()
    }
})
const removerTarefas = (somenteCompletas) => {
    const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item" //if interno 
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove()
    })
    listaTarefas = somenteCompletas ? listaTarefas.filter(elemento => !elemento.completa) : []
    atualizarTarefas()
}

btnRemoverConcluidas.onclick = () =>  removerTerefas(true)
btnRemoverTodas.onclick = () => removerTarefas(false)
