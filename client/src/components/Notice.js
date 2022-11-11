import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { AiOutlineNotification } from 'react-icons/ai';
// import Editor from './Editor';
import NoticeModal from './NoticeModal';
import "./boardTable.css";

const Notice = (props) => {

    const [noticeList, setNoticeList] = useState([]);
    const [trigger, setTrigger] = useState(0);
    const [noticeShow, setNoticeShow] = useState(false);
    const [nid, setNid] = useState("");
    const [selectedNotice, setSelectedNotice] = useState({});

    const getNoticeList = () =>{
        axios.post('/getNoticeList')
        .then((res)=>{
            setNoticeList(res.data.resultList);
        });
    }

    useEffect(()=>{
        getNoticeList();
    }, trigger);

    return (
      <>
        <section className="py-custom1">
          <div className="container px-5">
            <div className="bg-white rounded-3 py-5 px-4 px-md-5 mb-5">
                <div className="text-center mb-5">
                    <div className="feature bg-dark bg-gradient text-white rounded-3 mb-3">
                        <AiOutlineNotification/>
                    </div>
                    <h2 className="fw-bolder">공지사항</h2>
                </div>
                <div className="row gx-5 justify-content-center">
                    <div className="col-lg-12 col-xl-10 responsive">
                        <hr/>
                        <table className="noticeTbl table hover striped">
                            <thead>
                                <tr>
                                    <th>번호</th>
                                    <th>제목</th>
                                    <th>작성자</th>
                                    <th>날짜</th>
                                    <th>조회수</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    noticeList.map((e,i)=>{
                                        return (
                                            <tr onClick={()=>{
                                                                setNid(e._id); 
                                                                setNoticeShow(true);
                                                                setSelectedNotice(e);
                                                            }
                                                        }>
                                                <td style={{"textAlign" :"center"}}>{i+1}</td>
                                                <td>{e.title}</td>
                                                <td>관리자</td>
                                                <td>{e.createdDate}</td>
                                                <td style={{"textAlign" :"center"}}>{e.viewCnt}</td>
                                            </tr>
                                        )
                                    })
                                }
                                <NoticeModal 
                                    selectedNotice={selectedNotice}
                                    show={noticeShow}
                                    setNoticeShow={setNoticeShow}
                                />
                            </tbody>
                        </table>
                        {/* <Editor trigger={setTrigger}/> */}
                    </div>
                    <div className="text-center">
                        <ul className="pagination">
                            <li><a href="#">1</a></li>
                        </ul>
                    </div>
                </div>
            </div>
          </div>
        </section>
    </>
    );
}
export default Notice;