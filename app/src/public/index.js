document.addEventListener("DOMContentLoaded", () => {
    const socket = io("http://localhost:1337");

    const questionInputElement = document.querySelector('main > div:has(input#new_question)');

    const yesElement = document.querySelector(`input[type='submit'][value='OUI']`);
    const noElement  = document.querySelector(`input[type='submit'][value='NON']`);

    const nodePath = [];
    let currentQuestion = {
        id: null
    }

    updateQuestionMessage(`Prêt`);

    // Send a message to the server
    socket.emit("messageFromClient", "Hello, server!");

    // Affichage d'une question
    socket.on("question", ({ id, question }) => {
        currentQuestion = {
            id, question
        };

        updateQuestionMessage(question);
        nodePath.push(currentQuestion);
        updateQuestionPath(nodePath);
    });

    // Soumettre un nouveau noeud
    socket.on("newQuestionPossibility", () => {
        questionInputElement.classList.add('display');
    });

    questionInputElement.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            socket.emit('newQuestionValue', questionInputElement.textContent);
            questionInputElement.textContent = '';
            question
        }
    });

    yesElement.onclick = () => sendChoice({ socket, choice: true, questionId: currentQuestion.id });
    noElement.onclick = () => sendChoice({ socket, choice: false, questionId: currentQuestion.id });
});

function updateQuestionMessage(question){
    document.querySelector('#question').innerHTML = `${question} ?`;
}

function sendChoice({socket, choice, questionId}){
    socket.emit(`choice`, {
        choice,
        questionId
    });
}

function updateQuestionPath(history){
    document.querySelector('#nodes').innerHTML = history.reduce( (acc, { id, question }) => {
        return `${id} > ${question}<br />${acc}`;
    }, ``);
}