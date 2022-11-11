import axios from 'axios';
import React, { useState, useEffect, useRef, useMemo} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

const NoticeModal = (props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => {setShow(false); props.setNoticeShow(false);};
    const handleShow = () => setShow(true);

    useEffect(() => {
        setShow(props.show);
    },);

    return (

        <>
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title style={{"fontWeight": "bold"}}>공지사항</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{"height": "450px"}}>
                <Form>
                    <Form.Group className="form-group">
                        <label className="title" style={{"display": "block", "fontSize" : "medium"}}>{props.selectedNotice.title}</label>
                        <label className="date" style={{"display": "inline-block", "fontWeight" : "100"}}>등록일 {props.selectedNotice.createdDate}</label>
                        <label className="viewCnt" style={{"display": "inline-block", "fontWeight" : "100", "float" : "right"}}>조회수 {props.selectedNotice.viewCnt}</label>
                    </Form.Group>
                </Form>
                <ReactQuill
                    value={props.selectedNotice.contents}
                    readOnly={true}
                    theme={"bubble"}
                    style={{height: "100%", border: "1px solid grey"}}
                />
            </Modal.Body>
            <Modal.Footer style={{"height": "100px"}}>
                
            </Modal.Footer>
        </Modal>
    </>

    );
};

export default NoticeModal;
