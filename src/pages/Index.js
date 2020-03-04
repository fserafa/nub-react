import React, { useState, useEffect } from 'react';
import { Container, Button } from '@material-ui/core';
import Axios from 'axios';

export default function Index(props) {
    const [file, setFile] = useState('');
    const [faturas, setFaturas] = useState([]);
    const [reload, setReload] = useState(false);


    useEffect(() => {
        async function getFaturas() {
            const response = await Axios.get('http://localhost:3333/faturas');

            response && setFaturas(response.data)
        }

        getFaturas();

    }, [reload])


    function handleChange(e) {
        setFile(e.target.files[0])
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const data = new FormData();
        data.append('file', file)

        const response = await Axios({
            method: 'POST',
            url: 'http://localhost:3333/extrair',
            data,
            headers: {
                'Content-type': 'application/json; charset=utf-8',
                'Accept': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            },
        });

        console.log(response.data)

        setFaturas(faturas => ([...faturas, response.data]));
    }

    async function handleDelete(id) {
        await Axios.delete(`http://localhost:3333/fatura/${id}`);
        setReload(reload => !reload)
    }

    return (
        <Container>
            <h1>Index</h1>
            <form onSubmit={handleSubmit}>
                <input name="File" type="file" onChange={e => handleChange(e)} />
                <Button type="submit">Upload</Button>
            </form>

            {faturas.map(f => (
                <div key={f._id}>
                    <Button onClick={() => props.history.push('/fatura', { id: f._id })}>{f.date}</Button>
                    <Button onClick={() => handleDelete(f._id)}>Delete</Button>
                </div>
            ))}


        </Container>
    );
}
