import { useState } from "react";
import styled from "styled-components";

const AppLink = () => {
  const [isOpenModal, setIsModalOpen] = useState(true);
  const redireactApp = () => {
    exeDeepLink();
    checkInstallApp();
  };

  function checkInstallApp() {
    function clearTimers() {
      clearInterval(check);
      clearTimeout(timer);
    }

    function isHideWeb() {
      if (document.webkitHidden || document.hidden) {
        clearTimers();
      }
    }
    const check = setInterval(isHideWeb, 200);

    const timer = setTimeout(function() {
      redirectStore();
    }, 500);
  }

  const redirectStore = () => {
    const ua = navigator.userAgent.toLowerCase();

    if (window.confirm("스토어로 이동하시겠습니까?")) {
        window.location.href =
        ua.indexOf("android") > -1
          ? "https://play.google.com/store/apps/details?id=com.skt.tmap.ku"
          : "https://apps.apple.com/kr/app/tmap-%EB%8C%80%EB%A6%AC-%EC%A3%BC%EC%B0%A8-%EC%A0%84%EA%B8%B0%EC%B0%A8%EC%B6%A9%EC%A0%84-%ED%82%A5%EB%B3%B4%EB%93%9C%EB%A5%BC-%ED%8B%B0%EB%A7%B5%EC%97%90%EC%84%9C/id431589174?l=en";
    }
  };

  function exeDeepLink() {
    var url = "tmap://?rGoName=화성프라코&rGoX=126.8526862&rGoY=37.2094373";
    alert(url)
    window.location.href = url;
  }

  return (
    <DeepLinkBlock>
      <div className="modal">
        <p className="title">앱을 여시겠습니까?</p>
        <div className="button-group">
          <button className="open btn" onClick={redireactApp}>
            네 열래요
          </button>
        </div>
      </div>
    </DeepLinkBlock>
  );
};

const DeepLinkBlock = styled.div`
  background: #d1d1d1;
  position: fixed;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  .modal {
    width: 278px;
    height: 171px;
    padding: 26px 14px 14px;
    background: #ffffff;
    box-shadow: 0px 4px 4px rgba(192, 192, 192, 0.25);
    border-radius: 8px;
    position: relative;
    bottom: 50px;
    .title {
      font-weight: bold;
      font-size: 17px;
      margin-bottom: 12px;
    }
    .desc {
      font-size: 12px;
      color: #777777;
    }
    .button-group {
      display: flex;
      justify-content: space-around;
      margin-top: 38px;
      .btn {
        height: 40px;
        width: 120px;
        background: #eeeeee;
        color: #555555;
        font-size: 14px;
        letter-spacing: -1px;
        border-radius: 6px;
      }
      .open {
        background: orange;
        color: #ffffff;
      }
    }
  }
`;

export default AppLink;