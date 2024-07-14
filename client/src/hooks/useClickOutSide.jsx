import { useEffect, useRef, useState } from "react";

export default function useClickOutSide(dom) {
  const [show, setShow] = useState(false);
  const nodeRef = useRef(null);
  const elementId = useRef(null)
  useEffect(() => {
    function handleClickOutSide(e) {
      const element = e.target.closest(`#${dom}`)
      if(element){
        elementId.current = element
      }
      if (nodeRef.current && !element) {
        setShow(false);
      }
    }
    document.addEventListener("click", handleClickOutSide);
    return () => {
      document.removeEventListener("click", handleClickOutSide);
    };
  }, []);
  return {
    show,
    setShow,
    nodeRef,
  };
}
