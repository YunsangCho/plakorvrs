import axios from 'axios';
import React, { useState, useEffect, useRef, useMemo} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ReactQuill from "react-quill";
import { Temporal } from '@js-temporal/polyfill';
import "react-quill/dist/quill.snow.css";

const Editor = ({ placeholder, value, ...rest }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const QuillRef = useRef();
    const [title, setTitle] = useState("");
    const [contents, setContents] = useState("");

    // 이미지를 업로드 하기 위한 함수
    const imageHandler = () => {
        // 파일을 업로드 하기 위한 input 태그 생성
        const input = document.createElement("input");
        const formData = new FormData();
        let url = "";

        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        // 파일이 input 태그에 담기면 실행 될 함수 
        input.onchange = async () => {
            const file = input.files;
            if (file !== null) {
                formData.append("image", file[0]);
                
                try {
                    //axios를 통해 백엔드 개발자분과 통신했고, 데이터는 폼데이터로 주고받았습니다.
                    const res = "";

                    // 백엔드 개발자 분이 통신 성공시에 보내주는 이미지 url을 변수에 담는다.
                    url = res.data.url;

                    // 커서의 위치를 알고 해당 위치에 이미지 태그를 넣어주는 코드 
                    // 해당 DOM의 데이터가 필요하기에 useRef를 사용한다.
                    const range = QuillRef.current?.getEditor().getSelection()?.index;
                    if (range !== null && range !== undefined) {
                        let quill = QuillRef.current?.getEditor();

                        quill?.setSelection(range, 1);

                        quill?.clipboard.dangerouslyPasteHTML(
                        range,
                        `<img src=${url} alt="이미지 태그가 삽입됩니다." />`
                        );
                    }

                    return { 
                        ...res, success: true 
                    };

                } catch (error) {

                    const err = error;   
                    return { 
                        ...err.response, success: false 
                    };
                }
            }
        };
    };
    

    // 옵션에 상응하는 포맷, 추가해주지 않으면 text editor에 적용된 스타일을 볼수 없음
    const formats = [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "align",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "background",
        "color",
        "link",
        "image",
        "video",
        "width",
    ];
    
    // quill에서 사용할 모듈을 설정하는 코드
    // 원하는 설정을 사용하면 되는데, 저는 아래와 같이 사용했습니다.
    // useMemo를 사용하지 않으면, 키를 입력할 때마다, imageHandler 때문에 focus가 계속 풀리게 됩니다.
    const modules = useMemo(
        () => ({
            toolbar: {
            container: [
                ["bold", "italic", "underline", "strike", "blockquote"],
                [{ size: ["small", false, "large", "huge"] }, { color: [] }],
                [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
                { align: [] },
                ],
                ["image", "video"],
            ],
            handlers: {
                image: imageHandler,
            },
            },
        }), []
    );

    const registerPost = async () => {
        
        if(!title){
            alert("제목을 입력해 주세요.");
            return;
        }
        if(!contents){
            alert("본문 내용을 입력해 주세요.");
            return;
        }
        if(title.length > 27){
            alert("제목이 너무 깁니다.");
            return;
        }

        var setparam = () => {

            var today = Temporal.Now.plainDateISO();
            var time = Temporal.Now.plainTimeISO().toString().substring(0, 8);

            var param ={
                title : title,      //제목
                contents : contents,//내용
                createdDate : today,//작성일자
                createdTime : time, //작성시간
                viewCnt : 0,        //조회수
            }
            return param;
        }
          
        //파라미터 출력
        console.log(setparam());

        //server req
        axios.post("/registerNotice", setparam())
        .then((res)=>{
            console.log(res);
            
            alert("등록되었습니다.");
        })
        .catch((error)=>{
            console.log(error);
        });

    }
    

    return (

        <>
        <Button className="float-end" variant="sm" onClick={handleShow} style={{marginBottom : "26px", height:"40px"}}>
            등록
        </Button>
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title style={{"fontWeight": "bold"}}>공지사항 등록</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{"height": "450px"}}>
                <Form>
                    <Form.Group className="form-group">
                    {/* <div className="d-flex flex-row justify-content-between align-items-center"> */}
                        <input hidden="hidden" />
                        <Form.Control
                        type="text"
                        autoFocus
                        placeholder="제목을 입력해주세요"
                        onChange={(e) => {setTitle(e.target.value)}}
                        />
                    {/* </div> */}
                    </Form.Group>
                </Form>

                {/* // 테마 (bubble, snow, custom) https://quilljs.com/docs/themes/ */}
                <ReactQuill
                    ref={(element) => {
                        if (element !== null) {
                        QuillRef.current = element;
                        }
                    }}
                    value={contents}
                    onChange={setContents}
                    modules={modules}
                    formats={formats}
                    theme="snow"
                    placeholder="내용을 입력해주세요."
                    style={{"height":"310px"}}
                ></ReactQuill>
            </Modal.Body>
            <Modal.Footer style={{"height": "100px"}}>
                <Button variant="sm" onClick={registerPost}>
                    등록
                </Button>
            </Modal.Footer>
        </Modal>
    </>

    );
};

export default Editor;
