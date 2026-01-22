import Footer from "../partials/Footer"
import Header from "../partials/header/Header"
import { useState } from 'react';


export const Layout = ({children}) => {

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
        <Header isOpen={isOpen} toggle={toggle} />
        <div style={{minHeight: "90vh"}} className="--pad">
            {children}
        </div>
        <Footer isOpen={isOpen} />
    </>
  )
}
