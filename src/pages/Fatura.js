import React, { useEffect, useState, useRef } from 'react';
import Axios from 'axios';
import { Layout, Menu, Table, Button, Select, Row, Col, Card, Badge } from 'antd';
import { Skeleton } from 'antd';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const { Option } = Select;
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default function Fatura(props) {
    const [fatura, setFatura] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const id = props.location.state.id;

            const { data } = await Axios.get(`http://localhost:3333/fatura/${id}`);

            setFatura(data.texts);
            setLoading(false);
        })();
    }, [])

    const columns = [
        {
            title: 'Data',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            key: 'value',
        },
        {
            title: 'De',
            dataIndex: 'de',
            key: 'de',
            render: (text, record, index) => (
                <>
                    <Select defaultValue="" value={record.de} style={{ width: 120 }} allowClear onChange={(value) => handleSelectChange(record, index, value)}>
                        <Option value="mae">Mãe</Option>
                        <Option value="felipe">Felipe</Option>
                    </Select>
                </>
            )
        },
    ];

    function handleSelectChange(record, index, value) {
        let indexOf = fatura.indexOf(record)
        let _fatura = [...fatura]
        _fatura[indexOf].de = value;
        setFatura(_fatura)
    }

    function calc(_fatura = []) {
        if (_fatura.length === 0) return 0;
        let values = [];

        _fatura.map(f => {
            values = [...values, f.value]
        })

        return (values.reduce((a, b) => a + b) / 100);
    }

    function onDragEnd(result) {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        console.log(source, destination)

        // let indexOf = fatura.indexOf(record)
        let _fatura = [...fatura]
        _fatura[source.index].fiador = destination.droppableId === 'droppableContent1' ? 'mae' : 'felipe';
        setFatura(_fatura)

        // const sourceClone = Array.from('droppableContent1')
        // const destClone = Array.from('droppableContent2')
        // const [removed] = sourceClone.splice(source.index, 1);

        // destClone.splice(destination.index, 0, removed);

        // let foo = {};
        // foo[source.droppableId] = sourceClone;
        // foo[destination.droppableId] = destClone;

        // console.log(foo)

        // if (source.droppableId === destination.droppableId) {
        //     const items = reorder(
        //         this.getList(source.droppableId),
        //         source.index,
        //         destination.index
        //     );

        //     let state = { items };

        //     if (source.droppableId === 'droppable2') {
        //         state = { selected: items };
        //     }

        //     this.setState(state);
        // } else {
        //     const result = move(
        //         this.getList(source.droppableId),
        //         this.getList(destination.droppableId),
        //         source,
        //         destination
        //     );

        //     this.setState({
        //         items: result.droppable,
        //         selected: result.droppable2
        //     });
        // }
    }

    return (
        <Layout>
            <DragDropContext onDragEnd={onDragEnd}>

                {/* <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {provided => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {fatura && fatura.map((item, index) => (
                                <Draggable key={index.toString()} draggableId={index.toString()} index={index}>
                                    {provided => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}>
                                            <p style={{ backgroundColor: 'c1c1c1', padding: 10 }}>
                                                {JSON.stringify(item)}
                                            </p>
                                        </div>)}
                                </Draggable>
                            ))}

                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext> */}

                <Header className="header">
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key="1">nav 1</Menu.Item>
                        <Menu.Item key="2">nav 2</Menu.Item>
                        <Menu.Item key="3">nav 3</Menu.Item>
                    </Menu>
                </Header>
                <Layout>

                    <Sider>
                        <Droppable droppableId="droppableSider">
                            {provided => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}>
                                    {fatura && fatura.map((item, index) => item.fiador === '' ? (
                                        <Draggable key={index.toString()} draggableId={index.toString()} index={index}>
                                            {provided => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}>
                                                    <Card>
                                                        <Row>
                                                            {item.name}
                                                        </Row>
                                                        <Row>
                                                            {item.value / 100}
                                                        </Row>
                                                        <Row>
                                                            <Badge className="site-badge-count-109" count={item.date} style={{ backgroundColor: '#52c41a' }} />
                                                        </Row>
                                                    </Card>
                                                </div>
                                            )}
                                        </Draggable>
                                    ) : null)}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </Sider>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <p>{calc(fatura)}</p>
                        <Content
                            className="site-layout-background"
                            style={{
                                background: '#fff',
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                            }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Droppable droppableId="droppableContent1">
                                    {provided => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}>
                                            <p>{calc(fatura && fatura.filter(f => f.fiador === 'mae'))}</p>

                                            <div style={{ border: '1px solid #000', width: 500, height: 500 }}>
                                                {fatura && fatura.map((item, index) => item.fiador === 'mae' ? (
                                                    <Draggable key={index.toString()} draggableId={index.toString()} index={index}>
                                                        {provided => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}>
                                                                <Card>
                                                                    <Row>
                                                                        {item.name}
                                                                    </Row>
                                                                    <Row>
                                                                        {item.value / 100}
                                                                    </Row>
                                                                    <Row>
                                                                        <Badge className="site-badge-count-109" count={item.date} style={{ backgroundColor: '#52c41a' }} />
                                                                    </Row>
                                                                </Card>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ) : null)}
                                            </div>
                                            {/* <Table dataSource={_fatura.filter(f => f.de === 'mae')} columns={columns} /> */}
                                            {/* {_fatura.map((item, index) => item.fiador === 'mae' ? (

                                                ): null)} */}
                                            {provided.placeholder}
                                        </div>

                                    )}
                                </Droppable>
                                <Droppable droppableId="droppableContent2">
                                    {provided => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}>
                                            <p>{calc(fatura && fatura.filter(f => f.fiador === 'felipe'))}</p>

                                            <div style={{ border: '1px solid #000', width: 500, height: 500 }}>
                                                {fatura && fatura.map((item, index) => item.fiador === 'felipe' ? (
                                                    <Draggable key={index.toString()} draggableId={index.toString()} index={index}>
                                                        {provided => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}>
                                                                <Card>
                                                                    <Row>
                                                                        {item.name}
                                                                    </Row>
                                                                    <Row>
                                                                        {item.value / 100}
                                                                    </Row>
                                                                    <Row>
                                                                        <Badge className="site-badge-count-109" count={item.date} style={{ backgroundColor: '#52c41a' }} />
                                                                    </Row>
                                                                </Card>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ) : null)}
                                            </div>
                                            {/* <Table dataSource={_fatura.filter(f => f.de === 'felipe')} columns={columns} /> */}
                                            {/* {_fatura.map((item, index) => item.fiador === 'felipe' ? (

                                                ): null)} */}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>

                            </div>
                        </Content>

                        {/* <Content
                        className="site-layout-background"
                        style={{
                            background: '#fff',
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                        }}>
                        {loading ? <Skeleton /> : <Table dataSource={fatura.filter(f => f.de === "")} columns={columns} />}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <Table dataSource={_fatura.filter(f => f.de === 'mae')} columns={columns} />
                                {_fatura.map((n, index) => n.de === 'mae' ? <p>{JSON.stringify(n)}</p> : null)}
                                <p>{calc(_fatura.filter(f => f.de === 'mae'))}</p>
                            </div>
                            <div>
                                <Table dataSource={_fatura.filter(f => f.de === 'felipe')} columns={columns} />
                                {_fatura.map((n, index) => n.de === 'felipe' ? <p>{JSON.stringify(n)}</p> : null)}
                                <p>{calc(_fatura.filter(f => f.de === 'felipe'))}</p>
                            </div>
                        </div>

                        <Button onClick={teste}>Teste</Button>
                    </Content> */}
                    </Layout>
                </Layout>
            </DragDropContext>

        </Layout >
    );
}
