
// ===============================
// DADOS
// ===============================

let alugueis =
    JSON.parse(localStorage.getItem("alugueis")) || [];

let acaoConfirmada = null;

let indiceEditando = null;


// ===============================
// SALVAR DADOS
// ===============================

function salvarDados(){

    localStorage.setItem(
        "alugueis",
        JSON.stringify(alugueis)
    );

}


// ===============================
// MODAL DE CONFIRMAÇÃO
// ===============================

function abrirModal(
    titulo,
    texto,
    callback
){

    document.getElementById(
        "modalTitulo"
    ).textContent = titulo;

    document.getElementById(
        "modalTexto"
    ).textContent = texto;

    document.getElementById(
        "modal"
    ).style.display = "flex";

    acaoConfirmada = callback;

}


function fecharModal(){

    document.getElementById(
        "modal"
    ).style.display = "none";

}


document
    .getElementById("btnConfirmar")
    .addEventListener("click", () => {

        if(acaoConfirmada){

            acaoConfirmada();

        }

        fecharModal();

    });


// ===============================
// NOVO ALUGUEL
// ===============================

function adicionarAluguel(){

    const cliente =
        document.getElementById(
            "cliente"
        ).value.trim();


    const equipamento =
        document.getElementById(
            "equipamento"
        ).value;


    const valor =
        Number(
            document.getElementById(
                "valor"
            ).value
        );


    const pagamento =
        document.getElementById(
            "pagamento"
        ).value;


    const tempo =
        Number(
            document.getElementById(
                "tempo"
            ).value
        );


    const observacao =
        document.getElementById(
            "observacao"
        ).value.trim();


    if(
        !cliente ||
        !valor ||
        !tempo
    ){

        alert(
            "Preencha todos os campos obrigatórios."
        );

        return;

    }


    const agora = Date.now();


    alugueis.push({

        cliente: cliente,

        equipamento: equipamento,

        valor: valor,

        pagamento: pagamento,

        observacao: observacao,

        inicio: agora,

        fim:
            agora +
            (tempo * 60000)

    });


    salvarDados();


    document.getElementById(
        "cliente"
    ).value = "";


    document.getElementById(
        "valor"
    ).value = "";


    document.getElementById(
        "tempo"
    ).value = "";


    document.getElementById(
        "observacao"
    ).value = "";


    atualizarTela();

}


// ===============================
// EDITAR ALUGUEL
// ===============================

function editarAluguel(indice){

    indiceEditando = indice;


    const item =
        alugueis[indice];


    document.getElementById(
        "editarCliente"
    ).value =
        item.cliente;


    document.getElementById(
        "editarEquipamento"
    ).value =
        item.equipamento;


    document.getElementById(
        "editarValor"
    ).value =
        item.valor;


    document.getElementById(
        "editarPagamento"
    ).value =
        item.pagamento;


    document.getElementById(
        "editarObservacao"
    ).value =
        item.observacao || "";


    document.getElementById(
        "modalEdicao"
    ).style.display =
        "flex";

}


// ===============================
// SALVAR EDIÇÃO
// ===============================

function salvarEdicao(){

    if(indiceEditando === null){
        return;
    }


    const cliente =
        document.getElementById(
            "editarCliente"
        ).value.trim();


    const equipamento =
        document.getElementById(
            "editarEquipamento"
        ).value;


    const valor =
        Number(
            document.getElementById(
                "editarValor"
            ).value
        );


    const pagamento =
        document.getElementById(
            "editarPagamento"
        ).value;


    const observacao =
        document.getElementById(
            "editarObservacao"
        ).value.trim();


    if(
        !cliente ||
        !valor
    ){

        alert(
            "Preencha os campos obrigatórios."
        );

        return;

    }


    const item =
        alugueis[indiceEditando];


    // ==================================
    // ALTERA SOMENTE OS DADOS
    // ==================================

    item.cliente =
        cliente;

    item.equipamento =
        equipamento;

    item.valor =
        valor;

    item.pagamento =
        pagamento;

    item.observacao =
        observacao;


    // ==================================
    // NÃO ALTERAR:
    //
    // item.inicio
    // item.fim
    //
    // O CRONÔMETRO CONTINUA NORMAL
    // ==================================


    salvarDados();


    fecharEdicao();


    atualizarTela();

}


// ===============================
// FECHAR EDIÇÃO
// ===============================

function fecharEdicao(){

    document.getElementById(
        "modalEdicao"
    ).style.display =
        "none";


    indiceEditando = null;

}


// ===============================
// FINALIZAR ALUGUEL
// ===============================

