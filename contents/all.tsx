import { useEffect, useState, useRef } from "react"
import type { PlasmoGetStyle } from "plasmo"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = `
    .wrapper {
      position:fixed;
      bottom:10vh;
      left:50vw;
      transform: translateX(-50%);
      padding:10px 3px;
      cursor: move;
    }
      .wrapper:hover{
        background-color: #f1f1f130;
      }
  `
  return style
}

const CustomButton = () => {
  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      // console.log(,message)

      if (message.type === 'lyric') {
        setLyric(message.text)
      }
    })
  }, [])
  useEffect(() => {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    let draggable = wrapperRef.current;
    function onMouseDown(e) {
      isDragging = true;
      offsetX = e.clientX - draggable.offsetLeft;
      offsetY = e.clientY - draggable.offsetTop;
      draggable.style.cursor = 'grabbing';
    }
    function onMouseUp() {
      isDragging = false;
      draggable.style.cursor = 'move';
    }
    function onMouseMove(e) {
      if (isDragging) {
        draggable.style.left = `${e.clientX - offsetX}px`;
        draggable.style.top = `${e.clientY - offsetY}px`;
      }
    }
    draggable.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);

    document.addEventListener('mouseup', onMouseUp);
    return ()=>{
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      draggable.removeEventListener('mousedown', onMouseDown);
    }
  }, [])

  const [lyric, setLyric] = useState('')
  const wrapperRef = useRef(null)
  return <div ref={wrapperRef} className="wrapper">{lyric}</div>
}

export default CustomButton