import React from "react";
import './Paging.css';
import Pagination from "react-js-pagination";

const Paging = ({totalCount, postPerPage, pageRangeDisplayed, handlePageChange, page}) => {

  return (
    <Pagination
      activePage={page} // 현재 페이지
      itemsCountPerPage={postPerPage} // 한 페이지랑 보여줄 아이템 갯수
      totalItemsCount={totalCount ? totalCount : 0} // 총 아이템 갯수
      pageRangeDisplayed={pageRangeDisplayed}
      prevPageText={"‹"}
      nextPageText={"›"}
      onChange={handlePageChange}
    />
  );
};

export default Paging;