function finalizarAluguel(indice){

    abrirModal(

        "Finalizar Aluguel",

        "Deseja finalizar este aluguel?",

        () => {

            alugueis.splice(
                indice,
                1
            );


            salvarDados();


            atualizarTela();

        }

    );

}


// ===============================
// MOSTRAR OBSERVAÇÃO
// ===============================

function mostrarObservacao(indice){

    const item =
        alugueis[indice];


    const observacao =
        item.observacao ||
        "Nenhuma observação cadastrada.";


    abrirModal(

        "📝 Observação",

        observacao,

        () => {}

    );

}


// ===============================
// FECHAR CAIXA
// ===============================

function fecharCaixa(){

    let total = 0;

    let pix = 0;

    let dinheiro = 0;

    let cartao = 0;


    alugueis.forEach(item => {

        total += item.valor;


        if(
            item.pagamento === "Pix"
        ){

            pix += item.valor;

        }


        if(
            item.pagamento === "Dinheiro"
        ){

            dinheiro += item.valor;

        }


        if(
            item.pagamento === "Cartão"
        ){

            cartao += item.valor;

        }

    });


    abrirModal(

        "Fechar Caixa",

        `PIX: R$ ${pix.toFixed(2)}

DINHEIRO: R$ ${dinheiro.toFixed(2)}

CARTÃO: R$ ${cartao.toFixed(2)}

TOTAL: R$ ${total.toFixed(2)}

Deseja realmente fechar o caixa?`,

        () => {

            alugueis = [];


            localStorage.removeItem(
                "alugueis"
            );


            atualizarTela();

        }

    );

}


// ===============================
// ATUALIZAR TELA
// ===============================

function atualizarTela(){

    let total = 0;

    let pix = 0;

    let dinheiro = 0;

    let cartao = 0;


    const lista =
        document.getElementById(
            "listaAlugueis"
        );


    lista.innerHTML = "";


    alugueis.forEach(

        (item, indice) => {

            total += item.valor;


            if(
                item.pagamento === "Pix"
            ){

                pix += item.valor;

            }


            if(
                item.pagamento === "Dinheiro"
            ){

                dinheiro += item.valor;

            }


            if(
                item.pagamento === "Cartão"
            ){

                cartao += item.valor;

            }


            let restante =
                Math.floor(

                    (
                        item.fim -
                        Date.now()
                    ) / 1000

                );


            let statusTexto =
                "Em uso";


            let statusClasse =
                "status-ok";


            if(restante <= 0){

                restante = 0;

                statusTexto =
                    "TEMPO ESGOTADO";

                statusClasse =
                    "status-alerta";

            }


            const minutos =
                Math.floor(
                    restante / 60
                );


            const segundos =
                restante % 60;


            lista.innerHTML += `

                <div class="aluguel">

                    <h3>
                        ${item.cliente}
                    </h3>


                    <p>
                        Equipamento:
                        ${item.equipamento}
                    </p>


                    <p>
                        Valor:
                        R$ ${item.valor.toFixed(2)}
                    </p>


                    <p>
                        Pagamento:
                        ${item.pagamento}
                    </p>


                    <p>
                        Tempo:
                        ${minutos}m
                        ${segundos}s
                    </p>


                    <p class="${statusClasse}">
                        ${statusTexto}
                    </p>


                    ${
                        item.observacao
                        ?
                        `
                        <div class="observacao">
                            📝 <strong>Observação:</strong>
                            ${item.observacao}
                        </div>
                        `
                        :
                        ""
                    }


                    <div class="botoes-aluguel">

                        <button
                            class="btn-editar"
                            onclick="editarAluguel(${indice})"
                        >
                            ✏️ Editar
                        </button>


                        <button
                            class="btn-observacao"
                            onclick="mostrarObservacao(${indice})"
                        >
                            📝 Observação
                        </button>


                        <button
                            class="btn-finalizar"
                            onclick="finalizarAluguel(${indice})"
                        >
                            ✓ Finalizar
                        </button>

                    </div>

                </div>

            `;

        }

    );


    document.getElementById(
        "total"
    ).textContent =
        total.toFixed(2);


    document.getElementById(
        "pix"
    ).textContent =
        pix.toFixed(2);


    document.getElementById(
        "dinheiro"
    ).textContent =
        dinheiro.toFixed(2);


    document.getElementById(
        "cartao"
    ).textContent =
        cartao.toFixed(2);

}


// ===============================
// RELÓGIO AUTOMÁTICO
// ===============================

setInterval(

    () => {

        atualizarTela();

    },

    1000

);


// ===============================
// INICIAR
// ===============================

atualizarTela();
