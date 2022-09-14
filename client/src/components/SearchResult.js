import React, {useEffect, useState} from 'react';
import { Routes, Route, Link, BrowserRouter } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Paging from "./common/Paging";

const SearchResult = (props) => {

    const [posts, setPosts] = useState(props.resultData); //axios로 받아온 데이터 저장
    const [currentPosts, setCurrentPosts] = useState([]);  //보여줄 포스트
    const [page, setPage] = useState(1); //현재 페이지
    const handlePageChange = (page) => {setPage(page)};
    const [postPerPage] = useState(5);  //페이지당 포스트 갯수
    const indexOfLastPost = page * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
  
    useEffect(() => {
      setCurrentPosts(posts.slice(indexOfFirstPost, indexOfLastPost))
    }, [indexOfFirstPost, indexOfLastPost, page])
  
    return(
      <div className="row gx-5 justify-content-center">
          <div className="col-lg-10 col-xl-10">
              <div className="form-group">
              <table className="table">
                <thead>
                  <tr>
                    <th>신청자</th>
                    <th>담당자</th>
                    <th>담당자연락처</th>
                    <th>방문시간</th>
                    <th>신청일</th>
                    <th>승인상태</th>
                    <th>승인일자</th>
                  </tr>
                </thead>
                <tbody>
                  { currentPosts.map((e, i)=>{
                    var approvalDateStr = "-";

                    if(e.approvalDate){
                      approvalDateStr = e.approvalDate;
                    }

                    return (
                    <tr>
                      <td>{e.visitorName}</td>
                      <td>{e.empName}</td>
                      <td>{e.mngTelStr}</td>
                      <td>{e.visitDateStr + " " + e.startTimeStr + "~" + e.endTimeStr}</td>
                      <td>{e.registerDate.substring(0, 10)}</td>
                      <td>{e.registerState}</td>
                      <td>{approvalDateStr}</td>
                    </tr>
                    )
                  })
                  }
                </tbody>
              </table>
              <Paging totalCount={posts.length} page={page} postPerPage={postPerPage} pageRangeDisplayed={5} handlePageChange={handlePageChange}/>
              <Button as={Link} variant="dark" size="lg" to="/" style={{width: "100%"} }>돌아가기</Button>
              </div>
          </div>
      </div>
    )
  
}

export default SearchResult;