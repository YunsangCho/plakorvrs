const Footer = () => {

    return(
        <>
        <footer className="bg-light py-4 mt-auto">
            <div className="container px-5">
                <div className="row align-items-center justify-content-between flex-column flex-sm-row">
                    <div className="col-auto"><div className="small m-0 text-black">Copyright &copy; 
                        Plakor, All rights reserved.</div></div>
                    <div className="col-auto">
                        <a className="link-dark small" href="#!">개인정보처리방침</a>
                        <span className="text-dark mx-1">&middot;</span>
                        <a className="link-dark small" href="#!">고객지원</a>
                    </div>
                </div>
            </div>
        </footer>
        </>
    )
  }

  export default Footer;