import React, { useState } from 'react';
import { Container, Button } from '@material-ui/core';
import Axios from 'axios';

export default function Index() {
    const [file, setFile] = useState('');
    const [texts, setTexts] = useState([]);

    async function handleClick() {
        const response = await Axios.get('http://localhost:3000/');

        console.log(response)
    }

    function handleChange(e) {
        setFile(e.target.files[0])
        console.log()
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const data = new FormData();
        console.log(file)
        data.append('file', file)
        console.log(data)
        const response = await Axios.post('http://localhost:3000/', data);

        setTexts(response.data);
    }

    return (
        <Container>
            <h1>Index</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={e => setFile(e.target.files[0])} />
                <Button type="submit">Upload</Button>
            </form>
            {texts.map((text, index) => <p key={index.toString()}>{text}</p>)}
        </Container>
    );
}
