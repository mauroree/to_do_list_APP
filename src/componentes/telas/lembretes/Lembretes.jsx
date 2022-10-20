import { useState, useEffect } from "react";
import LembretesContext from "./LembretesContext";
import Tabela from "./Tabela";
import Form from "./Form";

function Lembretes() {

    const [alerta, setAlerta] = useState({ "status": "", "message": "" });
    const [listaObjetos, setListaObjetos] = useState([]);
    const [editar, setEditar] = useState(false);
    const [objeto, setObjeto] = useState({
        codigo: "", nome: "", assunto: "",
        descricao: ""
    });

    const recuperar = async codigo => {
        await fetch(`${process.env.REACT_APP_ENDERECO_API}/lembretes/${codigo}`)
            .then(response => response.json())
            .then(data => setObjeto(data))
            .catch(err => setAlerta({ "status": "error", "message": err }))
    }

    const acaoCadastrar = async e => {
        e.preventDefault();
        const metodo = editar ? "PUT" : "POST";
        try {
            await fetch(`${process.env.REACT_APP_ENDERECO_API}/lembretes`,
                {
                    method: metodo,
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(objeto)
                }).then(response => response.json())
                .then(json => {
                    setAlerta({ status: json.status, message: json.message });
                    setObjeto(json.objeto);
                    if (!editar) {
                        setEditar(true);
                    }
                })
        } catch (err) {
            setAlerta({ "status": "error", "message": err })
        }
        recuperaLembretes();
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setObjeto({ ...objeto, [name]: value });
    }

    const recuperaLembretes = async () => {
        await fetch(`${process.env.REACT_APP_ENDERECO_API}/lembretes`)
            .then(response => response.json())
            .then(data => setListaObjetos(data))
            .catch(err => setAlerta({ "status": "error", "message": err }))
    }

    const remover = async objeto => {
        if (window.confirm('Deseja remover este Lembrete?')) {
            try {
                await
                    fetch(`${process.env.REACT_APP_ENDERECO_API}/lembretes/${objeto.codigo}`,
                        { method: "DELETE" })
                        .then(response => response.json())
                        .then(json => setAlerta({
                            "status": json.status,
                            "message": json.message
                        }))
                recuperaLembretes();
            } catch (err) {
                setAlerta({ "status": "error", "message": err })
            }
        }
    }

    useEffect(() => {
        recuperaLembretes();
    }, []);

    return (
        <LembretesContext.Provider value={
            {
                alerta, setAlerta,
                listaObjetos, setListaObjetos,
                recuperaLembretes, remover,
                objeto, setObjeto,
                editar, setEditar,
                recuperar,
                acaoCadastrar, handleChange
            }
        }>
            <Tabela />
            <Form />

        </LembretesContext.Provider>
    )

}

export default Lembretes;