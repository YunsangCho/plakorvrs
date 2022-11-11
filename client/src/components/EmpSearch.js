import axios from 'axios';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

const EmpSearch = (props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [empNameInput, setEmpNameInput] = useState();
    const [returnData, setReturnData] = useState([]);
    const empSearch = (props) => {
        var param = {name : empNameInput};
        axios.post("/empSearch", param)
        .then((res)=>{
            setReturnData(res.data);
        })
    }

    return (
    <>
        <Button variant="sm" onClick={handleShow} style={{marginBottom : "26px", height:"40px"}}>
        <i class="bi bi-search"></i>
        </Button>

        <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>임직원 조회</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
            <Form.Group className="form-group">
                <div className="d-flex flex-row justify-content-between align-items-center">
                    <Form.Label style={{padding:"0", width: "10%"}}>성명</Form.Label>
                    <input hidden="hidden" />
                    <Form.Control
                    type="text"
                    autoFocus
                    value={empNameInput} 
                    onChange={(e) => setEmpNameInput(e.target.value)}
                    onKeyDown={(e) => {if(e.keyCode === 13) empSearch();}}
                    />
                    <Button variant="sm" onClick={empSearch} style={{marginBottom : "26px", height:"40px"}}>
                        <i class="bi bi-search"></i>
                    </Button>
                </div>
            </Form.Group>
            <Table hover className="empSearchTbl">
                <thead>
                    <tr>
                        <th>부서</th>
                        <th>성명</th>
                        <th>연락처</th>
                    </tr>
                </thead>
                <tbody>
                    {returnData.length != 0 ?

                    returnData.map((e, i) => {
                        var tel = e.tel;
                        var splitedTel = tel.split('-');
                        splitedTel[1] = '****';
                        tel = splitedTel.join('-');

                        return(
                            <tr onClick={()=> {
                                props.setEmpNo(e.id); 
                                props.setEmpDept(e.team); 
                                props.setEmpName(e.name); 
                                props.setEmpTel(e.tel);
                                props.setEmpPosition (e.position);
                                handleClose();
                                }}>
                                <td>{e.team}</td>
                                <td>{e.name}</td>
                                <td>{tel}</td>
                            </tr>
                        )
                    })
                    : null
                    }
                </tbody>
            </Table>
            </Form>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
        </Modal>
    </>
    );
}

export default EmpSearch;