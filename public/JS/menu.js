const navContainer = document.getElementById("nav-container");


// navContainer.innerHTML = `
// <nav style="
//     width: 100%;
//     height: 120px;
//     background: #000000ff;
//     display: flex;
//     align-items: center;
//     justify-content: flex-start;
//     padding-left: 20px;
//     margin: 0;           /* Pegado arriba */
//     box-sizing: border-box;
// ">
//     <img src="../fotos/Logo franco op 2 final.png" 
//          alt="Logo"
//          style="
//             height: 400px;  /* LOGO más grande */
//             object-fit: contain;
//             cursor: pointer;
//          ">
// </nav>
// `;



navContainer.innerHTML = `
<nav style="
    width: 100%;
    height: 120px;
    background: #000000ff;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 20px;
    margin: 0;           /* Pegado arriba */
    box-sizing: border-box;
">
    <img src="../fotos/Logo franco op 2 final.png"
     alt="Logo"
     style="
        height: clamp(90px, 60vw, 400px);
        width: auto;
        object-fit: contain;
     ">


</nav>
`;